import { Card } from "@/components/ui/card";
import { BarChart3, TrendingUp, Eye, Package, Loader2 } from "lucide-react";
import { useSellerProducts } from "@/hooks/useProducts";
import { useSellerOrders } from "@/hooks/useOrders";

const SellerAnalytics = () => {
  const { products, loading: pLoading } = useSellerProducts();
  const { orders, loading: oLoading } = useSellerOrders();

  if (pLoading || oLoading) return <div className="flex justify-center py-20"><Loader2 className="w-8 h-8 animate-spin text-primary" /></div>;

  const totalRevenue = orders.filter(o => o.status === "delivered").reduce((s, o) => s + Number(o.total_amount), 0);
  const totalOrders = orders.length;
  const pendingOrders = orders.filter(o => o.status === "pending").length;
  const avgOrderValue = totalOrders > 0 ? totalRevenue / orders.filter(o => o.status === "delivered").length || 0 : 0;

  return (
    <div className="p-4 md:p-6 max-w-5xl mx-auto animate-fade-in">
      <h1 className="text-xl font-heading font-bold mb-1">Analytics</h1>
      <p className="text-xs text-muted-foreground mb-6">Track your business performance</p>

      <div className="grid grid-cols-2 gap-3 mb-6">
        {[
          { label: "Total Revenue", value: `$${totalRevenue.toFixed(0)}`, icon: TrendingUp, color: "text-green-500" },
          { label: "Total Orders", value: totalOrders.toString(), icon: Package, color: "text-primary" },
          { label: "Pending", value: pendingOrders.toString(), icon: Eye, color: "text-warning" },
          { label: "Avg Order", value: `$${avgOrderValue.toFixed(0)}`, icon: BarChart3, color: "text-accent" },
        ].map(s => (
          <Card key={s.label} className="p-4">
            <s.icon className={`w-6 h-6 ${s.color} mb-2`} />
            <p className="text-2xl font-heading font-bold">{s.value}</p>
            <p className="text-xs text-muted-foreground">{s.label}</p>
          </Card>
        ))}
      </div>

      <Card className="p-4">
        <h3 className="text-sm font-heading font-semibold mb-3">Order History</h3>
        <div className="space-y-2">
          {orders.slice(0, 20).map(o => (
            <div key={o.id} className="flex items-center justify-between text-sm py-2 border-b border-border last:border-0">
              <div>
                <p className="font-medium">#{o.id.slice(0, 8)}</p>
                <p className="text-xs text-muted-foreground">{new Date(o.created_at).toLocaleDateString()}</p>
              </div>
              <div className="text-right">
                <p className="font-bold">${Number(o.total_amount).toFixed(2)}</p>
                <p className="text-xs text-muted-foreground">{o.status}</p>
              </div>
            </div>
          ))}
          {orders.length === 0 && <p className="text-sm text-muted-foreground text-center py-4">No orders yet</p>}
        </div>
      </Card>
    </div>
  );
};

export default SellerAnalytics;
