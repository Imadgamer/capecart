import { ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { CATEGORIES } from "@/constants/categories";

const CustomerCategories = () => {
  const navigate = useNavigate();

  return (
    <div className="animate-fade-in">
      <div className="px-4 pt-4 pb-2 flex items-center gap-3">
        <button onClick={() => navigate(-1)} className="p-2 rounded-lg hover:bg-secondary">
          <ArrowLeft className="w-5 h-5" />
        </button>
        <h1 className="text-lg font-heading font-bold">All Categories</h1>
      </div>

      <div className="p-4 grid grid-cols-3 gap-3">
        {CATEGORIES.map(cat => {
          const Icon = cat.icon;
          return (
            <button
              key={cat.id}
              onClick={() => navigate(`/customer/search?category=${cat.id}`)}
              className="flex flex-col items-center gap-2 p-4 rounded-2xl bg-card border border-border hover:border-primary/30 hover:shadow-sm transition-all"
            >
              <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
                <Icon className="w-6 h-6 text-primary" />
              </div>
              <span className="text-xs text-center font-medium text-foreground leading-tight">
                {cat.name}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default CustomerCategories;
