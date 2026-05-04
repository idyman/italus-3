import { useRef, useState } from "react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Textarea } from "./ui/textarea";
import { Plus, Trash2, AlertCircle, Check, Upload } from "lucide-react";
import type { ProjectImage } from "../App";
import { toast } from "sonner";
import { uploadFile } from "../../lib/uploadFile";

interface ProjectImageManagerProps {
  images: ProjectImage[];
  onChange: (images: ProjectImage[]) => void;
  maxImages?: number;
}

// Helper function to convert Imgur URLs to direct image links
function normalizeImageUrl(url: string): string {
  const trimmed = url.trim();
  
  // If empty, return as-is
  if (!trimmed) return trimmed;
  
  console.log('🔄 Normalizing URL:', trimmed);
  
  // If it's already a direct image link, return it
  if (/\.(jpg|jpeg|png|gif|webp|svg)$/i.test(trimmed)) {
    console.log('✅ Already has image extension:', trimmed);
    return trimmed;
  }
  
  // Handle imgur.com/xyz format (no file extension)
  const imgurMatch = trimmed.match(/imgur\.com\/([a-zA-Z0-9]+)$/);
  if (imgurMatch) {
    const normalized = `https://i.imgur.com/${imgurMatch[1]}.jpg`;
    console.log('✅ Normalized imgur.com URL:', normalized);
    return normalized;
  }
  
  // Handle i.imgur.com/xyz format (no file extension)
  const iImgurMatch = trimmed.match(/i\.imgur\.com\/([a-zA-Z0-9]+)$/);
  if (iImgurMatch) {
    const normalized = `https://i.imgur.com/${iImgurMatch[1]}.jpg`;
    console.log('✅ Normalized i.imgur.com URL:', normalized);
    return normalized;
  }
  
  // Handle URLs without protocol
  if (!trimmed.startsWith('http://') && !trimmed.startsWith('https://')) {
    const withProtocol = 'https://' + trimmed;
    console.log('⚠️ Added https:// protocol:', withProtocol);
    return normalizeImageUrl(withProtocol); // Recursively normalize
  }
  
  console.log('⚠️ URL unchanged:', trimmed);
  return trimmed;
}

