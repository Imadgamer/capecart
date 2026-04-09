import { ClipboardList } from "lucide-react";
import { Card } from "@/components/ui/card";

const CustomerOrders = () => (
  <div className="p-4 md:p-6 max-w-5xl mx-auto animate-fade-in">
    <h1 className="text-xl font-heading font-bold mb-1">My Orders</h1>
    <p className="text-xs text-muted-foreground mb-6">Track your purchases and deliveries</p>
    <Card className="p-12 text-center">
      <ClipboardList className="w-16 h-16 text-muted-foreground/20 mx-auto mb-4" />
      <h3 className="text-lg font-heading font-semibold">No orders yet</h3>
      <p className="text-sm text-muted-foreground">Your order history will appear here</p>
    </Card>
  </div>
);

export default CustomerOrders;
