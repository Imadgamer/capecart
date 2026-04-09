import { MessageCircle } from "lucide-react";
import { Card } from "@/components/ui/card";

const SellerChat = () => (
  <div className="p-4 md:p-6 max-w-5xl mx-auto animate-fade-in">
    <h1 className="text-xl font-heading font-bold mb-1">Chat with Customers</h1>
    <p className="text-xs text-muted-foreground mb-6">Respond to customer inquiries and orders</p>
    <Card className="p-12 text-center">
      <MessageCircle className="w-16 h-16 text-muted-foreground/20 mx-auto mb-4" />
      <h3 className="text-lg font-heading font-semibold">No messages yet</h3>
      <p className="text-sm text-muted-foreground">Customer messages will appear here when they place orders</p>
    </Card>
  </div>
);

export default SellerChat;
