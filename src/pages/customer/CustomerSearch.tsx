import { useState } from "react";
import { ArrowLeft, Search, Filter, ShoppingBag } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { CATEGORIES } from "@/constants/categories";
import { useNavigate, useSearchParams } from "react-router-dom";

const CustomerSearch = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const categoryFilter = searchParams.get("category");
  const [search, setSearch] = useState("");

  const selectedCategory = CATEGORIES.find(c => c.id === categoryFilter);

  return (
    <div className="animate-fade-in">
      <div className="px-4 pt-4 pb-2 flex items-center gap-3">
        <button onClick={() => navigate(-1)} className="p-2 rounded-lg hover:bg-secondary">
          <ArrowLeft className="w-5 h-5" />
        </button>
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
        <button className="p-2 rounded-lg hover:bg-secondary">
          <Filter className="w-5 h-5 text-muted-foreground" />
        </button>
      </div>

      {/* Category chips */}
      <div className="px-4 py-2 flex gap-2 overflow-x-auto scrollbar-hide">
        {CATEGORIES.slice(0, 10).map(cat => (
          <button
            key={cat.id}
            onClick={() => navigate(`/customer/search?category=${cat.id}`)}
            className={`shrink-0 px-3 py-1.5 rounded-full text-xs font-medium border transition-colors ${
              categoryFilter === cat.id
                ? "border-primary bg-primary/10 text-primary"
                : "border-border text-muted-foreground hover:border-foreground"
            }`}
          >
            {cat.name}
          </button>
        ))}
      </div>

      <div className="p-4">
        <Card className="p-8 text-center">
          <ShoppingBag className="w-12 h-12 text-muted-foreground/20 mx-auto mb-3" />
          <p className="text-sm text-muted-foreground">No products found</p>
        </Card>
      </div>
    </div>
  );
};

export default CustomerSearch;
