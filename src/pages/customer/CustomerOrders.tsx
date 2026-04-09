import { Loader2, Package } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useCustomerOrders } from "@/hooks/useOrders";

const statusColors: Record<string, string> = {
  pending: "bg-yellow-100 text-yellow-800",
  confirmed: "bg-blue-100 text-blue-800",
  shipped: "bg-purple-100 text-purple-800",
  delivered: "bg-green-100 text-green-800",
  cancelled: "bg-red-100 text-red-800",
};

const CustomerOrders = () => {
  const { orders, loading } = useCustomerOrders();

  if (loading) return <div className="flex justify-center py-20"><Loader2 className="w-8 h-8 animate-spin text-primary" /></div>;

  return (
    <div className="p-4 md:p-6 max-w-5xl mx-auto animate-fade-in">
      <h1 className="text-xl font-heading font-bold mb-1">My Orders</h1>
      <p className="text-xs text-muted-foreground mb-6">Track your purchases and deliveries</p>

      {orders.length === 0 ? (
        <Card className="p-12 text-center">
          <Package className="w-16 h-16 text-muted-foreground/20 mx-auto mb-4" />
          <h3 className="text-lg font-heading font-semibold">No orders yet</h3>
          <p className="text-sm text-muted-foreground">Your order history will appear here</p>
        </Card>
      ) : (
        <div className="space-y-3">
          {orders.map(order => (
            <Card key={order.id} className="p-4">
              <div className="flex items-start justify-between mb-3">
                <div>
                  <p className="text-sm font-semibold">Order #{order.id.slice(0, 8)}</p>
                  <p className="text-xs text-muted-foreground">{new Date(order.created_at).toLocaleDateString()}</p>
                </div>
                <Badge className={statusColors[order.status] || ""}>{order.status}</Badge>
              </div>

              {order.items?.map(item => (
                <div key={item.id} className="flex items-center gap-3 py-2 border-b border-border last:border-0">
                  <div className="w-12 h-12 bg-secondary rounded-lg overflow-hidden shrink-0">
                    {item.product?.images?.[0] && <img src={item.product.images[0].image_url} alt="" className="w-full h-full object-cover" />}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium truncate">{item.product?.name || "Product"}</p>
                    <p className="text-xs text-muted-foreground">Qty: {item.quantity} × ${item.unit_price}{item.selected_size ? ` • ${item.selected_size}` : ""}</p>
                  </div>
                </div>
              ))}

              <div className="mt-3 pt-3 border-t border-border flex justify-between items-center">
                <span className="text-sm text-muted-foreground">Total</span>
                <span className="font-bold text-primary">${order.total_amount}</span>
              </div>

              {order.delivery_date && <p className="text-xs text-muted-foreground mt-2">📅 Expected: {new Date(order.delivery_date).toLocaleDateString()}</p>}
              {order.delivery_otp && order.status === "shipped" && (
                <div className="mt-2 p-2 bg-primary/5 rounded-lg">
                  <p className="text-xs font-medium">Delivery OTP: <span className="font-mono text-primary font-bold">{order.delivery_otp}</span></p>
                  <p className="text-[10px] text-muted-foreground">Share this OTP with the delivery person</p>
                </div>
              )}
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default CustomerOrders;
