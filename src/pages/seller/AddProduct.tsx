import { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
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
import { createProduct, uploadProductImage } from "@/hooks/useProducts";

const SIZES = ["XS", "S", "M", "L", "XL", "XXL", "XXXL"];
const UNIT_OPTIONS = ["Per Piece", "Per Kg", "Per Dozen", "Per Liter", "Per Meter", "Per Box", "Per Pack"];

const AddProduct = () => {
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
  const [images, setImages] = useState<{ file: File; preview: string }[]>([]);
  const [videoUrl, setVideoUrl] = useState("");
  const [colors, setColors] = useState("");
  const [stock, setStock] = useState("");
  const [loading, setLoading] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);

  const handleImageSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (files.length === 0) return;
    const newImages = files.map(file => ({
      file,
      preview: URL.createObjectURL(file),
    }));
    setImages(prev => [...prev, ...newImages]);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const removeImage = (idx: number) => {
    setImages(prev => {
      URL.revokeObjectURL(prev[idx].preview);
      return prev.filter((_, i) => i !== idx);
    });
  };

  const toggleSize = (size: string) => {
    setSelectedSizes(prev =>
      prev.includes(size) ? prev.filter(s => s !== size) : [...prev, size]
    );
  };

  const handlePublish = async () => {
    if (!user) { toast.error("Please log in"); return; }
    if (!name.trim()) { toast.error("Product name is required"); return; }
    if (!price) { toast.error("Price is required"); return; }
    if (!category) { toast.error("Please select a category"); return; }

    setLoading(true);
    try {
      // Upload images first
      const imageUrls: string[] = [];
      for (const img of images) {
        const { url, error } = await uploadProductImage(user.id, img.file);
        if (url) imageUrls.push(url);
        if (error) console.error("Image upload error:", error);
      }

      const colorsArr = colors.split(",").map(c => c.trim()).filter(Boolean);

      const { error } = await createProduct(user.id, {
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
        is_published: true,
      }, imageUrls);

      if (error) {
        toast.error("Failed to publish product");
        return;
      }

      toast.success("Product published successfully!");
      navigate("/seller/products");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-4 md:p-6 max-w-2xl mx-auto animate-fade-in pb-24">
      <div className="flex items-center gap-3 mb-6">
        <button onClick={() => navigate(-1)} className="p-2 rounded-lg hover:bg-secondary">
          <ArrowLeft className="w-5 h-5" />
        </button>
        <div>
          <h1 className="text-xl font-heading font-bold">Add New Product</h1>
          <p className="text-xs text-muted-foreground">Fill in all details about your product</p>
        </div>
      </div>

      <div className="space-y-6">
        {/* Images */}
        <Card className="p-4">
          <Label className="text-sm font-semibold mb-3 block">Product Images & Video</Label>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            multiple
            className="hidden"
            onChange={handleImageSelect}
          />
          <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide">
            {images.map((img, idx) => (
              <div key={idx} className="relative shrink-0 w-24 h-24 rounded-xl overflow-hidden border border-border">
                <img src={img.preview} alt="" className="w-full h-full object-cover" />
                <button onClick={() => removeImage(idx)} className="absolute top-1 right-1 w-5 h-5 bg-destructive rounded-full flex items-center justify-center">
                  <X className="w-3 h-3 text-destructive-foreground" />
                </button>
              </div>
            ))}
            <button
              onClick={() => fileInputRef.current?.click()}
              className="shrink-0 w-24 h-24 rounded-xl border-2 border-dashed border-border flex flex-col items-center justify-center gap-1 hover:border-primary transition-colors"
            >
              <ImagePlus className="w-5 h-5 text-muted-foreground" />
              <span className="text-[10px] text-muted-foreground">Add Photo</span>
            </button>
          </div>
          <div className="mt-3">
            <Label className="text-xs text-muted-foreground">Video URL (optional)</Label>
            <Input placeholder="https://youtube.com/..." value={videoUrl} onChange={e => setVideoUrl(e.target.value)} className="mt-1 h-10 rounded-xl text-sm" />
          </div>
        </Card>

        {/* Basic Info */}
        <Card className="p-4 space-y-4">
          <div>
            <Label className="text-sm font-semibold">Product Name *</Label>
            <Input placeholder="e.g. Fresh Organic Potatoes" value={name} onChange={e => setName(e.target.value)} className="mt-1 h-11 rounded-xl" />
          </div>
          <div>
            <Label className="text-sm font-semibold">Description</Label>
            <Textarea placeholder="Describe your product in detail..." value={description} onChange={e => setDescription(e.target.value)} className="mt-1 rounded-xl min-h-[100px]" />
          </div>
          <div>
            <Label className="text-sm font-semibold">Category *</Label>
            <Select value={category} onValueChange={setCategory}>
              <SelectTrigger className="mt-1 h-11 rounded-xl"><SelectValue placeholder="Select category" /></SelectTrigger>
              <SelectContent>
                {CATEGORIES.map(cat => (
                  <SelectItem key={cat.id} value={cat.id}>{cat.name}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </Card>

        {/* Pricing */}
        <Card className="p-4 space-y-4">
          <div className="flex gap-3">
            <div className="flex-1">
              <Label className="text-sm font-semibold">Price *</Label>
              <Input type="number" placeholder="0.00" value={price} onChange={e => setPrice(e.target.value)} className="mt-1 h-11 rounded-xl" />
            </div>
            <div className="w-36">
              <Label className="text-sm font-semibold">Unit</Label>
              <Select value={unit} onValueChange={setUnit}>
                <SelectTrigger className="mt-1 h-11 rounded-xl"><SelectValue /></SelectTrigger>
                <SelectContent>
                  {UNIT_OPTIONS.map(u => (<SelectItem key={u} value={u}>{u}</SelectItem>))}
                </SelectContent>
              </Select>
            </div>
          </div>
          <div>
            <Label className="text-sm font-semibold">Stock Quantity</Label>
            <Input type="number" placeholder="e.g. 100" value={stock} onChange={e => setStock(e.target.value)} className="mt-1 h-11 rounded-xl" />
          </div>
        </Card>

        {/* Offer */}
        <Card className="p-4">
          <div className="flex items-center gap-2 mb-2">
            <Tag className="w-4 h-4 text-primary" />
            <Label className="text-sm font-semibold">Special Offer (optional)</Label>
          </div>
          <Textarea placeholder="e.g. Buy 2 Get 1 Free, 20% off on first order..." value={offer} onChange={e => setOffer(e.target.value)} className="rounded-xl" />
        </Card>

        {/* Sizes */}
        <Card className="p-4">
          <Label className="text-sm font-semibold mb-3 block">Sizes (if applicable)</Label>
          <div className="flex flex-wrap gap-2">
            {SIZES.map(size => (
              <button key={size} onClick={() => toggleSize(size)} className={`px-4 py-2 rounded-lg text-sm font-medium border transition-colors ${selectedSizes.includes(size) ? "border-primary bg-primary/10 text-primary" : "border-border text-muted-foreground hover:border-foreground"}`}>
                {size}
              </button>
            ))}
          </div>
        </Card>

        {/* Colors */}
        <Card className="p-4">
          <Label className="text-sm font-semibold">Available Colors</Label>
          <Input placeholder="e.g. Red, Blue, Green (comma separated)" value={colors} onChange={e => setColors(e.target.value)} className="mt-1 h-11 rounded-xl" />
        </Card>

        {/* Custom Info */}
        <Card className="p-4">
          <Label className="text-sm font-semibold">Additional Information</Label>
          <Textarea placeholder="Any extra details customers should know..." value={customInfo} onChange={e => setCustomInfo(e.target.value)} className="mt-1 rounded-xl" />
        </Card>
      </div>

      {/* Publish Button */}
      <div className="fixed bottom-0 left-0 right-0 p-4 bg-card border-t border-border md:static md:mt-6 md:p-0 md:border-0 md:bg-transparent">
        <Button onClick={handlePublish} disabled={loading} className="w-full h-12 rounded-xl text-base font-semibold">
          {loading ? <><Loader2 className="w-4 h-4 mr-2 animate-spin" /> Publishing...</> : "Publish Product"}
        </Button>
      </div>
    </div>
  );
};

export default AddProduct;
