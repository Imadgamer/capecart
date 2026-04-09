import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";

export interface OrderItem {
  id: string;
  order_id: string;
  product_id: string;
  quantity: number;
  unit_price: number;
  selected_size: string | null;
  selected_color: string | null;
  product?: { name: string; images?: { image_url: string }[] };
}

export interface Order {
  id: string;
  buyer_id: string;
  seller_id: string;
  status: string;
  total_amount: number;
  delivery_date: string | null;
  delivery_otp: string | null;
  phone: string | null;
  address_street: string | null;
  address_city: string | null;
  address_country: string | null;
  address_house_no: string | null;
  address_zip: string | null;
  created_at: string;
  items?: OrderItem[];
  buyer_profile?: { display_name: string | null; phone: string | null };
  seller_profile?: { display_name: string | null; business_name: string | null };
}

export function useSellerOrders() {
  const { user } = useAuth();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchOrders = async () => {
    if (!user) return;
    const { data } = await supabase
      .from("orders")
      .select("*, order_items(*, products:product_id(name, product_images(*)))")
      .eq("seller_id", user.id)
      .order("created_at", { ascending: false });

    const mapped = (data || []).map((o: any) => ({
      ...o,
      items: (o.order_items || []).map((i: any) => ({
        ...i,
        product: i.products ? { name: i.products.name, images: i.products.product_images } : undefined,
      })),
    }));
    setOrders(mapped);
    setLoading(false);
  };

  useEffect(() => { fetchOrders(); }, [user]);
  return { orders, loading, refetch: fetchOrders };
}

export function useCustomerOrders() {
  const { user } = useAuth();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchOrders = async () => {
    if (!user) return;
    const { data } = await supabase
      .from("orders")
      .select("*, order_items(*, products:product_id(name, product_images(*)))")
      .eq("buyer_id", user.id)
      .order("created_at", { ascending: false });

    const mapped = (data || []).map((o: any) => ({
      ...o,
      items: (o.order_items || []).map((i: any) => ({
        ...i,
        product: i.products ? { name: i.products.name, images: i.products.product_images } : undefined,
      })),
    }));
    setOrders(mapped);
    setLoading(false);
  };

  useEffect(() => { fetchOrders(); }, [user]);
  return { orders, loading, refetch: fetchOrders };
}

export async function createOrder(order: {
  buyer_id: string;
  seller_id: string;
  total_amount: number;
  phone: string;
  address_street: string;
  address_city: string;
  address_country: string;
  address_house_no: string;
  address_zip: string;
  items: { product_id: string; quantity: number; unit_price: number; selected_size?: string; selected_color?: string }[];
}) {
  const otp = Math.floor(100000 + Math.random() * 900000).toString();
  const { items, ...orderData } = order;
  
  const { data, error } = await supabase
    .from("orders")
    .insert({ ...orderData, delivery_otp: otp })
    .select()
    .single();

  if (error || !data) return { data: null, error };

  const orderItems = items.map(item => ({
    order_id: data.id,
    ...item,
  }));
  await supabase.from("order_items").insert(orderItems);

  return { data: { ...data, delivery_otp: otp }, error: null };
}

export async function updateOrderStatus(orderId: string, status: string, deliveryDate?: string) {
  const updates: any = { status };
  if (deliveryDate) updates.delivery_date = deliveryDate;
  return supabase.from("orders").update(updates).eq("id", orderId);
}
