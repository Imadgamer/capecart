import { Card } from "@/components/ui/card";
import { Star, ShoppingBag, Loader2 } from "lucide-react";
import { useCustomerOrders } from "@/hooks/useOrders";

const CustomerReviews = () => {
  const { orders, loading } = useCustomerOrders();
  const delivered = orders.filter(o => o.status === "delivered");

  if (loading) return <div className="flex justify-center py-20"><Loader2 className="w-8 h-8 animate-spin text-primary" /></div>;

  return (
    <div className="p-4 md:p-6 max-w-3xl mx-auto animate-fade-in">
      <h1 className="text-xl font-heading font-bold mb-1">My Reviews</h1>
      <p className="text-xs text-muted-foreground mb-6">Products you can review</p>

      {delivered.length === 0 ? (
        <Card className="p-12 text-center">
          <Star className="w-16 h-16 text-muted-foreground/20 mx-auto mb-4" />
          <h3 className="text-lg font-heading font-semibold">No reviews yet</h3>
          <p className="text-sm text-muted-foreground">Once your orders are delivered, you can leave reviews here</p>
        </Card>
      ) : (
        <div className="space-y-3">
          {delivered.map(order => (
            <Card key={order.id} className="p-4">
              <div className="flex items-center justify-between mb-2">
                <p className="text-sm font-semibold">Order #{order.id.slice(0, 8)}</p>
                <p className="text-xs text-muted-foreground">{new Date(order.created_at).toLocaleDateString()}</p>
              </div>
              {order.items?.map(item => (
                <div key={item.id} className="flex items-center gap-3 py-2">
                  <ShoppingBag className="w-5 h-5 text-muted-foreground" />
                  <div className="flex-1">
                    <p className="text-sm font-medium">{item.product?.name || "Product"}</p>
                    <div className="flex gap-0.5 mt-1">
                      {[1,2,3,4,5].map(s => (
                        <Star key={s} className="w-4 h-4 text-muted-foreground/30 cursor-pointer hover:text-warning transition-colors" />
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default CustomerReviews;
