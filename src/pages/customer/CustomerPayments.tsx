import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CreditCard, Plus } from "lucide-react";
import { toast } from "sonner";

const CustomerPayments = () => {
  return (
    <div className="p-4 md:p-6 max-w-2xl mx-auto animate-fade-in">
      <h1 className="text-xl font-heading font-bold mb-1">Payment Methods</h1>
      <p className="text-xs text-muted-foreground mb-6">Manage your payment options</p>

      <Card className="p-12 text-center">
        <CreditCard className="w-16 h-16 text-muted-foreground/20 mx-auto mb-4" />
        <h3 className="text-lg font-heading font-semibold">No payment methods</h3>
        <p className="text-sm text-muted-foreground mb-4">Payment is handled through direct chat with sellers. Share payment details securely via chat.</p>
      </Card>

      <Card className="p-4 mt-4">
        <h3 className="text-sm font-heading font-semibold mb-3">How Payments Work</h3>
        <div className="space-y-3 text-sm text-muted-foreground">
          <div className="flex items-start gap-2">
            <span className="w-6 h-6 rounded-full bg-primary/10 text-primary flex items-center justify-center shrink-0 text-xs font-bold">1</span>
            <p>Place your order and a chat opens with the seller</p>
          </div>
          <div className="flex items-start gap-2">
            <span className="w-6 h-6 rounded-full bg-primary/10 text-primary flex items-center justify-center shrink-0 text-xs font-bold">2</span>
            <p>The seller shares their payment details (UPI, bank, QR code)</p>
          </div>
          <div className="flex items-start gap-2">
            <span className="w-6 h-6 rounded-full bg-primary/10 text-primary flex items-center justify-center shrink-0 text-xs font-bold">3</span>
            <p>You make the payment and share the screenshot in chat</p>
          </div>
          <div className="flex items-start gap-2">
            <span className="w-6 h-6 rounded-full bg-primary/10 text-primary flex items-center justify-center shrink-0 text-xs font-bold">4</span>
            <p>Seller confirms and ships your order</p>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default CustomerPayments;
