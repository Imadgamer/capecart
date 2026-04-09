import { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card } from "@/components/ui/card";
import { Camera, Save } from "lucide-react";
import { toast } from "sonner";

const SellerProfile = () => {
  const { user } = useAuth();
  const [shopName, setShopName] = useState("");
  const [bio, setBio] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");

  const handleSave = () => {
    toast.success("Profile updated successfully!");
  };

  return (
    <div className="p-4 md:p-6 max-w-2xl mx-auto animate-fade-in">
      <h1 className="text-xl font-heading font-bold mb-6">Edit Profile</h1>

      <Card className="p-6 mb-4">
        <div className="flex items-center gap-4 mb-6">
          <div className="relative">
            <div className="w-20 h-20 rounded-2xl bg-primary/10 flex items-center justify-center">
              <span className="text-2xl font-bold text-primary">S</span>
            </div>
            <button className="absolute -bottom-1 -right-1 w-7 h-7 bg-primary rounded-full flex items-center justify-center">
              <Camera className="w-3.5 h-3.5 text-primary-foreground" />
            </button>
          </div>
          <div>
            <p className="font-semibold text-foreground">{user?.email}</p>
            <p className="text-xs text-muted-foreground">Seller Account</p>
          </div>
        </div>

        <div className="space-y-4">
          <div>
            <Label>Shop Name</Label>
            <Input value={shopName} onChange={e => setShopName(e.target.value)} placeholder="Your shop name" className="mt-1 h-11 rounded-xl" />
          </div>
          <div>
            <Label>Phone Number</Label>
            <Input value={phone} onChange={e => setPhone(e.target.value)} placeholder="+1 234 567 890" className="mt-1 h-11 rounded-xl" />
          </div>
          <div>
            <Label>Business Address</Label>
            <Input value={address} onChange={e => setAddress(e.target.value)} placeholder="123 Main St, City" className="mt-1 h-11 rounded-xl" />
          </div>
          <div>
            <Label>About Your Business</Label>
            <Textarea value={bio} onChange={e => setBio(e.target.value)} placeholder="Tell customers about your business..." className="mt-1 rounded-xl" />
          </div>
        </div>
      </Card>

      <Button onClick={handleSave} className="w-full h-12 rounded-xl font-semibold gap-2">
        <Save className="w-4 h-4" />
        Save Changes
      </Button>
    </div>
  );
};

export default SellerProfile;
