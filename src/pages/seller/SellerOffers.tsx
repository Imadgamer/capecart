import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Tag, Percent, Plus, Loader2 } from "lucide-react";
import { useState } from "react";
import { useSellerProducts, updateProduct } from "@/hooks/useProducts";
import { toast } from "sonner";

const SellerOffers = () => {
  const { products, loading, refetch } = useSellerProducts();

  const handleUpdateOffer = async (productId: string, offer: string) => {
    await updateProduct(productId, { offer: offer || null } as any);
    toast.success("Offer updated");
    refetch();
  };

  if (loading) return <div className="flex justify-center py-20"><Loader2 className="w-8 h-8 animate-spin text-primary" /></div>;

  return (
    <div className="p-4 md:p-6 max-w-5xl mx-auto animate-fade-in">
      <h1 className="text-xl font-heading font-bold mb-1">Offers & Deals</h1>
      <p className="text-xs text-muted-foreground mb-6">Manage discounts on your products</p>

      {products.length === 0 ? (
        <Card className="p-12 text-center">
          <Tag className="w-16 h-16 text-muted-foreground/20 mx-auto mb-4" />
          <h3 className="text-lg font-heading font-semibold">No products</h3>
          <p className="text-sm text-muted-foreground">Add products first to create offers</p>
        </Card>
      ) : (
        <div className="space-y-3">
          {products.map(p => (
            <Card key={p.id} className="p-4">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-12 h-12 rounded-xl bg-secondary overflow-hidden shrink-0">
                  {p.images?.[0] ? <img src={p.images[0].image_url} alt="" className="w-full h-full object-cover" /> : null}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold truncate">{p.name}</p>
                  <p className="text-xs text-primary font-bold">${p.price}</p>
                </div>
              </div>
              <div className="flex gap-2">
                <Input
                  defaultValue={p.offer || ""}
                  placeholder="e.g., Buy 2 Get 1 Free"
                  className="flex-1 h-9 rounded-lg text-sm"
                  onBlur={e => handleUpdateOffer(p.id, e.target.value)}
                />
                {p.offer && <div className="flex items-center gap-1 text-xs text-destructive font-semibold"><Percent className="w-3 h-3" /> Active</div>}
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default SellerOffers;
