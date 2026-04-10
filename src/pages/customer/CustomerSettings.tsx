import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Settings, Moon, Globe } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

const CustomerSettings = () => {
  const [darkMode, setDarkMode] = useState(false);
  const [pushNotif, setPushNotif] = useState(true);
  const [emailNotif, setEmailNotif] = useState(true);
  const [language, setLanguage] = useState("English");

  return (
    <div className="p-4 md:p-6 max-w-2xl mx-auto animate-fade-in">
      <h1 className="text-xl font-heading font-bold mb-1">Settings</h1>
      <p className="text-xs text-muted-foreground mb-6">Customize your experience</p>

      <div className="space-y-4">
        <Card className="p-4">
          <h3 className="text-sm font-heading font-semibold mb-4">Notifications</h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div><p className="text-sm font-medium">Push Notifications</p><p className="text-xs text-muted-foreground">Get notified about orders</p></div>
              <Switch checked={pushNotif} onCheckedChange={setPushNotif} />
            </div>
            <div className="flex items-center justify-between">
              <div><p className="text-sm font-medium">Email Notifications</p><p className="text-xs text-muted-foreground">Receive email updates</p></div>
              <Switch checked={emailNotif} onCheckedChange={setEmailNotif} />
            </div>
          </div>
        </Card>

        <Card className="p-4">
          <h3 className="text-sm font-heading font-semibold mb-4">Preferences</h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2"><Moon className="w-4 h-4" /><p className="text-sm font-medium">Dark Mode</p></div>
              <Switch checked={darkMode} onCheckedChange={setDarkMode} />
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2"><Globe className="w-4 h-4" /><p className="text-sm font-medium">Language</p></div>
              <p className="text-sm text-muted-foreground">{language}</p>
            </div>
          </div>
        </Card>

        <Card className="p-4">
          <h3 className="text-sm font-heading font-semibold mb-4">Account</h3>
          <div className="space-y-3">
            <Button variant="outline" className="w-full justify-start rounded-xl" onClick={() => toast.info("Feature coming soon")}>Change Password</Button>
            <Button variant="outline" className="w-full justify-start rounded-xl text-destructive hover:text-destructive" onClick={() => toast.info("Please contact support to delete your account")}>Delete Account</Button>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default CustomerSettings;
