import { Card } from "@/components/ui/card";
import { Heart, Loader2, ShoppingBag } from "lucide-react";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";

const CustomerWishlist = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [items, setItems] = useState<any[]>([]);

  useEffect(() => {
    const stored = JSON.parse(localStorage.getItem(`capecart_wishlist_${user?.id}`) || "[]");
    setItems(stored);
  }, [user]);

  const removeFromWishlist = (productId: string) => {
    const newItems = items.filter(i => i.product_id !== productId);
    setItems(newItems);
    localStorage.setItem(`capecart_wishlist_${user?.id}`, JSON.stringify(newItems));
  };

  return (
    <div className="p-4 md:p-6 max-w-5xl mx-auto animate-fade-in">
      <h1 className="text-xl font-heading font-bold mb-1">Wishlist</h1>
      <p className="text-xs text-muted-foreground mb-6">Products you've saved for later</p>

      {items.length === 0 ? (
        <Card className="p-12 text-center">
          <Heart className="w-16 h-16 text-muted-foreground/20 mx-auto mb-4" />
          <h3 className="text-lg font-heading font-semibold">Wishlist is empty</h3>
          <p className="text-sm text-muted-foreground">Browse products and tap the heart icon to save them here</p>
        </Card>
      ) : (
        <div className="grid grid-cols-2 gap-3">
          {items.map((item: any) => (
            <Card key={item.product_id} className="overflow-hidden cursor-pointer" onClick={() => navigate(`/customer/product/${item.product_id}`)}>
              <div className="aspect-square bg-secondary">
                {item.image_url ? <img src={item.image_url} alt={item.name} className="w-full h-full object-cover" /> :
                <div className="w-full h-full flex items-center justify-center"><ShoppingBag className="w-8 h-8 text-muted-foreground/20" /></div>}
              </div>
              <div className="p-3">
                <p className="text-xs font-medium truncate">{item.name}</p>
                <p className="text-sm font-bold text-primary mt-1">${item.price}</p>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default CustomerWishlist;
