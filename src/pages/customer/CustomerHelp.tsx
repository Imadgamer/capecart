import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { HelpCircle, MessageCircle, Mail, Phone } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

const CustomerHelp = () => {
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");

  const handleSubmit = () => {
    if (!subject.trim() || !message.trim()) { toast.error("Please fill in all fields"); return; }
    toast.success("Support request submitted! We'll get back to you soon.");
    setSubject("");
    setMessage("");
  };

  return (
    <div className="p-4 md:p-6 max-w-2xl mx-auto animate-fade-in">
      <h1 className="text-xl font-heading font-bold mb-1">Help & Support</h1>
      <p className="text-xs text-muted-foreground mb-6">Get help with your account</p>

      <div className="space-y-4">
        <Card className="p-4">
          <h3 className="text-sm font-heading font-semibold mb-4">FAQs</h3>
          <div className="space-y-3">
            {[
              { q: "How do I place an order?", a: "Browse products, add to cart, and proceed to checkout." },
              { q: "How do payments work?", a: "After placing an order, a chat opens with the seller where you can arrange payment." },
              { q: "How do I track my order?", a: "Go to Orders to see your order status updates." },
              { q: "What if I have a problem with my order?", a: "Chat directly with the seller or contact our support team." },
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
            <div><Input value={subject} onChange={e => setSubject(e.target.value)} placeholder="Subject" className="h-11 rounded-xl" /></div>
            <div><Textarea value={message} onChange={e => setMessage(e.target.value)} placeholder="Describe your issue..." className="rounded-xl" rows={4} /></div>
            <Button onClick={handleSubmit} className="w-full rounded-xl">Submit Request</Button>
          </div>
        </Card>

        <Card className="p-4">
          <h3 className="text-sm font-heading font-semibold mb-3">Contact Info</h3>
          <div className="space-y-2 text-sm text-muted-foreground">
            <div className="flex items-center gap-2"><Mail className="w-4 h-4" /> support@capecart.com</div>
            <div className="flex items-center gap-2"><Phone className="w-4 h-4" /> +1 (800) 123-4567</div>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default CustomerHelp;
