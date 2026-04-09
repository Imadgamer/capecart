import { Package, ShoppingCart, TrendingUp, MessageCircle, PlusCircle, Eye } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

const stats = [
  { label: "Total Products", value: "0", icon: Package, color: "text-primary" },
  { label: "Pending Orders", value: "0", icon: ShoppingCart, color: "text-accent" },
  { label: "Revenue", value: "$0", icon: TrendingUp, color: "text-info" },
  { label: "Messages", value: "0", icon: MessageCircle, color: "text-warning" },
];

const SellerDashboard = () => {
  const navigate = useNavigate();

  return (
    <div className="p-4 md:p-6 max-w-5xl mx-auto animate-fade-in">
      <div className="mb-6">
        <h1 className="text-2xl font-heading font-bold text-foreground">Dashboard</h1>
        <p className="text-sm text-muted-foreground mt-1">Welcome to your seller dashboard</p>
      </div>

      {/* Stats */}
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

      {/* Quick Actions */}
      <div className="mb-6">
        <h2 className="text-lg font-heading font-semibold mb-3">Quick Actions</h2>
        <div className="grid grid-cols-2 gap-3">
          <Button
            variant="outline"
            className="h-auto py-4 flex flex-col items-center gap-2 rounded-xl"
            onClick={() => navigate("/seller/products/new")}
          >
            <PlusCircle className="w-6 h-6 text-primary" />
            <span className="text-sm font-medium">Add Product</span>
          </Button>
          <Button
            variant="outline"
            className="h-auto py-4 flex flex-col items-center gap-2 rounded-xl"
            onClick={() => navigate("/seller/orders")}
          >
            <Eye className="w-6 h-6 text-accent" />
            <span className="text-sm font-medium">View Orders</span>
          </Button>
        </div>
      </div>

      {/* Recent Products */}
      <div>
        <h2 className="text-lg font-heading font-semibold mb-3">Recent Products</h2>
        <Card className="p-8 text-center">
          <Package className="w-12 h-12 text-muted-foreground/30 mx-auto mb-3" />
          <p className="text-muted-foreground text-sm">No products yet</p>
          <Button
            className="mt-4 rounded-xl"
            onClick={() => navigate("/seller/products/new")}
          >
            <PlusCircle className="w-4 h-4 mr-2" />
            Add Your First Product
          </Button>
        </Card>
      </div>
    </div>
  );
};

export default SellerDashboard;
