import { Card } from "@/components/ui/card";
import { Tag, Percent, ShoppingBag, Loader2 } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useAllProducts } from "@/hooks/useProducts";

const CustomerDeals = () => {
  const navigate = useNavigate();
  const { products, loading } = useAllProducts();
  const deals = products.filter(p => p.offer);

  if (loading) return <div className="flex justify-center py-20"><Loader2 className="w-8 h-8 animate-spin text-primary" /></div>;

  return (
    <div className="p-4 md:p-6 max-w-5xl mx-auto animate-fade-in">
      <h1 className="text-xl font-heading font-bold mb-1">Deals & Offers</h1>
      <p className="text-xs text-muted-foreground mb-6">Best deals from sellers</p>

      {deals.length === 0 ? (
        <Card className="p-12 text-center">
          <Tag className="w-16 h-16 text-muted-foreground/20 mx-auto mb-4" />
          <h3 className="text-lg font-heading font-semibold">No deals right now</h3>
          <p className="text-sm text-muted-foreground">Check back soon for amazing offers!</p>
        </Card>
      ) : (
        <div className="grid grid-cols-2 gap-3">
          {deals.map(product => {
            const firstImage = product.images?.[0]?.image_url;
            return (
              <Card key={product.id} className="overflow-hidden cursor-pointer hover:shadow-lg transition-all" onClick={() => navigate(`/customer/product/${product.id}`)}>
                <div className="aspect-square bg-secondary relative">
                  {firstImage ? <img src={firstImage} alt={product.name} className="w-full h-full object-cover" /> :
                  <div className="w-full h-full flex items-center justify-center"><ShoppingBag className="w-8 h-8 text-muted-foreground/20" /></div>}
                  <div className="absolute top-2 left-2 bg-destructive text-destructive-foreground text-[10px] font-bold px-2 py-0.5 rounded-full flex items-center gap-1">
                    <Percent className="w-3 h-3" /> DEAL
                  </div>
                </div>
                <div className="p-3">
                  <p className="text-xs font-medium truncate">{product.name}</p>
                  <p className="text-sm font-bold text-primary mt-1">${product.price}</p>
                  <p className="text-[10px] text-destructive font-semibold mt-0.5">{product.offer}</p>
                </div>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default CustomerDeals;
