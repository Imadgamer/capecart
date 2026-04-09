import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { CATEGORIES } from "@/constants/categories";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, Check, ArrowRight } from "lucide-react";
import { toast } from "sonner";

const CategorySelect = () => {
  const navigate = useNavigate();
  const [selected, setSelected] = useState<string[]>([]);
  const [search, setSearch] = useState("");
  const [customCategory, setCustomCategory] = useState("");

  const filtered = CATEGORIES.filter(c =>
    c.name.toLowerCase().includes(search.toLowerCase())
  );

  const toggleCategory = (id: string) => {
    setSelected(prev =>
      prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]
    );
  };

  const handleContinue = () => {
    if (selected.length === 0 && !customCategory.trim()) {
      toast.error("Please select at least one category");
      return;
    }
    const categories = [...selected];
    if (customCategory.trim()) categories.push(`custom:${customCategory.trim()}`);
    localStorage.setItem("seller_categories", JSON.stringify(categories));
    toast.success("Categories saved!");
    navigate("/seller");
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <div className="px-6 pt-8 pb-4">
        <h1 className="text-2xl font-heading font-bold text-foreground">Select Your Business</h1>
        <p className="text-sm text-muted-foreground mt-1">Choose the categories that best describe your business</p>
      </div>

      {/* Search */}
      <div className="px-6 mb-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Search categories..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="pl-10 h-11 rounded-xl"
          />
        </div>
      </div>

      {/* Categories Grid */}
      <div className="flex-1 overflow-y-auto px-6 pb-4">
        <div className="grid grid-cols-3 gap-3">
          {filtered.map(cat => {
            const isSelected = selected.includes(cat.id);
            const Icon = cat.icon;
            return (
              <button
                key={cat.id}
                onClick={() => toggleCategory(cat.id)}
                className={`relative flex flex-col items-center gap-2 p-4 rounded-2xl border-2 transition-all ${
                  isSelected
                    ? "border-primary bg-primary/5"
                    : "border-border bg-card hover:border-muted-foreground/30"
                }`}
              >
                {isSelected && (
                  <div className="absolute top-2 right-2 w-5 h-5 rounded-full bg-primary flex items-center justify-center">
                    <Check className="w-3 h-3 text-primary-foreground" />
                  </div>
                )}
                <Icon className={`w-6 h-6 ${isSelected ? "text-primary" : "text-muted-foreground"}`} />
                <span className={`text-xs text-center leading-tight font-medium ${isSelected ? "text-primary" : "text-foreground"}`}>
                  {cat.name}
                </span>
              </button>
            );
          })}
        </div>

        {/* Custom Category */}
        <div className="mt-6 p-4 rounded-2xl border-2 border-dashed border-border bg-card">
          <p className="text-sm font-medium text-foreground mb-2">Other Category</p>
          <Input
            placeholder="Type your custom category..."
            value={customCategory}
            onChange={e => setCustomCategory(e.target.value)}
            className="h-11 rounded-xl"
          />
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="px-6 py-4 border-t border-border bg-card">
        <div className="flex items-center justify-between mb-3">
          <span className="text-sm text-muted-foreground">
            {selected.length} selected
          </span>
        </div>
        <Button onClick={handleContinue} className="w-full h-12 rounded-xl text-base font-semibold gap-2">
          Continue
          <ArrowRight className="w-4 h-4" />
        </Button>
      </div>
    </div>
  );
};

export default CategorySelect;
