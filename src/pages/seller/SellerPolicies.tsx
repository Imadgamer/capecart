import { Card } from "@/components/ui/card";
import { FileText } from "lucide-react";

const SellerPolicies = () => {
  return (
    <div className="p-4 md:p-6 max-w-2xl mx-auto animate-fade-in">
      <h1 className="text-xl font-heading font-bold mb-1">Policies</h1>
      <p className="text-xs text-muted-foreground mb-6">Platform policies and guidelines</p>

      <div className="space-y-4">
        {[
          { title: "Return Policy", content: "Sellers are expected to accept returns within 7 days of delivery if the product is damaged or not as described. Communicate return details through chat." },
          { title: "Shipping Policy", content: "Sellers must ship orders within 2-3 business days of receiving payment confirmation. Provide tracking information to customers via chat." },
          { title: "Payment Policy", content: "All payments are handled through direct communication. Share your payment details (UPI, bank transfer, etc.) only through the in-app chat." },
          { title: "Product Listing", content: "All products must have accurate descriptions, real images, and fair pricing. Misleading listings will be removed." },
          { title: "Customer Communication", content: "Respond to customer messages within 24 hours. Professional and respectful communication is required at all times." },
        ].map(policy => (
          <Card key={policy.title} className="p-4">
            <div className="flex items-center gap-2 mb-2">
              <FileText className="w-4 h-4 text-primary" />
              <h3 className="text-sm font-heading font-semibold">{policy.title}</h3>
            </div>
            <p className="text-sm text-muted-foreground leading-relaxed">{policy.content}</p>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default SellerPolicies;
