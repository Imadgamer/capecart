import { Package, ShoppingCart, TrendingUp, MessageCircle, PlusCircle, Eye, Loader2 } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useNavigate } from "react-router-dom";
import { useSellerProducts } from "@/hooks/useProducts";
import { useSellerOrders } from "@/hooks/useOrders";
import { useConversations } from "@/hooks/useChat";

const SellerDashboard = () => {
  const navigate = useNavigate();
  const { products, loading: pLoading } = useSellerProducts();
  const { orders, loading: oLoading } = useSellerOrders();
  const { conversations } = useConversations();

  const pendingOrders = orders.filter(o => o.status === "pending" || o.status === "confirmed");
  const revenue = orders.filter(o => o.status === "delivered").reduce((sum, o) => sum + Number(o.total_amount), 0);

  const stats = [
    { label: "Products", value: products.length.toString(), icon: Package, color: "text-primary" },
    { label: "Pending Orders", value: pendingOrders.length.toString(), icon: ShoppingCart, color: "text-accent" },
    { label: "Revenue", value: `$${revenue.toFixed(0)}`, icon: TrendingUp, color: "text-green-500" },
    { label: "Messages", value: conversations.length.toString(), icon: MessageCircle, color: "text-warning" },
  ];

  if (pLoading || oLoading) {
    return <div className="flex justify-center py-20"><Loader2 className="w-8 h-8 animate-spin text-primary" /></div>;
  }

  return (
    <div className="p-4 md:p-6 max-w-5xl mx-auto animate-fade-in">
      <div className="mb-6">
        <h1 className="text-2xl font-heading font-bold text-foreground">Dashboard</h1>
        <p className="text-sm text-muted-foreground mt-1">Welcome to your seller dashboard</p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
        {stats.map(stat => (
          <Card key={stat.label} className="p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-secondary flex items-center justify-center">
                <stat.icon className={`w-5 h-5 ${stat.color}`} />
              </div>
              <div>
                <p className="text-2xl font-heading font-bold">{stat.value}</p>
                <p className="text-xs text-muted-foreground">{stat.label}</p>
              </div>
            </div>
          </Card>
        ))}
      </div>

      <div className="mb-6">
        <h2 className="text-lg font-heading font-semibold mb-3">Quick Actions</h2>
        <div className="grid grid-cols-2 gap-3">
          <Button variant="outline" className="h-auto py-4 flex flex-col items-center gap-2 rounded-xl" onClick={() => navigate("/seller/products/new")}>
            <PlusCircle className="w-6 h-6 text-primary" />
            <span className="text-sm font-medium">Add Product</span>
          </Button>
          <Button variant="outline" className="h-auto py-4 flex flex-col items-center gap-2 rounded-xl" onClick={() => navigate("/seller/orders")}>
            <Eye className="w-6 h-6 text-accent" />
            <span className="text-sm font-medium">View Orders</span>
          </Button>
        </div>
      </div>

      {/* Recent Orders */}
      {orders.length > 0 && (
        <div className="mb-6">
          <h2 className="text-lg font-heading font-semibold mb-3">Recent Orders</h2>
          <div className="space-y-2">
            {orders.slice(0, 5).map(order => (
              <Card key={order.id} className="p-3 flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium">Order #{order.id.slice(0, 8)}</p>
                  <p className="text-xs text-muted-foreground">${order.total_amount}</p>
                </div>
                <Badge variant={order.status === "pending" ? "secondary" : order.status === "delivered" ? "default" : "outline"}>
                  {order.status}
                </Badge>
              </Card>
            ))}
          </div>
        </div>
      )}

      {/* Recent Products */}
      <div>
        <h2 className="text-lg font-heading font-semibold mb-3">Recent Products</h2>
        {products.length === 0 ? (
          <Card className="p-8 text-center">
            <Package className="w-12 h-12 text-muted-foreground/30 mx-auto mb-3" />
            <p className="text-muted-foreground text-sm">No products yet</p>
            <Button className="mt-4 rounded-xl" onClick={() => navigate("/seller/products/new")}>
              <PlusCircle className="w-4 h-4 mr-2" /> Add Your First Product
            </Button>
          </Card>
        ) : (
          <div className="grid grid-cols-2 gap-3">
            {products.slice(0, 4).map(p => (
              <Card key={p.id} className="overflow-hidden cursor-pointer hover:shadow-md transition-shadow" onClick={() => navigate(`/seller/products/edit/${p.id}`)}>
                <div className="aspect-square bg-secondary">
                  {p.images?.[0] ? <img src={p.images[0].image_url} alt={p.name} className="w-full h-full object-cover" /> : <div className="w-full h-full flex items-center justify-center"><Package className="w-8 h-8 text-muted-foreground/30" /></div>}
                </div>
                <div className="p-2">
                  <p className="text-xs font-medium truncate">{p.name}</p>
                  <p className="text-xs text-primary font-bold">${p.price}</p>
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default SellerDashboard;
