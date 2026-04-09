import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useParams } from "react-router-dom";
import { ArrowLeft, ShoppingCart, Heart, ChevronLeft, ChevronRight, Tag, Package, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { supabase } from "@/integrations/supabase/client";
import type { Product } from "@/hooks/useProducts";

const ProductDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [currentImage, setCurrentImage] = useState(0);
  const [selectedSize, setSelectedSize] = useState("");
  const [selectedColor, setSelectedColor] = useState("");
  const [quantity, setQuantity] = useState(1);

  useEffect(() => {
    const fetch = async () => {
      if (!id) return;
      const { data } = await supabase
        .from("products")
        .select("*, product_images(*)")
        .eq("id", id)
        .single();
      if (data) {
        setProduct({ ...data, images: (data as any).product_images || [] } as Product);
        if (data.sizes?.length) setSelectedSize(data.sizes[0]);
        if (data.colors?.length) setSelectedColor(data.colors[0]);
      }
      setLoading(false);
    };
    fetch();
  }, [id]);

  if (loading) return <div className="flex justify-center py-20"><Loader2 className="w-8 h-8 animate-spin text-primary" /></div>;
  if (!product) return <div className="p-4 text-center"><p>Product not found</p></div>;

  const images = product.images || [];
  const hasMultipleImages = images.length > 1;

  const handleBuy = () => {
    const cartItem = {
      product_id: product.id,
      seller_id: product.seller_id,
      name: product.name,
      price: product.price,
      unit: product.unit,
      quantity,
      selected_size: selectedSize || null,
      selected_color: selectedColor || null,
      image_url: images[0]?.image_url || null,
      offer: product.offer,
    };
    // Store in localStorage cart
    const existing = JSON.parse(localStorage.getItem("capecart_cart") || "[]");
    existing.push(cartItem);
    localStorage.setItem("capecart_cart", JSON.stringify(existing));
    navigate("/customer/cart");
  };

  return (
    <div className="animate-fade-in pb-24">
      {/* Header */}
      <div className="px-4 pt-4 pb-2 flex items-center justify-between">
        <button onClick={() => navigate(-1)} className="p-2 rounded-lg hover:bg-secondary"><ArrowLeft className="w-5 h-5" /></button>
        <button onClick={() => navigate("/customer/cart")} className="p-2 rounded-lg hover:bg-secondary"><ShoppingCart className="w-5 h-5" /></button>
      </div>

      {/* Image carousel */}
      <div className="relative bg-secondary">
        <div className="aspect-square overflow-hidden">
          {images.length > 0 ? (
            <img src={images[currentImage].image_url} alt={product.name} className="w-full h-full object-cover" />
          ) : (
            <div className="w-full h-full flex items-center justify-center"><Package className="w-16 h-16 text-muted-foreground/20" /></div>
          )}
        </div>
        {hasMultipleImages && (
          <>
            <button onClick={() => setCurrentImage(i => (i - 1 + images.length) % images.length)} className="absolute left-2 top-1/2 -translate-y-1/2 w-8 h-8 bg-background/80 rounded-full flex items-center justify-center"><ChevronLeft className="w-4 h-4" /></button>
            <button onClick={() => setCurrentImage(i => (i + 1) % images.length)} className="absolute right-2 top-1/2 -translate-y-1/2 w-8 h-8 bg-background/80 rounded-full flex items-center justify-center"><ChevronRight className="w-4 h-4" /></button>
            <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1.5">
              {images.map((_, i) => (
                <div key={i} className={`w-2 h-2 rounded-full transition-colors ${i === currentImage ? "bg-primary" : "bg-foreground/30"}`} />
              ))}
            </div>
          </>
        )}
        {product.offer && <Badge className="absolute top-3 left-3 bg-destructive"><Tag className="w-3 h-3 mr-1" /> {product.offer}</Badge>}
      </div>

      {/* Image thumbnails */}
      {images.length > 1 && (
        <div className="px-4 py-3 flex gap-2 overflow-x-auto scrollbar-hide">
          {images.map((img, i) => (
            <button key={i} onClick={() => setCurrentImage(i)} className={`shrink-0 w-16 h-16 rounded-xl overflow-hidden border-2 transition-colors ${i === currentImage ? "border-primary" : "border-transparent"}`}>
              <img src={img.image_url} alt="" className="w-full h-full object-cover" />
            </button>
          ))}
        </div>
      )}

      {/* Video */}
      {product.video_url && (
        <div className="px-4 py-2">
          <iframe src={product.video_url} className="w-full aspect-video rounded-xl" allowFullScreen />
        </div>
      )}

      {/* Product Info */}
      <div className="px-4 py-4 space-y-4">
        <div>
          <h1 className="text-xl font-heading font-bold text-foreground">{product.name}</h1>
          <div className="flex items-baseline gap-2 mt-1">
            <span className="text-2xl font-bold text-primary">${product.price}</span>
            <span className="text-sm text-muted-foreground">{product.unit}</span>
          </div>
        </div>

        {product.description && (
          <div>
            <h3 className="text-sm font-semibold mb-1">Description</h3>
            <p className="text-sm text-muted-foreground leading-relaxed">{product.description}</p>
          </div>
        )}

        {/* Sizes */}
        {product.sizes.length > 0 && (
          <div>
            <h3 className="text-sm font-semibold mb-2">Size</h3>
            <div className="flex flex-wrap gap-2">
              {product.sizes.map(size => (
                <button key={size} onClick={() => setSelectedSize(size)} className={`px-4 py-2 rounded-lg text-sm font-medium border transition-colors ${selectedSize === size ? "border-primary bg-primary/10 text-primary" : "border-border text-muted-foreground"}`}>{size}</button>
              ))}
            </div>
          </div>
        )}

        {/* Colors */}
        {product.colors.length > 0 && (
          <div>
            <h3 className="text-sm font-semibold mb-2">Color</h3>
            <div className="flex flex-wrap gap-2">
              {product.colors.map(color => (
                <button key={color} onClick={() => setSelectedColor(color)} className={`px-4 py-2 rounded-lg text-sm font-medium border transition-colors ${selectedColor === color ? "border-primary bg-primary/10 text-primary" : "border-border text-muted-foreground"}`}>{color}</button>
              ))}
            </div>
          </div>
        )}

        {/* Quantity */}
        <div>
          <h3 className="text-sm font-semibold mb-2">Quantity</h3>
          <div className="flex items-center gap-3">
            <button onClick={() => setQuantity(q => Math.max(1, q - 1))} className="w-10 h-10 rounded-xl border border-border flex items-center justify-center text-lg font-bold hover:bg-secondary">-</button>
            <span className="text-lg font-bold w-12 text-center">{quantity}</span>
            <button onClick={() => setQuantity(q => q + 1)} className="w-10 h-10 rounded-xl border border-border flex items-center justify-center text-lg font-bold hover:bg-secondary">+</button>
          </div>
        </div>

        {product.custom_info && (
          <div>
            <h3 className="text-sm font-semibold mb-1">Additional Info</h3>
            <p className="text-sm text-muted-foreground">{product.custom_info}</p>
          </div>
        )}

        {product.stock !== null && product.stock > 0 && (
          <p className="text-xs text-muted-foreground">{product.stock} in stock</p>
        )}
      </div>

      {/* Bottom bar */}
      <div className="fixed bottom-0 left-0 right-0 p-4 bg-card border-t border-border flex gap-3">
        <Button variant="outline" size="icon" className="rounded-xl shrink-0 h-12 w-12"><Heart className="w-5 h-5" /></Button>
        <Button className="flex-1 h-12 rounded-xl text-base font-semibold" onClick={handleBuy}>
          <ShoppingCart className="w-4 h-4 mr-2" /> Add to Cart — ${(product.price * quantity).toFixed(2)}
        </Button>
      </div>
    </div>
  );
};

export default ProductDetail;
