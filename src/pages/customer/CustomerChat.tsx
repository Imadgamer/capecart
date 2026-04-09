import { useState, useRef, useEffect } from "react";
import { MessageCircle, Send, ImagePlus, ArrowLeft, Loader2 } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";
import { useConversations, useMessages, sendMessage, uploadChatImage } from "@/hooks/useChat";

const CustomerChat = () => {
  const { user } = useAuth();
  const { conversations, loading } = useConversations();
  const [selectedConv, setSelectedConv] = useState<string | null>(null);
  const [text, setText] = useState("");
  const { messages } = useMessages(selectedConv);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => { messagesEndRef.current?.scrollIntoView({ behavior: "smooth" }); }, [messages]);

  const handleSend = async () => {
    if (!text.trim() || !selectedConv || !user) return;
    const msg = text.trim();
    setText("");
    await sendMessage(selectedConv, user.id, msg);
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !selectedConv || !user) return;
    const { url } = await uploadChatImage(user.id, file);
    if (url) await sendMessage(selectedConv, user.id, "", "image", url);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  if (loading) return <div className="flex justify-center py-20"><Loader2 className="w-8 h-8 animate-spin text-primary" /></div>;

  if (selectedConv) {
    return (
      <div className="flex flex-col h-[calc(100vh-3.5rem)]">
        <div className="px-4 py-3 border-b border-border flex items-center gap-3 bg-card">
          <button onClick={() => setSelectedConv(null)} className="p-1 hover:bg-secondary rounded-lg"><ArrowLeft className="w-5 h-5" /></button>
          <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
            <span className="text-xs font-bold text-primary">S</span>
          </div>
          <p className="font-semibold text-sm">{conversations.find(c => c.id === selectedConv)?.other_user?.display_name || "Seller"}</p>
        </div>
        <div className="flex-1 overflow-y-auto p-4 space-y-3">
          {messages.map(msg => (
            <div key={msg.id} className={`flex ${msg.sender_id === user?.id ? "justify-end" : "justify-start"}`}>
              <div className={`max-w-[75%] rounded-2xl px-4 py-2.5 ${msg.sender_id === user?.id ? "bg-primary text-primary-foreground" : "bg-secondary text-foreground"}`}>
                {msg.image_url && <img src={msg.image_url} alt="" className="rounded-xl max-w-full mb-2" />}
                {msg.content && <p className="text-sm whitespace-pre-wrap">{msg.content}</p>}
                <p className={`text-[10px] mt-1 ${msg.sender_id === user?.id ? "text-primary-foreground/60" : "text-muted-foreground"}`}>
                  {new Date(msg.created_at).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                </p>
              </div>
            </div>
          ))}
          <div ref={messagesEndRef} />
        </div>
        <div className="p-3 border-t border-border bg-card flex gap-2">
          <input ref={fileInputRef} type="file" accept="image/*" className="hidden" onChange={handleImageUpload} />
          <button onClick={() => fileInputRef.current?.click()} className="p-2 hover:bg-secondary rounded-lg"><ImagePlus className="w-5 h-5 text-muted-foreground" /></button>
          <Input value={text} onChange={e => setText(e.target.value)} placeholder="Type a message..." className="flex-1 rounded-xl" onKeyDown={e => e.key === "Enter" && handleSend()} />
          <Button size="icon" className="rounded-xl shrink-0" onClick={handleSend} disabled={!text.trim()}><Send className="w-4 h-4" /></Button>
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 md:p-6 max-w-5xl mx-auto animate-fade-in">
      <h1 className="text-xl font-heading font-bold mb-1">Messages</h1>
      <p className="text-xs text-muted-foreground mb-6">Chat with sellers about your orders</p>
      {conversations.length === 0 ? (
        <Card className="p-12 text-center">
          <MessageCircle className="w-16 h-16 text-muted-foreground/20 mx-auto mb-4" />
          <h3 className="text-lg font-heading font-semibold">No messages yet</h3>
          <p className="text-sm text-muted-foreground">Your conversations with sellers will appear here</p>
        </Card>
      ) : (
        <div className="space-y-2">
          {conversations.map(conv => (
            <Card key={conv.id} className="p-3 flex items-center gap-3 cursor-pointer hover:bg-secondary/50 transition-colors" onClick={() => setSelectedConv(conv.id)}>
              <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                <span className="text-sm font-bold text-primary">{(conv.other_user?.display_name || "S")[0].toUpperCase()}</span>
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold truncate">{conv.other_user?.display_name || "Seller"}</p>
                <p className="text-xs text-muted-foreground truncate">{conv.last_message || "No messages"}</p>
              </div>
              <p className="text-[10px] text-muted-foreground shrink-0">
                {conv.last_message_at ? new Date(conv.last_message_at).toLocaleDateString() : ""}
              </p>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default CustomerChat;
