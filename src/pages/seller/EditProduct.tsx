import { useState, useEffect, useRef } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card } from "@/components/ui/card";
import { ArrowLeft, ImagePlus, X, Tag, Loader2 } from "lucide-react";
import { CATEGORIES } from "@/constants/categories";
import { toast } from "sonner";
import { useAuth } from "@/contexts/AuthContext";
import { updateProduct, uploadProductImage } from "@/hooks/useProducts";
import { supabase } from "@/integrations/supabase/client";

const SIZES = ["XS", "S", "M", "L", "XL", "XXL", "XXXL"];
const UNIT_OPTIONS = ["Per Piece", "Per Kg", "Per Dozen", "Per Liter", "Per Meter", "Per Box", "Per Pack"];

const EditProduct = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [unit, setUnit] = useState("Per Piece");
  const [category, setCategory] = useState("");
  const [offer, setOffer] = useState("");
  const [customInfo, setCustomInfo] = useState("");
  const [selectedSizes, setSelectedSizes] = useState<string[]>([]);
  const [existingImages, setExistingImages] = useState<{ id: string; image_url: string }[]>([]);
  const [newImages, setNewImages] = useState<{ file: File; preview: string }[]>([]);
  const [videoUrl, setVideoUrl] = useState("");
  const [colors, setColors] = useState("");
  const [stock, setStock] = useState("");
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);

  useEffect(() => {
    const fetchProduct = async () => {
      if (!id) return;
      const { data } = await supabase
        .from("products")
        .select("*, product_images(*)")
        .eq("id", id)
        .single();
      if (data) {
        setName(data.name);
        setDescription(data.description || "");
        setPrice(String(data.price));
        setUnit(data.unit);
        setCategory(data.category);
        setOffer(data.offer || "");
        setCustomInfo(data.custom_info || "");
        setSelectedSizes(data.sizes || []);
        setVideoUrl(data.video_url || "");
        setColors((data.colors || []).join(", "));
        setStock(String(data.stock || ""));
        setExistingImages((data as any).product_images || []);
      }
      setFetching(false);
    };
    fetchProduct();
  }, [id]);

  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    const imgs = files.map(f => ({ file: f, preview: URL.createObjectURL(f) }));
    setNewImages(prev => [...prev, ...imgs]);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const removeExistingImage = async (imgId: string) => {
    await supabase.from("product_images").delete().eq("id", imgId);
    setExistingImages(prev => prev.filter(i => i.id !== imgId));
  };

  const removeNewImage = (idx: number) => {
    setNewImages(prev => {
      URL.revokeObjectURL(prev[idx].preview);
      return prev.filter((_, i) => i !== idx);
    });
  };

  const toggleSize = (size: string) => {
    setSelectedSizes(prev => prev.includes(size) ? prev.filter(s => s !== size) : [...prev, size]);
  };

  const handleSave = async () => {
    if (!user || !id) return;
    if (!name.trim()) { toast.error("Product name is required"); return; }
    if (!price) { toast.error("Price is required"); return; }

    setLoading(true);
    try {
      // Upload new images
      for (const img of newImages) {
        const { url } = await uploadProductImage(user.id, img.file);
        if (url) {
          await supabase.from("product_images").insert({ product_id: id, image_url: url, display_order: existingImages.length });
        }
      }

      const colorsArr = colors.split(",").map(c => c.trim()).filter(Boolean);
      await updateProduct(id, {
        name: name.trim(),
        description: description.trim() || null,
        price: parseFloat(price),
        unit,
        category,
        offer: offer.trim() || null,
        sizes: selectedSizes,
        colors: colorsArr,
        stock: parseInt(stock) || 0,
        video_url: videoUrl.trim() || null,
        custom_info: customInfo.trim() || null,
      } as any);

      toast.success("Product updated!");
      navigate("/seller/products");
    } finally {
      setLoading(false);
    }
  };

  if (fetching) {
    return <div className="flex justify-center py-20"><Loader2 className="w-8 h-8 animate-spin text-primary" /></div>;
  }

  return (
    <div className="p-4 md:p-6 max-w-2xl mx-auto animate-fade-in pb-24">
      <div className="flex items-center gap-3 mb-6">
        <button onClick={() => navigate(-1)} className="p-2 rounded-lg hover:bg-secondary"><ArrowLeft className="w-5 h-5" /></button>
        <div>
          <h1 className="text-xl font-heading font-bold">Edit Product</h1>
          <p className="text-xs text-muted-foreground">Update your product details</p>
        </div>
      </div>

      <div className="space-y-6">
        <Card className="p-4">
          <Label className="text-sm font-semibold mb-3 block">Product Images</Label>
          <input ref={fileInputRef} type="file" accept="image/*" multiple className="hidden" onChange={handleImageSelect} />
          <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide">
            {existingImages.map(img => (
              <div key={img.id} className="relative shrink-0 w-24 h-24 rounded-xl overflow-hidden border border-border">
                <img src={img.image_url} alt="" className="w-full h-full object-cover" />
                <button onClick={() => removeExistingImage(img.id)} className="absolute top-1 right-1 w-5 h-5 bg-destructive rounded-full flex items-center justify-center">
                  <X className="w-3 h-3 text-destructive-foreground" />
                </button>
              </div>
            ))}
            {newImages.map((img, idx) => (
              <div key={`new-${idx}`} className="relative shrink-0 w-24 h-24 rounded-xl overflow-hidden border border-primary">
                <img src={img.preview} alt="" className="w-full h-full object-cover" />
                <button onClick={() => removeNewImage(idx)} className="absolute top-1 right-1 w-5 h-5 bg-destructive rounded-full flex items-center justify-center">
                  <X className="w-3 h-3 text-destructive-foreground" />
                </button>
              </div>
            ))}
            <button onClick={() => fileInputRef.current?.click()} className="shrink-0 w-24 h-24 rounded-xl border-2 border-dashed border-border flex flex-col items-center justify-center gap-1 hover:border-primary transition-colors">
              <ImagePlus className="w-5 h-5 text-muted-foreground" />
              <span className="text-[10px] text-muted-foreground">Add Photo</span>
            </button>
          </div>
          <div className="mt-3">
            <Label className="text-xs text-muted-foreground">Video URL</Label>
            <Input placeholder="https://youtube.com/..." value={videoUrl} onChange={e => setVideoUrl(e.target.value)} className="mt-1 h-10 rounded-xl text-sm" />
          </div>
        </Card>

        <Card className="p-4 space-y-4">
          <div><Label className="text-sm font-semibold">Product Name *</Label><Input value={name} onChange={e => setName(e.target.value)} className="mt-1 h-11 rounded-xl" /></div>
          <div><Label className="text-sm font-semibold">Description</Label><Textarea value={description} onChange={e => setDescription(e.target.value)} className="mt-1 rounded-xl min-h-[100px]" /></div>
          <div>
            <Label className="text-sm font-semibold">Category *</Label>
            <Select value={category} onValueChange={setCategory}>
              <SelectTrigger className="mt-1 h-11 rounded-xl"><SelectValue /></SelectTrigger>
              <SelectContent>{CATEGORIES.map(c => <SelectItem key={c.id} value={c.id}>{c.name}</SelectItem>)}</SelectContent>
            </Select>
          </div>
        </Card>

        <Card className="p-4 space-y-4">
          <div className="flex gap-3">
            <div className="flex-1"><Label className="text-sm font-semibold">Price *</Label><Input type="number" value={price} onChange={e => setPrice(e.target.value)} className="mt-1 h-11 rounded-xl" /></div>
            <div className="w-36">
              <Label className="text-sm font-semibold">Unit</Label>
              <Select value={unit} onValueChange={setUnit}><SelectTrigger className="mt-1 h-11 rounded-xl"><SelectValue /></SelectTrigger><SelectContent>{UNIT_OPTIONS.map(u => <SelectItem key={u} value={u}>{u}</SelectItem>)}</SelectContent></Select>
            </div>
          </div>
          <div><Label className="text-sm font-semibold">Stock</Label><Input type="number" value={stock} onChange={e => setStock(e.target.value)} className="mt-1 h-11 rounded-xl" /></div>
        </Card>

        <Card className="p-4">
          <div className="flex items-center gap-2 mb-2"><Tag className="w-4 h-4 text-primary" /><Label className="text-sm font-semibold">Special Offer</Label></div>
          <Textarea value={offer} onChange={e => setOffer(e.target.value)} className="rounded-xl" />
        </Card>

        <Card className="p-4">
          <Label className="text-sm font-semibold mb-3 block">Sizes</Label>
          <div className="flex flex-wrap gap-2">
            {SIZES.map(size => (
              <button key={size} onClick={() => toggleSize(size)} className={`px-4 py-2 rounded-lg text-sm font-medium border transition-colors ${selectedSizes.includes(size) ? "border-primary bg-primary/10 text-primary" : "border-border text-muted-foreground"}`}>{size}</button>
            ))}
          </div>
        </Card>

        <Card className="p-4"><Label className="text-sm font-semibold">Colors</Label><Input value={colors} onChange={e => setColors(e.target.value)} className="mt-1 h-11 rounded-xl" placeholder="Red, Blue, Green" /></Card>
        <Card className="p-4"><Label className="text-sm font-semibold">Additional Info</Label><Textarea value={customInfo} onChange={e => setCustomInfo(e.target.value)} className="mt-1 rounded-xl" /></Card>
      </div>

      <div className="fixed bottom-0 left-0 right-0 p-4 bg-card border-t border-border md:static md:mt-6 md:p-0 md:border-0 md:bg-transparent">
        <Button onClick={handleSave} disabled={loading} className="w-full h-12 rounded-xl text-base font-semibold">
          {loading ? <><Loader2 className="w-4 h-4 mr-2 animate-spin" /> Saving...</> : "Save Changes"}
        </Button>
      </div>
    </div>
  );
};

export default EditProduct;
