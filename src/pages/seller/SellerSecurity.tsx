import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";
import { Lock, Shield, Smartphone } from "lucide-react";
import { toast } from "sonner";

const SellerSecurity = () => {
  const { user } = useAuth();

  return (
    <div className="p-4 md:p-6 max-w-2xl mx-auto animate-fade-in">
      <h1 className="text-xl font-heading font-bold mb-1">Security</h1>
      <p className="text-xs text-muted-foreground mb-6">Manage your account security</p>

      <div className="space-y-4">
        <Card className="p-4">
          <div className="flex items-center gap-3 mb-4"><Shield className="w-5 h-5 text-primary" /><h3 className="text-sm font-heading font-semibold">Account Info</h3></div>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between"><span className="text-muted-foreground">Email</span><span className="font-medium">{user?.email}</span></div>
            <div className="flex justify-between"><span className="text-muted-foreground">Account Created</span><span className="font-medium">{user?.created_at ? new Date(user.created_at).toLocaleDateString() : "N/A"}</span></div>
          </div>
        </Card>
        <Card className="p-4">
          <div className="flex items-center gap-3 mb-4"><Lock className="w-5 h-5 text-primary" /><h3 className="text-sm font-heading font-semibold">Password</h3></div>
          <Button variant="outline" className="w-full rounded-xl" onClick={() => toast.info("Password change email sent")}>Change Password</Button>
        </Card>
      </div>
    </div>
  );
};

export default SellerSecurity;
