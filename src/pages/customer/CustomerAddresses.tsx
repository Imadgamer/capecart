import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuth } from "@/contexts/AuthContext";
import { useProfile } from "@/hooks/useProfile";
import { useState, useEffect } from "react";
import { MapPin, Plus, Save, Loader2 } from "lucide-react";
import { toast } from "sonner";

const CustomerAddresses = () => {
  const { user } = useAuth();
  const { profile, loading, upsertProfile } = useProfile();
  const [street, setStreet] = useState("");
  const [houseNo, setHouseNo] = useState("");
  const [city, setCity] = useState("");
  const [country, setCountry] = useState("");
  const [zip, setZip] = useState("");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (profile) {
      setStreet(profile.address_street || "");
      setHouseNo(profile.address_house_no || "");
      setCity(profile.address_city || "");
      setCountry(profile.address_country || "");
      setZip(profile.address_zip || "");
    }
  }, [profile]);

  const handleSave = async () => {
    setSaving(true);
    const { error } = await upsertProfile({
      address_street: street.trim() || null,
      address_house_no: houseNo.trim() || null,
      address_city: city.trim() || null,
      address_country: country.trim() || null,
      address_zip: zip.trim() || null,
    } as any);
    if (error) toast.error("Failed to save");
    else toast.success("Address updated!");
    setSaving(false);
  };

  if (loading) return <div className="flex justify-center py-20"><Loader2 className="w-8 h-8 animate-spin text-primary" /></div>;

  return (
    <div className="p-4 md:p-6 max-w-2xl mx-auto animate-fade-in">
      <h1 className="text-xl font-heading font-bold mb-1">My Addresses</h1>
      <p className="text-xs text-muted-foreground mb-6">Manage your delivery addresses</p>

      <Card className="p-4 space-y-4">
        <div className="flex items-center gap-2 mb-2">
          <MapPin className="w-5 h-5 text-primary" />
          <h3 className="font-heading font-semibold">Primary Address</h3>
        </div>
        <div><Label>Street</Label><Input value={street} onChange={e => setStreet(e.target.value)} placeholder="Street address" className="mt-1 h-11 rounded-xl" /></div>
        <div><Label>House / Apt No.</Label><Input value={houseNo} onChange={e => setHouseNo(e.target.value)} placeholder="House no." className="mt-1 h-11 rounded-xl" /></div>
        <div className="grid grid-cols-2 gap-3">
          <div><Label>City</Label><Input value={city} onChange={e => setCity(e.target.value)} placeholder="City" className="mt-1 h-11 rounded-xl" /></div>
          <div><Label>Country</Label><Input value={country} onChange={e => setCountry(e.target.value)} placeholder="Country" className="mt-1 h-11 rounded-xl" /></div>
        </div>
        <div><Label>ZIP Code</Label><Input value={zip} onChange={e => setZip(e.target.value)} placeholder="12345" className="mt-1 h-11 rounded-xl" /></div>
      </Card>

      <Button onClick={handleSave} disabled={saving} className="w-full h-12 rounded-xl font-semibold gap-2 mt-4">
        {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
        {saving ? "Saving..." : "Save Address"}
      </Button>
    </div>
  );
};

export default CustomerAddresses;
