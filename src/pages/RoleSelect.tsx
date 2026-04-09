import { useNavigate } from "react-router-dom";
import { Store, ShoppingBag } from "lucide-react";

const RoleSelect = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Header */}
      <div className="pt-16 pb-8 px-6 text-center">
        <div className="inline-flex items-center gap-2 mb-6">
          <div className="w-10 h-10 rounded-xl bg-primary flex items-center justify-center">
            <ShoppingBag className="w-5 h-5 text-primary-foreground" />
          </div>
          <h1 className="text-2xl font-heading font-bold text-foreground">CapeCart</h1>
        </div>
        <p className="text-muted-foreground text-sm max-w-xs mx-auto">
          Your one-stop marketplace for buying and selling everything
        </p>
      </div>

      {/* Role Cards */}
      <div className="flex-1 px-6 pb-8 flex flex-col gap-4 max-w-md mx-auto w-full">
        <h2 className="text-lg font-heading font-semibold text-center text-foreground mb-2">
          How would you like to use CapeCart?
        </h2>

        {/* Seller Card */}
        <button
          onClick={() => navigate("/auth?role=seller")}
          className="group relative overflow-hidden rounded-2xl border-2 border-border bg-card p-6 text-left transition-all hover:border-primary hover:shadow-lg active:scale-[0.98]"
        >
          <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-bl-full transition-all group-hover:bg-primary/10" />
          <div className="relative">
            <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center mb-4">
              <Store className="w-7 h-7 text-primary" />
            </div>
            <h3 className="text-xl font-heading font-bold text-foreground mb-1">I'm a Seller</h3>
            <p className="text-sm text-muted-foreground leading-relaxed">
              List your products, manage orders, chat with customers, and grow your business
            </p>
            <div className="mt-4 flex flex-wrap gap-2">
              {["Upload Products", "Manage Orders", "Chat", "Analytics"].map(tag => (
                <span key={tag} className="text-xs px-2.5 py-1 rounded-full bg-primary/10 text-primary font-medium">
                  {tag}
                </span>
              ))}
            </div>
          </div>
        </button>

        {/* Customer Card */}
        <button
          onClick={() => navigate("/auth?role=customer")}
          className="group relative overflow-hidden rounded-2xl border-2 border-border bg-card p-6 text-left transition-all hover:border-accent hover:shadow-lg active:scale-[0.98]"
        >
          <div className="absolute top-0 right-0 w-32 h-32 bg-accent/5 rounded-bl-full transition-all group-hover:bg-accent/10" />
          <div className="relative">
            <div className="w-14 h-14 rounded-2xl bg-accent/10 flex items-center justify-center mb-4">
              <ShoppingBag className="w-7 h-7 text-accent" />
            </div>
            <h3 className="text-xl font-heading font-bold text-foreground mb-1">I'm a Customer</h3>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Discover products, shop from local sellers, get great deals, and enjoy fast delivery
            </p>
            <div className="mt-4 flex flex-wrap gap-2">
              {["Browse Products", "Great Deals", "Chat with Seller", "Track Orders"].map(tag => (
                <span key={tag} className="text-xs px-2.5 py-1 rounded-full bg-accent/10 text-accent font-medium">
                  {tag}
                </span>
              ))}
            </div>
          </div>
        </button>
      </div>

      {/* Footer */}
      <div className="pb-6 text-center">
        <p className="text-xs text-muted-foreground">Made By Dami Ai</p>
      </div>
    </div>
  );
};

export default RoleSelect;
