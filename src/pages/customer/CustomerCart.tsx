import { ShoppingCart } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

const CustomerCart = () => {
  const navigate = useNavigate();

  return (
    <div className="p-4 md:p-6 max-w-5xl mx-auto animate-fade-in">
      <h1 className="text-xl font-heading font-bold mb-1">Shopping Cart</h1>
      <p className="text-xs text-muted-foreground mb-6">Review items before purchasing</p>
      <Card className="p-12 text-center">
        <ShoppingCart className="w-16 h-16 text-muted-foreground/20 mx-auto mb-4" />
        <h3 className="text-lg font-heading font-semibold">Your cart is empty</h3>
        <p className="text-sm text-muted-foreground mb-4">Browse products and add items to get started</p>
        <Button onClick={() => navigate("/customer")} className="rounded-xl">
          Start Shopping
        </Button>
      </Card>
    </div>
  );
};

export default CustomerCart;
