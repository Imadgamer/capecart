import { Card } from "@/components/ui/card";
import { Users, Loader2 } from "lucide-react";
import { useSellerOrders } from "@/hooks/useOrders";
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";

const SellerCustomers = () => {
  const { orders, loading } = useSellerOrders();
  const [profiles, setProfiles] = useState<any[]>([]);

  useEffect(() => {
    const buyerIds = [...new Set(orders.map(o => o.buyer_id))];
    if (buyerIds.length === 0) return;
    supabase.from("profiles").select("*").in("user_id", buyerIds).then(({ data }) => setProfiles(data || []));
  }, [orders]);

  if (loading) return <div className="flex justify-center py-20"><Loader2 className="w-8 h-8 animate-spin text-primary" /></div>;

  const customerData = [...new Set(orders.map(o => o.buyer_id))].map(buyerId => {
    const profile = profiles.find(p => p.user_id === buyerId);
    const customerOrders = orders.filter(o => o.buyer_id === buyerId);
    const totalSpent = customerOrders.reduce((s, o) => s + Number(o.total_amount), 0);
    return { buyerId, profile, orderCount: customerOrders.length, totalSpent };
  });

  return (
    <div className="p-4 md:p-6 max-w-5xl mx-auto animate-fade-in">
      <h1 className="text-xl font-heading font-bold mb-1">Customers</h1>
      <p className="text-xs text-muted-foreground mb-6">{customerData.length} customers have ordered from you</p>

      {customerData.length === 0 ? (
        <Card className="p-12 text-center">
          <Users className="w-16 h-16 text-muted-foreground/20 mx-auto mb-4" />
          <h3 className="text-lg font-heading font-semibold">No customers yet</h3>
          <p className="text-sm text-muted-foreground">Customers will appear here when they place orders</p>
        </Card>
      ) : (
        <div className="space-y-2">
          {customerData.map(c => (
            <Card key={c.buyerId} className="p-4 flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-accent/10 flex items-center justify-center shrink-0">
                {c.profile?.avatar_url ? <img src={c.profile.avatar_url} className="w-full h-full rounded-full object-cover" /> :
                <span className="text-sm font-bold text-accent">{(c.profile?.display_name || "C")[0].toUpperCase()}</span>}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold truncate">{c.profile?.display_name || "Customer"}</p>
                <p className="text-xs text-muted-foreground">{c.profile?.phone || "No phone"}</p>
              </div>
              <div className="text-right">
                <p className="text-sm font-bold text-primary">${c.totalSpent.toFixed(0)}</p>
                <p className="text-xs text-muted-foreground">{c.orderCount} orders</p>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default SellerCustomers;
