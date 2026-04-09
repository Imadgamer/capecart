import { useLocation } from "react-router-dom";
import { Card } from "@/components/ui/card";
import { Construction } from "lucide-react";

const PlaceholderPage = () => {
  const location = useLocation();
  const pageName = location.pathname.split("/").pop() || "Page";
  const title = pageName.charAt(0).toUpperCase() + pageName.slice(1).replace(/-/g, " ");

  return (
    <div className="p-4 md:p-6 max-w-5xl mx-auto animate-fade-in">
      <h1 className="text-xl font-heading font-bold mb-6">{title}</h1>
      <Card className="p-12 text-center">
        <Construction className="w-16 h-16 text-muted-foreground/20 mx-auto mb-4" />
        <h3 className="text-lg font-heading font-semibold text-foreground">Coming Soon</h3>
        <p className="text-sm text-muted-foreground mt-1">This feature is being built and will be available shortly</p>
      </Card>
    </div>
  );
};

export default PlaceholderPage;
