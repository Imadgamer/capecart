import { Card } from "@/components/ui/card";
import { Megaphone, Loader2 } from "lucide-react";
import { useSellerProducts } from "@/hooks/useProducts";

const SellerPromotions = () => {
  const { products, loading } = useSellerProducts();
  const withOffers = products.filter(p => p.offer);

  if (loading) return <div className="flex justify-center py-20"><Loader2 className="w-8 h-8 animate-spin text-primary" /></div>;

  return (
    <div className="p-4 md:p-6 max-w-3xl mx-auto animate-fade-in">
      <h1 className="text-xl font-heading font-bold mb-1">Promotions</h1>
      <p className="text-xs text-muted-foreground mb-6">Active promotions on your products</p>

      {withOffers.length === 0 ? (
        <Card className="p-12 text-center">
          <Megaphone className="w-16 h-16 text-muted-foreground/20 mx-auto mb-4" />
          <h3 className="text-lg font-heading font-semibold">No active promotions</h3>
          <p className="text-sm text-muted-foreground">Add offers to your products from the Offers page</p>
        </Card>
      ) : (
        <div className="space-y-3">
          {withOffers.map(p => (
            <Card key={p.id} className="p-4 flex items-center gap-3">
              <div className="w-14 h-14 rounded-xl bg-secondary overflow-hidden shrink-0">
                {p.images?.[0] ? <img src={p.images[0].image_url} alt="" className="w-full h-full object-cover" /> : null}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold truncate">{p.name}</p>
                <p className="text-xs text-primary font-bold">${p.price}</p>
                <p className="text-xs text-destructive font-semibold mt-0.5">{p.offer}</p>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default SellerPromotions;
