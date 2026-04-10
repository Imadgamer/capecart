import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { HelpCircle, Mail, Phone } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

const SellerHelp = () => {
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");

  const handleSubmit = () => {
    if (!subject.trim() || !message.trim()) { toast.error("Please fill in all fields"); return; }
    toast.success("Support request submitted!");
    setSubject("");
    setMessage("");
  };

  return (
    <div className="p-4 md:p-6 max-w-2xl mx-auto animate-fade-in">
      <h1 className="text-xl font-heading font-bold mb-1">Help & Support</h1>
      <p className="text-xs text-muted-foreground mb-6">Get help with selling</p>

      <div className="space-y-4">
        <Card className="p-4">
          <h3 className="text-sm font-heading font-semibold mb-4">Seller FAQs</h3>
          <div className="space-y-3">
            {[
              { q: "How do I list a product?", a: "Go to Products → Add Product. Fill in details, upload images, and publish." },
              { q: "How do I receive payments?", a: "Share your payment details (UPI, bank) through chat when a customer orders." },
              { q: "How do I manage orders?", a: "Go to Orders to view, confirm, ship, and mark orders as delivered." },
              { q: "What is the delivery OTP?", a: "Each order has a unique OTP that the customer uses to confirm delivery." },
            ].map((faq, i) => (
              <div key={i} className="border-b border-border pb-3 last:border-0 last:pb-0">
                <p className="text-sm font-medium">{faq.q}</p>
                <p className="text-xs text-muted-foreground mt-1">{faq.a}</p>
              </div>
            ))}
          </div>
        </Card>

        <Card className="p-4">
          <h3 className="text-sm font-heading font-semibold mb-4">Contact Support</h3>
          <div className="space-y-3">
            <Input value={subject} onChange={e => setSubject(e.target.value)} placeholder="Subject" className="h-11 rounded-xl" />
            <Textarea value={message} onChange={e => setMessage(e.target.value)} placeholder="Describe your issue..." className="rounded-xl" rows={4} />
            <Button onClick={handleSubmit} className="w-full rounded-xl">Submit Request</Button>
          </div>
        </Card>

        <Card className="p-4">
          <h3 className="text-sm font-heading font-semibold mb-3">Contact Info</h3>
          <div className="space-y-2 text-sm text-muted-foreground">
            <div className="flex items-center gap-2"><Mail className="w-4 h-4" /> seller-support@capecart.com</div>
            <div className="flex items-center gap-2"><Phone className="w-4 h-4" /> +1 (800) 123-4567</div>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default SellerHelp;
