import { useState, useEffect } from "react";
import { ArrowLeft, Search, Filter, ShoppingBag, Loader2 } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CATEGORIES } from "@/constants/categories";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useAllProducts } from "@/hooks/useProducts";

const CustomerSearch = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const categoryFilter = searchParams.get("category");
  const [search, setSearch] = useState("");
  const { products, loading, fetchProducts } = useAllProducts(categoryFilter);

  const selectedCategory = CATEGORIES.find(c => c.id === categoryFilter);

  useEffect(() => {
    const timer = setTimeout(() => {
      fetchProducts(search);
    }, 300);
    return () => clearTimeout(timer);
  }, [search]);

  return (
    <div className="animate-fade-in">
      <div className="px-4 pt-4 pb-2 flex items-center gap-3">
        <button onClick={() => navigate(-1)} className="p-2 rounded-lg hover:bg-secondary"><ArrowLeft className="w-5 h-5" /></button>
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder={selectedCategory ? `Search in ${selectedCategory.name}...` : "Search products..."}
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="pl-10 h-11 rounded-xl"
            autoFocus
          />
        </div>
      </div>

      {/* Category chips */}
      <div className="px-4 py-2 flex gap-2 overflow-x-auto scrollbar-hide">
        <button
          onClick={() => navigate("/customer/search")}
          className={`shrink-0 px-3 py-1.5 rounded-full text-xs font-medium border transition-colors ${!categoryFilter ? "border-primary bg-primary/10 text-primary" : "border-border text-muted-foreground"}`}
        >All</button>
        {CATEGORIES.slice(0, 15).map(cat => (
          <button
            key={cat.id}
            onClick={() => navigate(`/customer/search?category=${cat.id}`)}
            className={`shrink-0 px-3 py-1.5 rounded-full text-xs font-medium border transition-colors ${categoryFilter === cat.id ? "border-primary bg-primary/10 text-primary" : "border-border text-muted-foreground hover:border-foreground"}`}
          >{cat.name}</button>
        ))}
      </div>

      <div className="p-4">
        {loading ? (
          <div className="flex justify-center py-8"><Loader2 className="w-6 h-6 animate-spin text-primary" /></div>
        ) : products.length === 0 ? (
          <Card className="p-8 text-center">
            <ShoppingBag className="w-12 h-12 text-muted-foreground/20 mx-auto mb-3" />
            <p className="text-sm text-muted-foreground">No products found</p>
          </Card>
        ) : (
          <div className="grid grid-cols-2 gap-3">
            {products.map(product => {
              const firstImage = product.images?.[0]?.image_url;
              return (
                <Card key={product.id} className="overflow-hidden cursor-pointer hover:shadow-lg transition-all active:scale-[0.98]" onClick={() => navigate(`/customer/product/${product.id}`)}>
                  <div className="aspect-square bg-secondary relative">
                    {firstImage ? <img src={firstImage} alt={product.name} className="w-full h-full object-cover" loading="lazy" /> : <div className="w-full h-full flex items-center justify-center"><ShoppingBag className="w-8 h-8 text-muted-foreground/20" /></div>}
                    {product.offer && <Badge className="absolute top-2 left-2 text-[10px] bg-destructive">OFFER</Badge>}
                  </div>
                  <div className="p-3">
                    <p className="text-xs font-medium truncate">{product.name}</p>
                    <div className="flex items-baseline gap-1 mt-1">
                      <span className="text-sm font-bold text-primary">${product.price}</span>
                      <span className="text-[10px] text-muted-foreground">{product.unit}</span>
                    </div>
                  </div>
                </Card>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default CustomerSearch;
