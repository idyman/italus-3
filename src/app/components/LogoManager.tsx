import { useState } from "react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Plus, X, Image as ImageIcon, AlertCircle, Check } from "lucide-react";
import type { ProjectImage } from "../App";

interface LogoManagerProps {
  logos: ProjectImage[];
  onChange: (logos: ProjectImage[]) => void;
}

// Helper function to convert Imgur URLs to direct image links
function normalizeImageUrl(url: string): string {
  const trimmed = url.trim();
  
  // If empty, return as-is
  if (!trimmed) return trimmed;
  
  console.log('🔄 [LogoManager] Normalizing URL:', trimmed);
  
  // If it's already a direct image link, return it
  if (/\.(jpg|jpeg|png|gif|webp|svg)$/i.test(trimmed)) {
    console.log('✅ [LogoManager] Already has image extension:', trimmed);
    return trimmed;
  }
  
  // Handle imgur.com/xyz format (no file extension)
  const imgurMatch = trimmed.match(/imgur\.com\/([a-zA-Z0-9]+)$/);
  if (imgurMatch) {
    const normalized = `https://i.imgur.com/${imgurMatch[1]}.png`;
    console.log('✅ [LogoManager] Normalized imgur.com URL:', normalized);
    return normalized;
  }
  
  // Handle i.imgur.com/xyz format (no file extension)
  const iImgurMatch = trimmed.match(/i\.imgur\.com\/([a-zA-Z0-9]+)$/);
  if (iImgurMatch) {
    const normalized = `https://i.imgur.com/${iImgurMatch[1]}.png`;
    console.log('✅ [LogoManager] Normalized i.imgur.com URL:', normalized);
    return normalized;
  }
  
  // Handle URLs without protocol
  if (!trimmed.startsWith('http://') && !trimmed.startsWith('https://')) {
    const withProtocol = 'https://' + trimmed;
    console.log('⚠️ [LogoManager] Added https:// protocol:', withProtocol);
    return normalizeImageUrl(withProtocol); // Recursively normalize
  }
  
  console.log('⚠️ [LogoManager] URL unchanged:', trimmed);
  return trimmed;
}

export function LogoManager({ logos, onChange }: LogoManagerProps) {
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [imageLoadStatus, setImageLoadStatus] = useState<Record<number, 'loading' | 'success' | 'error'>>({});

  const handleImageLoad = (index: number) => {
    setImageLoadStatus(prev => ({ ...prev, [index]: 'success' }));
  };

  const handleImageError = (index: number) => {
    setImageLoadStatus(prev => ({ ...prev, [index]: 'error' }));
  };

  const addLogo = () => {
    onChange([...logos, { url: "", description: "" }]);
    setEditingIndex(logos.length);
    setImageLoadStatus(prev => ({ ...prev, [logos.length]: 'loading' }));
  };

  const updateLogo = (index: number, field: keyof ProjectImage, value: string) => {
    const normalizedValue = field === "url" ? normalizeImageUrl(value) : value;
    const newLogos = [...logos];
    newLogos[index] = { ...newLogos[index], [field]: normalizedValue };
    onChange(newLogos);
    if (field === "url") {
      setImageLoadStatus(prev => ({ ...prev, [index]: 'loading' }));
    }
  };

  const removeLogo = (index: number) => {
    onChange(logos.filter((_, i) => i !== index));
    if (editingIndex === index) {
      setEditingIndex(null);
    }
    const newStatus = { ...imageLoadStatus };
    delete newStatus[index];
    setImageLoadStatus(newStatus);
  };

  return (
    <div className="space-y-4">
      {logos.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {logos.map((logo, index) => (
            <div
              key={index}
              className="border border-gray-300 rounded-lg p-4 space-y-3 bg-white"
            >
              <div className="flex justify-between items-start">
                <span className="text-sm font-medium text-gray-700">
                  Logo {index + 1}
                </span>
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => removeLogo(index)}
                  className="h-6 w-6 p-0 text-red-600 hover:text-red-700 hover:bg-red-50"
                >
                  <X size={14} />
                </Button>
              </div>

              {logo.url && (
                <div className="relative rounded overflow-hidden bg-gray-50 p-4 flex items-center justify-center min-h-[120px]">
                  {(!imageLoadStatus[index] || imageLoadStatus[index] === 'loading') && (
                    <div className="absolute inset-0 flex items-center justify-center bg-gray-100 z-10">
                      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-black"></div>
                    </div>
                  )}
                  {imageLoadStatus[index] === 'error' && (
                    <div className="absolute inset-0 flex flex-col items-center justify-center bg-red-50 text-red-600 z-10">
                      <AlertCircle className="w-8 h-8 mb-1" />
                      <span className="text-xs font-medium">Load failed</span>
                    </div>
                  )}
                  {imageLoadStatus[index] === 'success' && (
                    <div className="absolute top-2 right-2 bg-green-500 rounded-full p-1 z-10">
                      <Check className="w-4 h-4 text-white" />
                    </div>
                  )}
                  <img
                    src={logo.url}
                    alt={logo.description || "Logo"}
                    className="max-w-full max-h-[100px] object-contain"
                    onLoad={() => handleImageLoad(index)}
                    onError={() => handleImageError(index)}
                  />
                </div>
              )}

              <div className="space-y-2">
                <div>
                  <Label className="text-xs">Logo URL</Label>
                  <Input
                    type="url"
                    value={logo.url}
                    onChange={(e) => updateLogo(index, "url", e.target.value)}
                    placeholder="https://i.imgur.com/xxxxx.png"
                    className="text-sm font-mono"
                  />
                  {imageLoadStatus[index] === 'error' && (
                    <p className="text-xs text-red-600 mt-1 flex items-center gap-1">
                      <AlertCircle className="w-3 h-3" />
                      Failed to load. Check URL is a direct image link.
                    </p>
                  )}
                </div>

                <div>
                  <Label className="text-xs">Description (optional)</Label>
                  <Input
                    value={logo.description}
                    onChange={(e) => updateLogo(index, "description", e.target.value)}
                    placeholder="Primary logo"
                    className="text-sm"
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {logos.length < 10 && (
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={addLogo}
          className="gap-2"
        >
          <Plus size={16} />
          Add Logo
        </Button>
      )}

      {logos.length === 0 && (
        <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
          <ImageIcon className="mx-auto h-12 w-12 text-gray-400 mb-3" />
          <p className="text-sm text-gray-500 mb-2">
            No logos added yet. Add logos to showcase different variations.
          </p>
          <p className="text-xs text-gray-500 mb-4">
            📌 Use Imgur, Cloudinary, or imgbb to host your logos. Paste the direct image URL.
          </p>
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={addLogo}
            className="gap-2"
          >
            <Plus size={16} />
            Add First Logo
          </Button>
        </div>
      )}

      <p className="text-xs text-gray-500">
        Add up to 10 logo variations. Use direct image links for best results.
      </p>
    </div>
  );
}