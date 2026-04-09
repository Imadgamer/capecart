import { useState } from "react";
import { ClipboardList, Loader2, Calendar, Check, Truck, X } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { useSellerOrders, updateOrderStatus } from "@/hooks/useOrders";
import { toast } from "sonner";

const statusColors: Record<string, string> = {
  pending: "bg-yellow-100 text-yellow-800",
  confirmed: "bg-blue-100 text-blue-800",
  shipped: "bg-purple-100 text-purple-800",
  delivered: "bg-green-100 text-green-800",
  cancelled: "bg-red-100 text-red-800",
};

const SellerOrders = () => {
  const { orders, loading, refetch } = useSellerOrders();
  const [deliveryDate, setDeliveryDate] = useState("");

  const handleStatusUpdate = async (orderId: string, status: string) => {
    const { error } = await updateOrderStatus(orderId, status, status === "shipped" ? deliveryDate : undefined);
    if (error) toast.error("Failed to update");
    else { toast.success(`Order ${status}`); refetch(); }
  };

  if (loading) {
    return <div className="flex justify-center py-20"><Loader2 className="w-8 h-8 animate-spin text-primary" /></div>;
  }

  return (
    <div className="p-4 md:p-6 max-w-5xl mx-auto animate-fade-in">
      <h1 className="text-xl font-heading font-bold mb-1">Orders</h1>
      <p className="text-xs text-muted-foreground mb-6">Track and manage incoming orders</p>

      {orders.length === 0 ? (
        <Card className="p-12 text-center">
          <ClipboardList className="w-16 h-16 text-muted-foreground/20 mx-auto mb-4" />
          <h3 className="text-lg font-heading font-semibold">No orders yet</h3>
          <p className="text-sm text-muted-foreground">Orders from customers will appear here</p>
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
                    <p className="text-xs text-muted-foreground">
                      Qty: {item.quantity} × ${item.unit_price}
                      {item.selected_size && ` • Size: ${item.selected_size}`}
                      {item.selected_color && ` • Color: ${item.selected_color}`}
                    </p>
                  </div>
                </div>
              ))}

              <div className="mt-3 pt-3 border-t border-border">
                <div className="flex justify-between items-center text-sm mb-2">
                  <span className="text-muted-foreground">Total</span>
                  <span className="font-bold text-primary">${order.total_amount}</span>
                </div>
                {order.phone && <p className="text-xs text-muted-foreground">📞 {order.phone}</p>}
                {order.address_street && <p className="text-xs text-muted-foreground">📍 {order.address_house_no} {order.address_street}, {order.address_city}, {order.address_country}</p>}
                {order.delivery_otp && <p className="text-xs font-medium mt-1">Delivery OTP: <span className="font-mono text-primary">{order.delivery_otp}</span></p>}
              </div>

              {/* Actions */}
              <div className="mt-3 flex gap-2 flex-wrap">
                {order.status === "pending" && (
                  <>
                    <Button size="sm" className="rounded-lg gap-1" onClick={() => handleStatusUpdate(order.id, "confirmed")}>
                      <Check className="w-3 h-3" /> Confirm
                    </Button>
                    <Button size="sm" variant="destructive" className="rounded-lg gap-1" onClick={() => handleStatusUpdate(order.id, "cancelled")}>
                      <X className="w-3 h-3" /> Cancel
                    </Button>
                  </>
                )}
                {order.status === "confirmed" && (
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button size="sm" className="rounded-lg gap-1"><Truck className="w-3 h-3" /> Ship</Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader><DialogTitle>Set Delivery Date</DialogTitle></DialogHeader>
                      <div className="space-y-4">
                        <div><Label>Expected Delivery Date</Label><Input type="date" value={deliveryDate} onChange={e => setDeliveryDate(e.target.value)} className="mt-1" /></div>
                        <Button className="w-full" onClick={() => { handleStatusUpdate(order.id, "shipped"); }}>Confirm Shipment</Button>
                      </div>
                    </DialogContent>
                  </Dialog>
                )}
                {order.status === "shipped" && (
                  <Button size="sm" className="rounded-lg gap-1 bg-green-600 hover:bg-green-700" onClick={() => handleStatusUpdate(order.id, "delivered")}>
                    <Check className="w-3 h-3" /> Mark Delivered
                  </Button>
                )}
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default SellerOrders;
