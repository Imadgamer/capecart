import { useState, useEffect, useRef } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useProfile } from "@/hooks/useProfile";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card } from "@/components/ui/card";
import { Camera, Save, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";

const SellerProfile = () => {
  const { user } = useAuth();
  const { profile, loading, upsertProfile } = useProfile();
  const fileRef = useRef<HTMLInputElement>(null);

  const [shopName, setShopName] = useState("");
  const [displayName, setDisplayName] = useState("");
  const [phone, setPhone] = useState("");
  const [street, setStreet] = useState("");
  const [city, setCity] = useState("");
  const [country, setCountry] = useState("");
  const [avatar, setAvatar] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (profile) {
      setShopName(profile.business_name || "");
      setDisplayName(profile.display_name || "");
      setPhone(profile.phone || "");
      setStreet(profile.address_street || "");
      setCity(profile.address_city || "");
      setCountry(profile.address_country || "");
      setAvatar(profile.avatar_url);
    }
  }, [profile]);

  const handleAvatarUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !user) return;
    const path = `${user.id}/avatar.${file.name.split(".").pop()}`;
    await supabase.storage.from("product-images").upload(path, file, { upsert: true });
    const { data } = supabase.storage.from("product-images").getPublicUrl(path);
    setAvatar(data.publicUrl);
  };

  const handleSave = async () => {
    setSaving(true);
    const { error } = await upsertProfile({
      display_name: displayName.trim() || null,
      business_name: shopName.trim() || null,
      phone: phone.trim() || null,
      address_street: street.trim() || null,
      address_city: city.trim() || null,
      address_country: country.trim() || null,
      avatar_url: avatar,
      role: "seller",
    } as any);
    if (error) toast.error("Failed to save");
    else toast.success("Profile updated!");
    setSaving(false);
  };

  if (loading) return <div className="flex justify-center py-20"><Loader2 className="w-8 h-8 animate-spin text-primary" /></div>;

  return (
    <div className="p-4 md:p-6 max-w-2xl mx-auto animate-fade-in">
      <h1 className="text-xl font-heading font-bold mb-6">Edit Profile</h1>
      <Card className="p-6 mb-4">
        <div className="flex items-center gap-4 mb-6">
          <div className="relative">
            <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={handleAvatarUpload} />
            <div className="w-20 h-20 rounded-2xl bg-primary/10 flex items-center justify-center overflow-hidden">
              {avatar ? <img src={avatar} alt="" className="w-full h-full object-cover" /> : <span className="text-2xl font-bold text-primary">S</span>}
            </div>
            <button onClick={() => fileRef.current?.click()} className="absolute -bottom-1 -right-1 w-7 h-7 bg-primary rounded-full flex items-center justify-center">
              <Camera className="w-3.5 h-3.5 text-primary-foreground" />
            </button>
          </div>
          <div>
            <p className="font-semibold text-foreground">{user?.email}</p>
            <p className="text-xs text-muted-foreground">Seller Account</p>
          </div>
        </div>
        <div className="space-y-4">
          <div><Label>Display Name</Label><Input value={displayName} onChange={e => setDisplayName(e.target.value)} placeholder="Your name" className="mt-1 h-11 rounded-xl" /></div>
          <div><Label>Shop Name</Label><Input value={shopName} onChange={e => setShopName(e.target.value)} placeholder="Your shop name" className="mt-1 h-11 rounded-xl" /></div>
          <div><Label>Phone Number</Label><Input value={phone} onChange={e => setPhone(e.target.value)} placeholder="+1 234 567 890" className="mt-1 h-11 rounded-xl" /></div>
          <div><Label>Street Address</Label><Input value={street} onChange={e => setStreet(e.target.value)} placeholder="123 Main St" className="mt-1 h-11 rounded-xl" /></div>
          <div className="grid grid-cols-2 gap-3">
            <div><Label>City</Label><Input value={city} onChange={e => setCity(e.target.value)} placeholder="City" className="mt-1 h-11 rounded-xl" /></div>
            <div><Label>Country</Label><Input value={country} onChange={e => setCountry(e.target.value)} placeholder="Country" className="mt-1 h-11 rounded-xl" /></div>
          </div>
        </div>
      </Card>
      <Button onClick={handleSave} disabled={saving} className="w-full h-12 rounded-xl font-semibold gap-2">
        {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
        {saving ? "Saving..." : "Save Changes"}
      </Button>
    </div>
  );
};

export default SellerProfile;
