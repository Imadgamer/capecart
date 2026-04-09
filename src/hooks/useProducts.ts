import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";

export interface Product {
  id: string;
  seller_id: string;
  name: string;
  description: string | null;
  price: number;
  unit: string;
  category: string;
  offer: string | null;
  sizes: string[];
  colors: string[];
  stock: number;
  video_url: string | null;
  custom_info: string | null;
  is_published: boolean;
  created_at: string;
  updated_at: string;
  images?: ProductImage[];
  seller_profile?: { display_name: string | null; business_name: string | null; avatar_url: string | null };
}

export interface ProductImage {
  id: string;
  product_id: string;
  image_url: string;
  display_order: number;
}

export function useSellerProducts() {
  const { user } = useAuth();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchProducts = async () => {
    if (!user) return;
    const { data } = await supabase
      .from("products")
      .select("*, product_images(*)")
      .eq("seller_id", user.id)
      .order("created_at", { ascending: false });
    
    const mapped = (data || []).map((p: any) => ({
      ...p,
      images: p.product_images || [],
    }));
    setProducts(mapped);
    setLoading(false);
  };

  useEffect(() => { fetchProducts(); }, [user]);

  return { products, loading, refetch: fetchProducts };
}

export function useAllProducts(category?: string | null) {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchProducts = async (search?: string) => {
    let query = supabase
      .from("products")
      .select("*, product_images(*)")
      .eq("is_published", true)
      .order("created_at", { ascending: false });

    if (category) {
      query = query.eq("category", category);
    }
    if (search) {
      query = query.ilike("name", `%${search}%`);
    }

    const { data } = await query;
    const mapped = (data || []).map((p: any) => ({
      ...p,
      images: p.product_images || [],
    }));
    setProducts(mapped);
    setLoading(false);
  };

  useEffect(() => { fetchProducts(); }, [category]);

  return { products, loading, fetchProducts };
}

export async function createProduct(
  sellerId: string,
  product: Omit<Product, "id" | "seller_id" | "created_at" | "updated_at" | "images" | "seller_profile">,
  imageUrls: string[]
) {
  const { data, error } = await supabase
    .from("products")
    .insert({
      seller_id: sellerId,
      name: product.name,
      description: product.description,
      price: product.price,
      unit: product.unit,
      category: product.category,
      offer: product.offer,
      sizes: product.sizes,
      colors: product.colors,
      stock: product.stock,
      video_url: product.video_url,
      custom_info: product.custom_info,
      is_published: product.is_published,
    })
    .select()
    .single();

  if (error || !data) return { error };

  if (imageUrls.length > 0) {
    const imageInserts = imageUrls.map((url, i) => ({
      product_id: data.id,
      image_url: url,
      display_order: i,
    }));
    await supabase.from("product_images").insert(imageInserts);
  }

  return { data, error: null };
}

export async function updateProduct(
  productId: string,
  updates: Partial<Product>
) {
  const { images, seller_profile, ...rest } = updates as any;
  const { data, error } = await supabase
    .from("products")
    .update(rest)
    .eq("id", productId)
    .select()
    .single();
  return { data, error };
}

export async function deleteProduct(productId: string) {
  return supabase.from("products").delete().eq("id", productId);
}

export async function uploadProductImage(sellerId: string, file: File) {
  const ext = file.name.split(".").pop();
  const path = `${sellerId}/${Date.now()}.${ext}`;
  const { error } = await supabase.storage.from("product-images").upload(path, file);
  if (error) return { url: null, error };
  const { data } = supabase.storage.from("product-images").getPublicUrl(path);
  return { url: data.publicUrl, error: null };
}
