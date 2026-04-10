import { Card } from "@/components/ui/card";
import { DollarSign, TrendingUp, Loader2 } from "lucide-react";
import { useSellerOrders } from "@/hooks/useOrders";

const SellerRevenue = () => {
  const { orders, loading } = useSellerOrders();

  if (loading) return <div className="flex justify-center py-20"><Loader2 className="w-8 h-8 animate-spin text-primary" /></div>;

  const delivered = orders.filter(o => o.status === "delivered");
  const totalRevenue = delivered.reduce((s, o) => s + Number(o.total_amount), 0);
  const pending = orders.filter(o => o.status !== "delivered" && o.status !== "cancelled");
  const pendingRevenue = pending.reduce((s, o) => s + Number(o.total_amount), 0);

  return (
    <div className="p-4 md:p-6 max-w-5xl mx-auto animate-fade-in">
      <h1 className="text-xl font-heading font-bold mb-1">Revenue</h1>
      <p className="text-xs text-muted-foreground mb-6">Track your earnings</p>

      <div className="grid grid-cols-2 gap-3 mb-6">
        <Card className="p-4 bg-green-500/5 border-green-500/20">
          <DollarSign className="w-6 h-6 text-green-500 mb-2" />
          <p className="text-2xl font-heading font-bold text-green-600">${totalRevenue.toFixed(2)}</p>
          <p className="text-xs text-muted-foreground">Earned Revenue</p>
        </Card>
        <Card className="p-4 bg-warning/5 border-warning/20">
          <TrendingUp className="w-6 h-6 text-warning mb-2" />
          <p className="text-2xl font-heading font-bold text-warning">${pendingRevenue.toFixed(2)}</p>
          <p className="text-xs text-muted-foreground">Pending Revenue</p>
        </Card>
      </div>

      <Card className="p-4">
        <h3 className="text-sm font-heading font-semibold mb-3">Completed Transactions</h3>
        <div className="space-y-2">
          {delivered.map(o => (
            <div key={o.id} className="flex justify-between text-sm py-2 border-b border-border last:border-0">
              <div>
                <p className="font-medium">Order #{o.id.slice(0, 8)}</p>
                <p className="text-xs text-muted-foreground">{new Date(o.created_at).toLocaleDateString()}</p>
              </div>
              <p className="font-bold text-green-600">+${Number(o.total_amount).toFixed(2)}</p>
            </div>
          ))}
          {delivered.length === 0 && <p className="text-sm text-muted-foreground text-center py-4">No completed orders yet</p>}
        </div>
      </Card>
    </div>
  );
};

export default SellerRevenue;
