import { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import { Camera, Save } from "lucide-react";
import { toast } from "sonner";

const CustomerProfile = () => {
  const { user } = useAuth();
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [city, setCity] = useState("");
  const [country, setCountry] = useState("");

  const handleSave = () => {
    toast.success("Profile updated!");
  };

  return (
    <div className="p-4 md:p-6 max-w-2xl mx-auto animate-fade-in">
      <h1 className="text-xl font-heading font-bold mb-6">My Profile</h1>

      <Card className="p-6 mb-4">
        <div className="flex items-center gap-4 mb-6">
          <div className="relative">
            <div className="w-20 h-20 rounded-2xl bg-accent/10 flex items-center justify-center">
              <span className="text-2xl font-bold text-accent">C</span>
            </div>
            <button className="absolute -bottom-1 -right-1 w-7 h-7 bg-accent rounded-full flex items-center justify-center">
              <Camera className="w-3.5 h-3.5 text-accent-foreground" />
            </button>
          </div>
          <div>
            <p className="font-semibold">{user?.email}</p>
            <p className="text-xs text-muted-foreground">Customer Account</p>
          </div>
        </div>

        <div className="space-y-4">
          <div>
            <Label>Full Name</Label>
            <Input value={name} onChange={e => setName(e.target.value)} placeholder="Your full name" className="mt-1 h-11 rounded-xl" />
          </div>
          <div>
            <Label>Phone Number</Label>
            <Input value={phone} onChange={e => setPhone(e.target.value)} placeholder="+1 234 567 890" className="mt-1 h-11 rounded-xl" />
          </div>
          <div>
            <Label>Address</Label>
            <Input value={address} onChange={e => setAddress(e.target.value)} placeholder="Street address, House no." className="mt-1 h-11 rounded-xl" />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <Label>City</Label>
              <Input value={city} onChange={e => setCity(e.target.value)} placeholder="City" className="mt-1 h-11 rounded-xl" />
            </div>
            <div>
              <Label>Country</Label>
              <Input value={country} onChange={e => setCountry(e.target.value)} placeholder="Country" className="mt-1 h-11 rounded-xl" />
            </div>
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

export default CustomerProfile;