export function ProjectImageManager({ images, onChange, maxImages = 10 }: ProjectImageManagerProps) {
  const [newImageUrl, setNewImageUrl] = useState("");
  const [newImageDescription, setNewImageDescription] = useState("");
  const [imageLoadStatus, setImageLoadStatus] = useState<Record<number, 'loading' | 'success' | 'error'>>({});
  const [previewLoadStatus, setPreviewLoadStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFilesSelected = async (files: FileList | null) => {
    if (!files || files.length === 0) return;

    const remaining = maxImages - images.length;
    const toUpload = Array.from(files).slice(0, remaining);
    if (toUpload.length < files.length) {
      toast.warning(`Only ${remaining} more image${remaining === 1 ? "" : "s"} allowed — extras skipped.`);
    }

    setIsUploading(true);
    try {
      const uploaded: ProjectImage[] = [];
      for (const file of toUpload) {
        try {
          const url = await uploadFile(file, {
            folder: "projects",
            maxSizeBytes: 10 * 1024 * 1024,
            allowedMimePrefix: "image/",
          });
          uploaded.push({ url, description: newImageDescription.trim() });
        } catch (error: any) {
          console.error("Upload failed:", error);
          toast.error(`Failed to upload ${file.name}: ${error.message || "Unknown error"}`);
        }
      }
      if (uploaded.length > 0) {
        onChange([...images, ...uploaded]);
        toast.success(`Uploaded ${uploaded.length} image${uploaded.length === 1 ? "" : "s"}`);
        setNewImageDescription("");
      }
    } finally {
      setIsUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  };

  const handleImageLoad = (index: number) => {
    setImageLoadStatus(prev => ({ ...prev, [index]: 'success' }));
  };

  const handleImageError = (index: number) => {
    setImageLoadStatus(prev => ({ ...prev, [index]: 'error' }));
  };

  const handlePreviewLoad = () => {
    setPreviewLoadStatus('success');
  };

  const handlePreviewError = () => {
    setPreviewLoadStatus('error');
  };

  const handleNewImageUrlChange = (url: string) => {
    setNewImageUrl(url);
    setPreviewLoadStatus('idle');
    // Trigger preview loading if URL looks valid
    if (url.trim()) {
      setPreviewLoadStatus('loading');
    }
  };

  const handleAddImage = () => {
    console.log('🎯 ADD IMAGE CLICKED:', {
      newImageUrl,
      trimmed: newImageUrl.trim(),
      currentImagesCount: images.length,
      maxImages,
      canAdd: newImageUrl.trim() && images.length < maxImages
    });
    
    if (newImageUrl.trim() && images.length < maxImages) {
      const normalizedUrl = normalizeImageUrl(newImageUrl);
      const newImage = { url: normalizedUrl, description: newImageDescription.trim() };
      
      console.log('✅ Creating new image:', newImage);
      
      const updatedImages = [...images, newImage];
      
      console.log('📤 Calling onChange with images:', {
        count: updatedImages.length,
        images: updatedImages
      });
      
      onChange(updatedImages);
      
      // Show success message
      toast.success(`Image ${updatedImages.length} added successfully!`);
      
      // Reset form
      setNewImageUrl("");
      setNewImageDescription("");
      setPreviewLoadStatus('idle');
    } else {
      console.warn('❌ Cannot add image:', {
        hasUrl: !!newImageUrl.trim(),
        currentCount: images.length,
        maxImages,
        atLimit: images.length >= maxImages
      });
      toast.error("Cannot add image. Check the URL and ensure you haven't reached the maximum number of images.");
    }
  };

  const handleRemoveImage = (index: number) => {
    onChange(images.filter((_, i) => i !== index));
    // Clean up load status
    const newStatus = { ...imageLoadStatus };
    delete newStatus[index];
    setImageLoadStatus(newStatus);
  };

  const handleUpdateDescription = (index: number, description: string) => {
    const updated = images.map((img, i) => 
      i === index ? { ...img, description } : img
    );
    onChange(updated);
  };

  const handleUpdateUrl = (index: number, url: string) => {
    const normalizedUrl = normalizeImageUrl(url);
    const updated = images.map((img, i) => 
      i === index ? { ...img, url: normalizedUrl } : img
    );
    onChange(updated);
    // Reset load status when URL changes
    setImageLoadStatus(prev => ({ ...prev, [index]: 'loading' }));
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <Label>Project Images ({images.length}/{maxImages})</Label>
        <span className="text-xs text-gray-500">Add up to {maxImages} images</span>
      </div>

      {/* Existing Images */}
      {images.length > 0 && (
        <div className="space-y-3">
          {images.map((image, index) => (
            <div key={index} className="border border-gray-200 rounded-lg p-4 bg-gray-50 overflow-hidden">
              {/* HD Image Display (1920x1080) */}
              <div className="mb-4">
                <div className="w-full bg-white rounded overflow-hidden border-2 border-gray-300 relative" 
                     style={{ 
                       maxWidth: '1920px', 
                       aspectRatio: '16/9',
                       margin: '0 auto'
                     }}>
                  {(!imageLoadStatus[index] || imageLoadStatus[index] === 'loading') && (
                    <div className="absolute inset-0 flex items-center justify-center bg-gray-100 z-10">
                      <div className="flex flex-col items-center gap-2">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-black"></div>
                        <span className="text-sm text-gray-600">Loading HD image...</span>
                      </div>
                    </div>
                  )}
                  {imageLoadStatus[index] === 'error' && (
                    <div className="absolute inset-0 flex flex-col items-center justify-center bg-red-50 text-red-600 z-10">
                      <AlertCircle className="w-12 h-12 mb-2" />
                      <span className="text-base font-medium">Failed to load</span>
                      <span className="text-sm">Check the URL below</span>
                    </div>
                  )}
                  {imageLoadStatus[index] === 'success' && (
                    <div className="absolute top-3 right-3 bg-green-500 rounded-full p-1.5 z-10 shadow-lg">
                      <Check className="w-5 h-5 text-white" />
                    </div>
                  )}
                  <img
                    src={image.url}
                    alt={`Preview ${index + 1}`}
                    className="w-full h-full object-cover"
                    onLoad={() => handleImageLoad(index)}
                    onError={() => handleImageError(index)}
                  />
                </div>
                <p className="text-sm text-gray-600 mt-2 text-center font-medium">
                  Image {index + 1} - HD Display (1920x1080)
                </p>
              </div>
              
              {/* Image Controls */}
              <div className="flex gap-3">
                <div className="flex-1 space-y-2 min-w-0 overflow-hidden">
                  <div>
                    <Label className="text-xs">Image URL</Label>
                    <Input
                      value={image.url}
                      onChange={(e) => handleUpdateUrl(index, e.target.value)}
                      className="text-xs font-mono"
                      placeholder="https://i.imgur.com/xxxxx.jpg"
                    />
                    {imageLoadStatus[index] === 'error' && (
                      <p className="text-xs text-red-600 mt-1 flex items-center gap-1">
                        <AlertCircle className="w-3 h-3" />
                        Image failed to load. Check the URL is a direct image link.
                      </p>
                    )}
                  </div>
                  <div>
                    <Label className="text-xs" htmlFor={`desc-${index}`}>Description</Label>
                    <Textarea
                      id={`desc-${index}`}
                      value={image.description}
                      onChange={(e) => handleUpdateDescription(index, e.target.value)}
                      placeholder="Describe this image..."
                      rows={2}
                      className="text-sm resize-none"
                    />
                  </div>
                </div>
                <div className="flex-shrink-0">
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => handleRemoveImage(index)}
                    className="text-red-600 hover:text-red-700 hover:bg-red-50"
                  >
                    <Trash2 size={16} />
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Add New Image */}
      {images.length < maxImages && (
        <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 bg-white">
          <div className="space-y-4">
            {/* Upload from computer */}
            <div>
              <Label className="mb-2 block">Upload from your computer</Label>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                multiple
                className="hidden"
                onChange={(e) => handleFilesSelected(e.target.files)}
              />
              <Button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                disabled={isUploading}
                className="gap-2 w-full"
              >
                <Upload size={16} />
                {isUploading ? "Uploading…" : "Choose image files"}
              </Button>
              <p className="text-xs text-gray-500 mt-2">
                JPG, PNG, GIF, WebP, or SVG · up to 10&nbsp;MB each · multiple files allowed
              </p>
            </div>

            <div className="relative flex items-center gap-3 text-xs uppercase tracking-wide text-gray-400">
              <span className="h-px flex-1 bg-gray-200" />
              or paste a URL
              <span className="h-px flex-1 bg-gray-200" />
            </div>

            {/* Live Preview */}
            {newImageUrl.trim() && (
              <div className="mb-4">
                <Label className="text-xs mb-2 block">Preview</Label>
                <div className="w-full h-48 bg-gray-100 rounded overflow-hidden border-2 border-gray-300 relative">
                  {previewLoadStatus === 'loading' && (
                    <div className="absolute inset-0 flex items-center justify-center bg-gray-100 z-10">
                      <div className="flex flex-col items-center gap-2">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-black"></div>
                        <span className="text-xs text-gray-600">Loading preview...</span>
                      </div>
                    </div>
                  )}
                  {previewLoadStatus === 'error' && (
                    <div className="absolute inset-0 flex flex-col items-center justify-center bg-red-50 text-red-600 z-10">
                      <AlertCircle className="w-8 h-8 mb-2" />
                      <span className="text-sm font-medium">Failed to load</span>
                      <span className="text-xs">Check the URL below</span>
                    </div>
                  )}
                  {previewLoadStatus === 'success' && (
                    <div className="absolute top-2 right-2 bg-green-500 rounded-full p-1 z-10">
                      <Check className="w-4 h-4 text-white" />
                    </div>
                  )}
                  <img
                    src={normalizeImageUrl(newImageUrl)}
                    alt="Preview"
                    className="w-full h-full object-contain"
                    onLoad={handlePreviewLoad}
                    onError={handlePreviewError}
                  />
                </div>
              </div>
            )}

            <div>
              <Label htmlFor="new-image-url">Image URL</Label>
              <Input
                id="new-image-url"
                value={newImageUrl}
                onChange={(e) => handleNewImageUrlChange(e.target.value)}
                placeholder="https://i.imgur.com/xxxxx.jpg or imgur.com/xxxxx"
                onKeyPress={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault();
                    handleAddImage();
                  }
                }}
              />
              <p className="text-xs text-gray-500 mt-1">
                📌 <strong>Tip:</strong> Use image hosting services like Imgur, Cloudinary, or imgbb. 
                Paste the direct image URL here.
              </p>
            </div>
            <div>
              <Label htmlFor="new-image-description">Description (optional)</Label>
              <Input
                id="new-image-description"
                value={newImageDescription}
                onChange={(e) => setNewImageDescription(e.target.value)}
                placeholder="Describe this image..."
                onKeyPress={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault();
                    handleAddImage();
                  }
                }}
              />
            </div>
            <Button
              type="button"
              onClick={handleAddImage}
              disabled={!newImageUrl.trim()}
              variant="outline"
              className="gap-2 w-full"
            >
              <Plus size={16} />
              Add Image
            </Button>
          </div>
        </div>
      )}

      {images.length === 0 && (
        <div className="text-center py-8 text-gray-400 text-sm">
          No images yet. Add at least one image to your project.
        </div>
      )}
    </div>
  );
}