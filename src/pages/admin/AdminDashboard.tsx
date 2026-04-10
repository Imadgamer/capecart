import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { useAdminData, useIsAdmin } from "@/hooks/useAdmin";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Users, Package, ShoppingCart, TrendingUp, Search, Trash2, Eye, Loader2, Shield, BarChart3, DollarSign, Bell } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { deleteProduct } from "@/hooks/useProducts";
import { updateOrderStatus } from "@/hooks/useOrders";
import logo from "@/assets/logo.png";

const AdminDashboard = () => {
  const navigate = useNavigate();
  const { user, signOut } = useAuth();
  const isAdmin = useIsAdmin();
  const { profiles, products, orders, loading, refetch } = useAdminData();
  const [search, setSearch] = useState("");
  const [tab, setTab] = useState("overview");

  if (!isAdmin) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <Card className="p-8 text-center max-w-md">
          <Shield className="w-16 h-16 text-destructive mx-auto mb-4" />
          <h2 className="text-xl font-heading font-bold mb-2">Access Denied</h2>
          <p className="text-sm text-muted-foreground mb-4">You don't have admin privileges.</p>
          <Button onClick={() => navigate("/")} className="rounded-xl">Go Home</Button>
        </Card>
      </div>
    );
  }

  if (loading) return <div className="min-h-screen flex items-center justify-center"><Loader2 className="w-8 h-8 animate-spin text-primary" /></div>;

  const totalRevenue = orders.filter(o => o.status === "delivered").reduce((s: number, o: any) => s + Number(o.total_amount), 0);
  const sellers = profiles.filter((p: any) => p.role === "seller");
  const customers = profiles.filter((p: any) => p.role === "customer");

  const handleDeleteProduct = async (id: string) => {
    if (!confirm("Delete this product?")) return;
    await deleteProduct(id);
    toast.success("Product deleted");
    refetch();
  };

  const handleUpdateOrderStatus = async (id: string, status: string) => {
    await updateOrderStatus(id, status);
    toast.success(`Order updated to ${status}`);
    refetch();
  };

  const filteredProducts = products.filter((p: any) => p.name.toLowerCase().includes(search.toLowerCase()));
  const filteredProfiles = profiles.filter((p: any) => (p.display_name || p.user_id || "").toLowerCase().includes(search.toLowerCase()));

  return (
    <div className="min-h-screen bg-background">
      {/* Admin Header */}
      <header className="h-16 bg-card border-b border-border flex items-center justify-between px-6 sticky top-0 z-50">
        <div className="flex items-center gap-3">
          <img src={logo} alt="CapeCart" className="w-8 h-8 rounded-lg" />
          <div>
            <h1 className="font-heading font-bold text-lg">CapeCart Admin</h1>
            <p className="text-[10px] text-muted-foreground">Control Panel</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <Badge variant="outline" className="text-xs">Admin</Badge>
          <Button variant="ghost" size="sm" onClick={async () => { await signOut(); navigate("/"); }}>Sign Out</Button>
        </div>
      </header>

      <div className="max-w-7xl mx-auto p-4 md:p-6">
        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          {[
            { label: "Total Users", value: profiles.length, icon: Users, color: "text-primary" },
            { label: "Products", value: products.length, icon: Package, color: "text-accent" },
            { label: "Orders", value: orders.length, icon: ShoppingCart, color: "text-warning" },
            { label: "Revenue", value: `$${totalRevenue.toFixed(0)}`, icon: DollarSign, color: "text-green-500" },
          ].map(s => (
            <Card key={s.label} className="p-4">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-xl bg-secondary flex items-center justify-center">
                  <s.icon className={`w-6 h-6 ${s.color}`} />
                </div>
                <div>
                  <p className="text-2xl font-heading font-bold">{s.value}</p>
                  <p className="text-xs text-muted-foreground">{s.label}</p>
                </div>
              </div>
            </Card>
          ))}
        </div>

        {/* Search */}
        <div className="relative mb-4">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input placeholder="Search users, products, orders..." value={search} onChange={e => setSearch(e.target.value)} className="pl-10 h-11 rounded-xl" />
        </div>

        {/* Tabs */}
        <Tabs value={tab} onValueChange={setTab}>
          <TabsList className="w-full grid grid-cols-4 mb-4">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="users">Users ({profiles.length})</TabsTrigger>
            <TabsTrigger value="products">Products ({products.length})</TabsTrigger>
            <TabsTrigger value="orders">Orders ({orders.length})</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-4">
            <div className="grid md:grid-cols-2 gap-4">
              <Card className="p-4">
                <h3 className="text-sm font-heading font-semibold mb-3 flex items-center gap-2"><BarChart3 className="w-4 h-4" /> User Breakdown</h3>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm"><span>Sellers</span><span className="font-bold">{sellers.length}</span></div>
                  <div className="flex justify-between text-sm"><span>Customers</span><span className="font-bold">{customers.length}</span></div>
                  <div className="flex justify-between text-sm"><span>Total Users</span><span className="font-bold">{profiles.length}</span></div>
                </div>
              </Card>
              <Card className="p-4">
                <h3 className="text-sm font-heading font-semibold mb-3 flex items-center gap-2"><TrendingUp className="w-4 h-4" /> Order Stats</h3>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm"><span>Pending</span><span className="font-bold text-warning">{orders.filter((o: any) => o.status === "pending").length}</span></div>
                  <div className="flex justify-between text-sm"><span>Confirmed</span><span className="font-bold text-primary">{orders.filter((o: any) => o.status === "confirmed").length}</span></div>
                  <div className="flex justify-between text-sm"><span>Shipped</span><span className="font-bold text-accent">{orders.filter((o: any) => o.status === "shipped").length}</span></div>
                  <div className="flex justify-between text-sm"><span>Delivered</span><span className="font-bold text-green-500">{orders.filter((o: any) => o.status === "delivered").length}</span></div>
                  <div className="flex justify-between text-sm"><span>Cancelled</span><span className="font-bold text-destructive">{orders.filter((o: any) => o.status === "cancelled").length}</span></div>
                </div>
              </Card>
            </div>
            <Card className="p-4">
              <h3 className="text-sm font-heading font-semibold mb-3">Recent Orders</h3>
              <div className="space-y-2">
                {orders.slice(0, 10).map((o: any) => (
                  <div key={o.id} className="flex items-center justify-between text-sm py-2 border-b border-border last:border-0">
                    <div>
                      <p className="font-medium">#{o.id.slice(0, 8)}</p>
                      <p className="text-xs text-muted-foreground">{new Date(o.created_at).toLocaleDateString()}</p>
                    </div>
                    <div className="text-right">
                      <p className="font-bold">${Number(o.total_amount).toFixed(2)}</p>
                      <Badge variant={o.status === "delivered" ? "default" : o.status === "cancelled" ? "destructive" : "secondary"} className="text-[10px]">{o.status}</Badge>
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          </TabsContent>

          <TabsContent value="users">
            <div className="space-y-2">
              {filteredProfiles.map((p: any) => (
                <Card key={p.id} className="p-4 flex items-center gap-4">
                  <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                    {p.avatar_url ? <img src={p.avatar_url} alt="" className="w-full h-full rounded-full object-cover" /> :
                    <span className="text-sm font-bold text-primary">{(p.display_name || "U")[0].toUpperCase()}</span>}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold truncate">{p.display_name || "Unnamed"}</p>
                    <p className="text-xs text-muted-foreground truncate">{p.phone || "No phone"}</p>
                  </div>
                  <Badge variant={p.role === "seller" ? "default" : "secondary"}>{p.role}</Badge>
                  <p className="text-[10px] text-muted-foreground">{new Date(p.created_at).toLocaleDateString()}</p>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="products">
            <div className="space-y-2">
              {filteredProducts.map((p: any) => (
                <Card key={p.id} className="p-3 flex items-center gap-3">
                  <div className="w-14 h-14 rounded-xl bg-secondary overflow-hidden shrink-0">
                    {p.images?.[0] ? <img src={p.images[0].image_url} alt="" className="w-full h-full object-cover" /> :
                    <div className="w-full h-full flex items-center justify-center"><Package className="w-6 h-6 text-muted-foreground/30" /></div>}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold truncate">{p.name}</p>
                    <p className="text-xs text-muted-foreground">${p.price} • {p.category} • Stock: {p.stock}</p>
                  </div>
                  <Badge variant={p.is_published ? "default" : "secondary"}>{p.is_published ? "Live" : "Draft"}</Badge>
                  <Button variant="ghost" size="icon" onClick={() => handleDeleteProduct(p.id)}><Trash2 className="w-4 h-4 text-destructive" /></Button>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="orders">
            <div className="space-y-2">
              {orders.map((o: any) => (
                <Card key={o.id} className="p-4">
                  <div className="flex items-center justify-between mb-2">
                    <p className="text-sm font-semibold">Order #{o.id.slice(0, 8)}</p>
                    <Badge variant={o.status === "delivered" ? "default" : o.status === "cancelled" ? "destructive" : "secondary"}>{o.status}</Badge>
                  </div>
                  <div className="text-xs text-muted-foreground space-y-1">
                    <p>Amount: <span className="font-bold text-foreground">${Number(o.total_amount).toFixed(2)}</span></p>
                    <p>Date: {new Date(o.created_at).toLocaleString()}</p>
                    <p>Items: {(o.order_items || []).length}</p>
                  </div>
                  <div className="flex gap-2 mt-3 flex-wrap">
                    {["pending", "confirmed", "shipped", "delivered", "cancelled"].map(s => (
                      <Button key={s} size="sm" variant={o.status === s ? "default" : "outline"} className="text-xs rounded-lg h-7" onClick={() => handleUpdateOrderStatus(o.id, s)}>
                        {s}
                      </Button>
                    ))}
                  </div>
                </Card>
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default AdminDashboard;
