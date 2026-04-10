import { Card } from "@/components/ui/card";
import { MapPin, Loader2 } from "lucide-react";
import { useProfile } from "@/hooks/useProfile";

const SellerLocation = () => {
  const { profile, loading } = useProfile();

  if (loading) return <div className="flex justify-center py-20"><Loader2 className="w-8 h-8 animate-spin text-primary" /></div>;

  return (
    <div className="p-4 md:p-6 max-w-2xl mx-auto animate-fade-in">
      <h1 className="text-xl font-heading font-bold mb-1">Store Location</h1>
      <p className="text-xs text-muted-foreground mb-6">Your business location</p>

      <Card className="p-6">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
            <MapPin className="w-6 h-6 text-primary" />
          </div>
          <div>
            <h3 className="font-heading font-semibold">{profile?.business_name || "Your Store"}</h3>
            <p className="text-xs text-muted-foreground">Business Location</p>
          </div>
        </div>

        <div className="space-y-2 text-sm">
          <div className="flex justify-between"><span className="text-muted-foreground">Street</span><span className="font-medium">{profile?.address_street || "Not set"}</span></div>
          <div className="flex justify-between"><span className="text-muted-foreground">City</span><span className="font-medium">{profile?.address_city || "Not set"}</span></div>
          <div className="flex justify-between"><span className="text-muted-foreground">Country</span><span className="font-medium">{profile?.address_country || "Not set"}</span></div>
        </div>

        <p className="text-xs text-muted-foreground mt-4">Update your location in your Profile page</p>
      </Card>
    </div>
  );
};

export default SellerLocation;
