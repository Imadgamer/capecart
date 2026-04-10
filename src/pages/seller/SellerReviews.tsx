import { Card } from "@/components/ui/card";
import { Star, Loader2, Package } from "lucide-react";
import { useSellerOrders } from "@/hooks/useOrders";

const SellerReviews = () => {
  const { orders, loading } = useSellerOrders();
  const delivered = orders.filter(o => o.status === "delivered");

  if (loading) return <div className="flex justify-center py-20"><Loader2 className="w-8 h-8 animate-spin text-primary" /></div>;

  return (
    <div className="p-4 md:p-6 max-w-3xl mx-auto animate-fade-in">
      <h1 className="text-xl font-heading font-bold mb-1">Reviews</h1>
      <p className="text-xs text-muted-foreground mb-6">Customer feedback on your products</p>

      {delivered.length === 0 ? (
        <Card className="p-12 text-center">
          <Star className="w-16 h-16 text-muted-foreground/20 mx-auto mb-4" />
          <h3 className="text-lg font-heading font-semibold">No reviews yet</h3>
          <p className="text-sm text-muted-foreground">Reviews will appear here after customers receive their orders</p>
        </Card>
      ) : (
        <div className="space-y-3">
          {delivered.map(o => (
            <Card key={o.id} className="p-4">
              <div className="flex items-center justify-between mb-2">
                <p className="text-sm font-semibold">Order #{o.id.slice(0, 8)}</p>
                <p className="text-xs text-muted-foreground">{new Date(o.created_at).toLocaleDateString()}</p>
              </div>
              <div className="flex gap-0.5 mb-2">
                {[1,2,3,4,5].map(s => (
                  <Star key={s} className={`w-4 h-4 ${s <= 4 ? "text-warning fill-warning" : "text-muted-foreground/30"}`} />
                ))}
              </div>
              <p className="text-xs text-muted-foreground">Amount: ${Number(o.total_amount).toFixed(2)}</p>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default SellerReviews;
