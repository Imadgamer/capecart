import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CreditCard } from "lucide-react";

const SellerPayments = () => {
  return (
    <div className="p-4 md:p-6 max-w-2xl mx-auto animate-fade-in">
      <h1 className="text-xl font-heading font-bold mb-1">Payments</h1>
      <p className="text-xs text-muted-foreground mb-6">Manage how you receive payments</p>

      <Card className="p-4 mb-4">
        <h3 className="text-sm font-heading font-semibold mb-3">Payment Collection</h3>
        <p className="text-sm text-muted-foreground mb-4">Payments are collected directly through chat. When a customer orders, they'll message you to arrange payment.</p>
        <div className="space-y-3 text-sm text-muted-foreground">
          <div className="flex items-start gap-2">
            <span className="w-6 h-6 rounded-full bg-primary/10 text-primary flex items-center justify-center shrink-0 text-xs font-bold">1</span>
            <p>Customer places order and chat opens</p>
          </div>
          <div className="flex items-start gap-2">
            <span className="w-6 h-6 rounded-full bg-primary/10 text-primary flex items-center justify-center shrink-0 text-xs font-bold">2</span>
            <p>Share your payment details (UPI, Bank, QR) via chat</p>
          </div>
          <div className="flex items-start gap-2">
            <span className="w-6 h-6 rounded-full bg-primary/10 text-primary flex items-center justify-center shrink-0 text-xs font-bold">3</span>
            <p>Customer sends payment and shares screenshot</p>
          </div>
          <div className="flex items-start gap-2">
            <span className="w-6 h-6 rounded-full bg-primary/10 text-primary flex items-center justify-center shrink-0 text-xs font-bold">4</span>
            <p>Confirm payment and ship the order</p>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default SellerPayments;
