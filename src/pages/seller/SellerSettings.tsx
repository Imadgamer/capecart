import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Settings, Moon, Globe, Bell } from "lucide-react";
import { useState } from "react";

const SellerSettings = () => {
  const [darkMode, setDarkMode] = useState(false);
  const [pushNotif, setPushNotif] = useState(true);
  const [emailNotif, setEmailNotif] = useState(true);
  const [autoConfirm, setAutoConfirm] = useState(false);

  return (
    <div className="p-4 md:p-6 max-w-2xl mx-auto animate-fade-in">
      <h1 className="text-xl font-heading font-bold mb-1">Settings</h1>
      <p className="text-xs text-muted-foreground mb-6">Customize your seller experience</p>

      <div className="space-y-4">
        <Card className="p-4">
          <h3 className="text-sm font-heading font-semibold mb-4 flex items-center gap-2"><Bell className="w-4 h-4" /> Notifications</h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div><p className="text-sm font-medium">Order Notifications</p><p className="text-xs text-muted-foreground">Get notified about new orders</p></div>
              <Switch checked={pushNotif} onCheckedChange={setPushNotif} />
            </div>
            <div className="flex items-center justify-between">
              <div><p className="text-sm font-medium">Email Notifications</p><p className="text-xs text-muted-foreground">Receive email updates</p></div>
              <Switch checked={emailNotif} onCheckedChange={setEmailNotif} />
            </div>
          </div>
        </Card>

        <Card className="p-4">
          <h3 className="text-sm font-heading font-semibold mb-4 flex items-center gap-2"><Settings className="w-4 h-4" /> Order Settings</h3>
          <div className="flex items-center justify-between">
            <div><p className="text-sm font-medium">Auto-Confirm Orders</p><p className="text-xs text-muted-foreground">Automatically confirm new orders</p></div>
            <Switch checked={autoConfirm} onCheckedChange={setAutoConfirm} />
          </div>
        </Card>

        <Card className="p-4">
          <h3 className="text-sm font-heading font-semibold mb-4 flex items-center gap-2"><Moon className="w-4 h-4" /> Preferences</h3>
          <div className="flex items-center justify-between">
            <div><p className="text-sm font-medium">Dark Mode</p><p className="text-xs text-muted-foreground">Toggle dark theme</p></div>
            <Switch checked={darkMode} onCheckedChange={setDarkMode} />
          </div>
        </Card>
      </div>
    </div>
  );
};

export default SellerSettings;
