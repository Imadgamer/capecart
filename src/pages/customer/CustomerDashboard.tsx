import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Search, ChevronRight, ShoppingBag, Star, Loader2 } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CATEGORIES } from "@/constants/categories";
import { useAllProducts } from "@/hooks/useProducts";
import logo from "@/assets/logo.png";

const CustomerDashboard = () => {
  const navigate = useNavigate();
  const [search, setSearch] = useState("");
  const { products, loading } = useAllProducts();

  const featuredCategories = CATEGORIES.slice(0, 12);

  // Group products by category
  const categoryProducts: Record<string, typeof products> = {};
  products.forEach(p => {
    if (!categoryProducts[p.category]) categoryProducts[p.category] = [];
    categoryProducts[p.category].push(p);
  });

  return (
    <div className="animate-fade-in">
      {/* Search Bar */}
      <div className="px-4 pt-4 pb-2">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Search products, brands, categories..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="pl-10 h-12 rounded-2xl bg-secondary border-0 text-sm"
            onFocus={() => navigate("/customer/search")}
          />
        </div>
      </div>

      {/* Banner */}
      <div className="px-4 py-3">
        <div className="rounded-2xl bg-gradient-to-r from-primary to-primary/80 p-5 text-primary-foreground">
          <p className="text-xs font-medium opacity-80">Welcome to</p>
          <h2 className="text-xl font-heading font-bold mt-1">CapeCart Marketplace</h2>
          <p className="text-sm opacity-90 mt-1">Discover amazing deals from local sellers</p>
        </div>
      </div>

      {/* Categories */}
      <div className="px-4 py-3">
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-lg font-heading font-semibold">Categories</h2>
          <button onClick={() => navigate("/customer/categories")} className="text-sm text-primary font-medium flex items-center gap-1">
            See All <ChevronRight className="w-4 h-4" />
          </button>
        </div>
        <div className="grid grid-cols-4 gap-3">
          {featuredCategories.map(cat => {
            const Icon = cat.icon;
            return (
              <button key={cat.id} onClick={() => navigate(`/customer/search?category=${cat.id}`)} className="flex flex-col items-center gap-1.5 p-3 rounded-2xl bg-card border border-border hover:border-primary/30 transition-colors">
                <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center"><Icon className="w-5 h-5 text-primary" /></div>
                <span className="text-[10px] text-center font-medium text-foreground leading-tight">{cat.name}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* All Products */}
      <div className="px-4 py-3">
        <h2 className="text-lg font-heading font-semibold mb-3">Trending Products</h2>
        {loading ? (
          <div className="flex justify-center py-8"><Loader2 className="w-6 h-6 animate-spin text-primary" /></div>
        ) : products.length === 0 ? (
          <Card className="p-8 text-center">
            <ShoppingBag className="w-12 h-12 text-muted-foreground/20 mx-auto mb-3" />
            <p className="text-sm text-muted-foreground">No products available yet</p>
            <p className="text-xs text-muted-foreground mt-1">Check back soon for amazing deals!</p>
          </Card>
        ) : (
          <div className="grid grid-cols-2 gap-3">
            {products.map(product => {
              const firstImage = product.images?.[0]?.image_url;
              return (
                <Card
                  key={product.id}
                  className="overflow-hidden cursor-pointer hover:shadow-lg transition-all active:scale-[0.98]"
                  onClick={() => navigate(`/customer/product/${product.id}`)}
                >
                  <div className="aspect-square bg-secondary relative">
                    {firstImage ? (
                      <img src={firstImage} alt={product.name} className="w-full h-full object-cover" loading="lazy" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center"><ShoppingBag className="w-8 h-8 text-muted-foreground/20" /></div>
                    )}
                    {product.offer && (
                      <Badge className="absolute top-2 left-2 text-[10px] bg-destructive">OFFER</Badge>
                    )}
                  </div>
                  <div className="p-3">
                    <p className="text-xs font-medium truncate text-foreground">{product.name}</p>
                    <div className="flex items-baseline gap-1 mt-1">
                      <span className="text-sm font-bold text-primary">${product.price}</span>
                      <span className="text-[10px] text-muted-foreground">{product.unit}</span>
                    </div>
                    {product.offer && <p className="text-[10px] text-destructive mt-1 truncate">{product.offer}</p>}
                  </div>
                </Card>
              );
            })}
          </div>
        )}
      </div>

      {/* Footer */}
      <div className="px-4 py-8 text-center">
        <p className="text-xs text-muted-foreground">Made By Dami Ai</p>
      </div>
    </div>
  );
};

export default CustomerDashboard;
