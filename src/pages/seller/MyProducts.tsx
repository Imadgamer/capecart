import { useState } from "react";
import { Package, PlusCircle, Edit, Trash2, Eye, EyeOff, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useNavigate } from "react-router-dom";
import { useSellerProducts, deleteProduct, updateProduct } from "@/hooks/useProducts";
import { toast } from "sonner";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";

const MyProducts = () => {
  const navigate = useNavigate();
  const { products, loading, refetch } = useSellerProducts();
  const [deleting, setDeleting] = useState<string | null>(null);

  const handleDelete = async (id: string) => {
    setDeleting(id);
    const { error } = await deleteProduct(id);
    if (error) toast.error("Failed to delete");
    else { toast.success("Product deleted"); refetch(); }
    setDeleting(null);
  };

  const togglePublish = async (id: string, current: boolean) => {
    await updateProduct(id, { is_published: !current } as any);
    toast.success(current ? "Product unpublished" : "Product published");
    refetch();
  };

  if (loading) {
    return (
      <div className="p-4 md:p-6 max-w-5xl mx-auto flex justify-center py-20">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="p-4 md:p-6 max-w-5xl mx-auto animate-fade-in">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-xl font-heading font-bold">My Products</h1>
          <p className="text-xs text-muted-foreground">{products.length} products listed</p>
        </div>
        <Button onClick={() => navigate("/seller/products/new")} className="rounded-xl gap-2" size="sm">
          <PlusCircle className="w-4 h-4" /> Add
        </Button>
      </div>

      {products.length === 0 ? (
        <Card className="p-12 text-center">
          <Package className="w-16 h-16 text-muted-foreground/20 mx-auto mb-4" />
          <h3 className="text-lg font-heading font-semibold text-foreground mb-1">No products yet</h3>
          <p className="text-sm text-muted-foreground mb-4">Start by adding your first product to the store</p>
          <Button onClick={() => navigate("/seller/products/new")} className="rounded-xl">
            <PlusCircle className="w-4 h-4 mr-2" /> Add Your First Product
          </Button>
        </Card>
      ) : (
        <div className="space-y-3">
          {products.map(product => {
            const firstImage = product.images?.[0]?.image_url;
            return (
              <Card key={product.id} className="p-3 flex gap-3">
                <div className="w-20 h-20 rounded-xl bg-secondary overflow-hidden shrink-0">
                  {firstImage ? (
                    <img src={firstImage} alt={product.name} className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <Package className="w-8 h-8 text-muted-foreground/30" />
                    </div>
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2">
                    <div className="min-w-0">
                      <h3 className="font-semibold text-sm truncate">{product.name}</h3>
                      <p className="text-primary font-bold text-sm mt-0.5">
                        ${product.price} <span className="text-xs font-normal text-muted-foreground">{product.unit}</span>
                      </p>
                    </div>
                    <Badge variant={product.is_published ? "default" : "secondary"} className="shrink-0 text-[10px]">
                      {product.is_published ? "Published" : "Draft"}
                    </Badge>
                  </div>
                  <div className="flex items-center gap-1 mt-2">
                    <Button variant="ghost" size="sm" className="h-7 px-2 text-xs" onClick={() => navigate(`/seller/products/edit/${product.id}`)}>
                      <Edit className="w-3 h-3 mr-1" /> Edit
                    </Button>
                    <Button variant="ghost" size="sm" className="h-7 px-2 text-xs" onClick={() => togglePublish(product.id, product.is_published)}>
                      {product.is_published ? <><EyeOff className="w-3 h-3 mr-1" /> Hide</> : <><Eye className="w-3 h-3 mr-1" /> Show</>}
                    </Button>
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button variant="ghost" size="sm" className="h-7 px-2 text-xs text-destructive hover:text-destructive">
                          <Trash2 className="w-3 h-3 mr-1" /> Delete
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>Delete "{product.name}"?</AlertDialogTitle>
                          <AlertDialogDescription>This action cannot be undone.</AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Cancel</AlertDialogCancel>
                          <AlertDialogAction onClick={() => handleDelete(product.id)} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
                            {deleting === product.id ? "Deleting..." : "Delete"}
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </div>
                </div>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default MyProducts;
