import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";

const ADMIN_EMAIL = "dumikanam@gmail.com";

export function useIsAdmin() {
  const { user } = useAuth();
  return user?.email === ADMIN_EMAIL;
}

export function useAdminData() {
  const [profiles, setProfiles] = useState<any[]>([]);
  const [products, setProducts] = useState<any[]>([]);
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchAll = async () => {
    setLoading(true);
    const [p, pr, o] = await Promise.all([
      supabase.from("profiles").select("*").order("created_at", { ascending: false }),
      supabase.from("products").select("*, product_images(*)").order("created_at", { ascending: false }),
      supabase.from("orders").select("*, order_items(*)").order("created_at", { ascending: false }),
    ]);
    setProfiles(p.data || []);
    setProducts((pr.data || []).map((x: any) => ({ ...x, images: x.product_images || [] })));
    setOrders(o.data || []);
    setLoading(false);
  };

  useEffect(() => { fetchAll(); }, []);

  return { profiles, products, orders, loading, refetch: fetchAll };
}
