import { useEffect, useState, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";

export interface Conversation {
  id: string;
  buyer_id: string;
  seller_id: string;
  order_id: string | null;
  last_message: string | null;
  last_message_at: string | null;
  created_at: string;
  other_user?: { display_name: string | null; avatar_url: string | null };
}

export interface Message {
  id: string;
  conversation_id: string;
  sender_id: string;
  content: string | null;
  image_url: string | null;
  message_type: string;
  created_at: string;
}

export function useConversations() {
  const { user } = useAuth();
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchConversations = async () => {
    if (!user) return;
    const { data } = await supabase
      .from("conversations")
      .select("*")
      .or(`buyer_id.eq.${user.id},seller_id.eq.${user.id}`)
      .order("last_message_at", { ascending: false });
    
    // Fetch other user profiles
    const convs = data || [];
    const otherIds = convs.map(c => c.buyer_id === user.id ? c.seller_id : c.buyer_id);
    const uniqueIds = [...new Set(otherIds)];
    
    let profiles: any[] = [];
    if (uniqueIds.length > 0) {
      const { data: p } = await supabase.from("profiles").select("user_id, display_name, avatar_url").in("user_id", uniqueIds);
      profiles = p || [];
    }

    const mapped = convs.map(c => {
      const otherId = c.buyer_id === user.id ? c.seller_id : c.buyer_id;
      const prof = profiles.find(p => p.user_id === otherId);
      return { ...c, other_user: prof || null };
    });

    setConversations(mapped);
    setLoading(false);
  };

  useEffect(() => { fetchConversations(); }, [user]);

  // Realtime
  useEffect(() => {
    if (!user) return;
    const channel = supabase
      .channel("conversations-updates")
      .on("postgres_changes", { event: "*", schema: "public", table: "conversations" }, () => {
        fetchConversations();
      })
      .subscribe();
    return () => { supabase.removeChannel(channel); };
  }, [user]);

  return { conversations, loading, refetch: fetchConversations };
}

export function useMessages(conversationId: string | null) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchMessages = useCallback(async () => {
    if (!conversationId) return;
    const { data } = await supabase
      .from("messages")
      .select("*")
      .eq("conversation_id", conversationId)
      .order("created_at", { ascending: true });
    setMessages(data || []);
    setLoading(false);
  }, [conversationId]);

  useEffect(() => { fetchMessages(); }, [fetchMessages]);

  // Realtime
  useEffect(() => {
    if (!conversationId) return;
    const channel = supabase
      .channel(`messages-${conversationId}`)
      .on("postgres_changes", {
        event: "INSERT",
        schema: "public",
        table: "messages",
        filter: `conversation_id=eq.${conversationId}`,
      }, (payload) => {
        setMessages(prev => [...prev, payload.new as Message]);
      })
      .subscribe();
    return () => { supabase.removeChannel(channel); };
  }, [conversationId]);

  return { messages, loading, refetch: fetchMessages };
}

export async function sendMessage(
  conversationId: string,
  senderId: string,
  content: string,
  messageType: string = "text",
  imageUrl?: string
) {
  const { error } = await supabase.from("messages").insert({
    conversation_id: conversationId,
    sender_id: senderId,
    content,
    message_type: messageType,
    image_url: imageUrl || null,
  });

  if (!error) {
    await supabase.from("conversations").update({
      last_message: content || "📷 Image",
      last_message_at: new Date().toISOString(),
    }).eq("id", conversationId);
  }

  return { error };
}

export async function getOrCreateConversation(buyerId: string, sellerId: string, orderId?: string) {
  // Check existing
  const { data: existing } = await supabase
    .from("conversations")
    .select("*")
    .eq("buyer_id", buyerId)
    .eq("seller_id", sellerId)
    .maybeSingle();

  if (existing) return { data: existing, error: null };

  const { data, error } = await supabase
    .from("conversations")
    .insert({ buyer_id: buyerId, seller_id: sellerId, order_id: orderId || null })
    .select()
    .single();

  return { data, error };
}

export async function uploadChatImage(userId: string, file: File) {
  const ext = file.name.split(".").pop();
  const path = `${userId}/${Date.now()}.${ext}`;
  const { error } = await supabase.storage.from("chat-images").upload(path, file);
  if (error) return { url: null, error };
  const { data } = supabase.storage.from("chat-images").getPublicUrl(path);
  return { url: data.publicUrl, error: null };
}
