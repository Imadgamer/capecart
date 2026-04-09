import { useState, useEffect } from "react";
import { ShoppingCart, Trash2, ArrowRight, Loader2 } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { useProfile } from "@/hooks/useProfile";
import { createOrder } from "@/hooks/useOrders";
import { getOrCreateConversation, sendMessage } from "@/hooks/useChat";
import { toast } from "sonner";

interface CartItem {
  product_id: string;
  seller_id: string;
  name: string;
  price: number;
  unit: string;
  quantity: number;
  selected_size: string | null;
  selected_color: string | null;
  image_url: string | null;
  offer: string | null;
}

const CustomerCart = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { profile } = useProfile();
  const [items, setItems] = useState<CartItem[]>([]);
  const [step, setStep] = useState<"cart" | "address">("cart");
  const [phone, setPhone] = useState("");
  const [street, setStreet] = useState("");
  const [houseNo, setHouseNo] = useState("");
  const [city, setCity] = useState("");
  const [country, setCountry] = useState("");
  const [zip, setZip] = useState("");
  const [ordering, setOrdering] = useState(false);

  useEffect(() => {
    const stored = JSON.parse(localStorage.getItem("capecart_cart") || "[]");
    setItems(stored);
  }, []);

  useEffect(() => {
    if (profile) {
      setPhone(profile.phone || "");
      setStreet(profile.address_street || "");
      setCity(profile.address_city || "");
      setCountry(profile.address_country || "");
    }
  }, [profile]);

  const updateCart = (newItems: CartItem[]) => {
    setItems(newItems);
    localStorage.setItem("capecart_cart", JSON.stringify(newItems));
  };

  const removeItem = (idx: number) => updateCart(items.filter((_, i) => i !== idx));
  const updateQty = (idx: number, qty: number) => {
    if (qty < 1) return;
    const newItems = [...items];
    newItems[idx] = { ...newItems[idx], quantity: qty };
    updateCart(newItems);
  };

  const total = items.reduce((sum, item) => sum + item.price * item.quantity, 0);

  const handlePlaceOrder = async () => {
    if (!user) { toast.error("Please log in"); return; }
    if (!phone.trim()) { toast.error("Phone number is required"); return; }
    if (!street.trim() || !city.trim() || !country.trim()) { toast.error("Please fill in your address"); return; }

    setOrdering(true);
    try {
      // Group items by seller
      const sellerGroups: Record<string, CartItem[]> = {};
      items.forEach(item => {
        if (!sellerGroups[item.seller_id]) sellerGroups[item.seller_id] = [];
        sellerGroups[item.seller_id].push(item);
      });

      for (const [sellerId, sellerItems] of Object.entries(sellerGroups)) {
        const orderTotal = sellerItems.reduce((s, i) => s + i.price * i.quantity, 0);

        const { data: order, error } = await createOrder({
          buyer_id: user.id,
          seller_id: sellerId,
          total_amount: orderTotal,
          phone: phone.trim(),
          address_street: street.trim(),
          address_city: city.trim(),
          address_country: country.trim(),
          address_house_no: houseNo.trim(),
          address_zip: zip.trim(),
          items: sellerItems.map(i => ({
            product_id: i.product_id,
            quantity: i.quantity,
            unit_price: i.price,
            selected_size: i.selected_size || undefined,
            selected_color: i.selected_color || undefined,
          })),
        });

        if (error || !order) {
          toast.error("Failed to place order");
          continue;
        }

        // Create conversation and send order summary
        const { data: conv } = await getOrCreateConversation(user.id, sellerId, order.id);
        if (conv) {
          const summary = `📦 New Order #${order.id.slice(0, 8)}\n\n` +
            sellerItems.map(i => `• ${i.name} x${i.quantity}${i.selected_size ? ` (${i.selected_size})` : ""}${i.selected_color ? ` [${i.selected_color}]` : ""} — $${(i.price * i.quantity).toFixed(2)}`).join("\n") +
            `\n\nTotal: $${orderTotal.toFixed(2)}\n📞 ${phone}\n📍 ${houseNo} ${street}, ${city}, ${country}` +
            `\n\nDelivery OTP: ${order.delivery_otp}`;

          await sendMessage(conv.id, user.id, summary, "order_summary");
        }
      }

      updateCart([]);
      toast.success("Order placed! Check your messages for updates.");
      navigate("/customer/orders");
    } finally {
      setOrdering(false);
    }
  };

  if (items.length === 0 && step === "cart") {
    return (
      <div className="p-4 md:p-6 max-w-5xl mx-auto animate-fade-in">
        <h1 className="text-xl font-heading font-bold mb-1">Shopping Cart</h1>
        <p className="text-xs text-muted-foreground mb-6">Review items before purchasing</p>
        <Card className="p-12 text-center">
          <ShoppingCart className="w-16 h-16 text-muted-foreground/20 mx-auto mb-4" />
          <h3 className="text-lg font-heading font-semibold">Your cart is empty</h3>
          <p className="text-sm text-muted-foreground mb-4">Browse products and add items to get started</p>
          <Button onClick={() => navigate("/customer")} className="rounded-xl">Start Shopping</Button>
        </Card>
      </div>
    );
  }

  if (step === "address") {
    return (
      <div className="p-4 md:p-6 max-w-2xl mx-auto animate-fade-in pb-24">
        <h1 className="text-xl font-heading font-bold mb-1">Delivery Address</h1>
        <p className="text-xs text-muted-foreground mb-6">Enter your delivery details</p>
        <Card className="p-4 space-y-4">
          <div><Label className="text-sm font-semibold">Phone Number *</Label><Input value={phone} onChange={e => setPhone(e.target.value)} placeholder="+1 234 567 890" className="mt-1 h-11 rounded-xl" /></div>
          <div><Label className="text-sm font-semibold">Street Address *</Label><Input value={street} onChange={e => setStreet(e.target.value)} placeholder="Street address" className="mt-1 h-11 rounded-xl" /></div>
          <div><Label className="text-sm font-semibold">House No.</Label><Input value={houseNo} onChange={e => setHouseNo(e.target.value)} placeholder="House / Apt no." className="mt-1 h-11 rounded-xl" /></div>
          <div className="grid grid-cols-2 gap-3">
            <div><Label className="text-sm font-semibold">City *</Label><Input value={city} onChange={e => setCity(e.target.value)} placeholder="City" className="mt-1 h-11 rounded-xl" /></div>
            <div><Label className="text-sm font-semibold">Country *</Label><Input value={country} onChange={e => setCountry(e.target.value)} placeholder="Country" className="mt-1 h-11 rounded-xl" /></div>
          </div>
          <div><Label className="text-sm font-semibold">ZIP/Postal Code</Label><Input value={zip} onChange={e => setZip(e.target.value)} placeholder="12345" className="mt-1 h-11 rounded-xl" /></div>
        </Card>

        <Card className="p-4 mt-4">
          <h3 className="text-sm font-semibold mb-2">Order Summary</h3>
          {items.map((item, idx) => (
            <div key={idx} className="flex justify-between text-sm py-1">
              <span className="text-muted-foreground">{item.name} x{item.quantity}</span>
              <span className="font-medium">${(item.price * item.quantity).toFixed(2)}</span>
            </div>
          ))}
          <div className="flex justify-between text-sm font-bold pt-2 mt-2 border-t border-border">
            <span>Total</span>
            <span className="text-primary">${total.toFixed(2)}</span>
          </div>
        </Card>

        <div className="fixed bottom-0 left-0 right-0 p-4 bg-card border-t border-border flex gap-3">
          <Button variant="outline" className="rounded-xl" onClick={() => setStep("cart")}>Back</Button>
          <Button className="flex-1 h-12 rounded-xl text-base font-semibold" onClick={handlePlaceOrder} disabled={ordering}>
            {ordering ? <><Loader2 className="w-4 h-4 mr-2 animate-spin" /> Placing Order...</> : "Place Order"}
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 md:p-6 max-w-5xl mx-auto animate-fade-in pb-24">
      <h1 className="text-xl font-heading font-bold mb-1">Shopping Cart</h1>
      <p className="text-xs text-muted-foreground mb-6">{items.length} item{items.length > 1 ? "s" : ""} in cart</p>

      <div className="space-y-3">
        {items.map((item, idx) => (
          <Card key={idx} className="p-3 flex gap-3">
            <div className="w-20 h-20 rounded-xl bg-secondary overflow-hidden shrink-0">
              {item.image_url && <img src={item.image_url} alt={item.name} className="w-full h-full object-cover" />}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold truncate">{item.name}</p>
              <p className="text-xs text-muted-foreground">${item.price} {item.unit}</p>
              {item.selected_size && <p className="text-xs text-muted-foreground">Size: {item.selected_size}</p>}
              {item.selected_color && <p className="text-xs text-muted-foreground">Color: {item.selected_color}</p>}
              {item.offer && <p className="text-xs text-destructive">{item.offer}</p>}
              <div className="flex items-center gap-2 mt-2">
                <button onClick={() => updateQty(idx, item.quantity - 1)} className="w-7 h-7 rounded-lg border border-border flex items-center justify-center text-sm">-</button>
                <span className="text-sm font-bold w-6 text-center">{item.quantity}</span>
                <button onClick={() => updateQty(idx, item.quantity + 1)} className="w-7 h-7 rounded-lg border border-border flex items-center justify-center text-sm">+</button>
                <button onClick={() => removeItem(idx)} className="ml-auto p-1.5 hover:bg-destructive/10 rounded-lg"><Trash2 className="w-4 h-4 text-destructive" /></button>
              </div>
            </div>
          </Card>
        ))}
      </div>

      <div className="fixed bottom-0 left-0 right-0 p-4 bg-card border-t border-border">
        <div className="flex justify-between items-center mb-3">
          <span className="text-sm text-muted-foreground">Total ({items.length} items)</span>
          <span className="text-xl font-bold text-primary">${total.toFixed(2)}</span>
        </div>
        <Button className="w-full h-12 rounded-xl text-base font-semibold gap-2" onClick={() => setStep("address")}>
          Proceed to Checkout <ArrowRight className="w-4 h-4" />
        </Button>
      </div>
    </div>
  );
};

export default CustomerCart;
