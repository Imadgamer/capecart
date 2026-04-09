import { Package, PlusCircle, Edit, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useNavigate } from "react-router-dom";

const MyProducts = () => {
  const navigate = useNavigate();

  return (
    <div className="p-4 md:p-6 max-w-5xl mx-auto animate-fade-in">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-xl font-heading font-bold">My Products</h1>
          <p className="text-xs text-muted-foreground">Manage your listed products</p>
        </div>
        <Button onClick={() => navigate("/seller/products/new")} className="rounded-xl gap-2" size="sm">
          <PlusCircle className="w-4 h-4" />
          Add
        </Button>
      </div>

      <Card className="p-12 text-center">
        <Package className="w-16 h-16 text-muted-foreground/20 mx-auto mb-4" />
        <h3 className="text-lg font-heading font-semibold text-foreground mb-1">No products yet</h3>
        <p className="text-sm text-muted-foreground mb-4">Start by adding your first product to the store</p>
        <Button onClick={() => navigate("/seller/products/new")} className="rounded-xl">
          <PlusCircle className="w-4 h-4 mr-2" />
          Add Your First Product
        </Button>
      </Card>
    </div>
  );
};

export default MyProducts;
