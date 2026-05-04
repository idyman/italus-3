import { useRef, useState } from "react";
import { Upload, X, Image as ImageIcon, Link } from "lucide-react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { ImageWithFallback } from "./figma/ImageWithFallback";
import { toast } from "sonner";
import { uploadFile } from "../../lib/uploadFile";

interface HeroImageManagerProps {
  imageUrl: string | undefined;
  onChange: (url: string | undefined) => void;
}

export function HeroImageManager({ imageUrl, onChange }: HeroImageManagerProps) {
  const [showUrlInput, setShowUrlInput] = useState(!imageUrl); // Show input by default if no image
  const [urlInput, setUrlInput] = useState("");
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelected = async (file: File | null | undefined) => {
    if (!file) return;
    setIsUploading(true);
    try {
      const url = await uploadFile(file, {
        folder: "hero",
        maxSizeBytes: 10 * 1024 * 1024,
        allowedMimePrefix: "image/",
      });
      onChange(url);
      toast.success("Hero image uploaded");
    } catch (error: any) {
      toast.error(`Upload failed: ${error.message || "Unknown error"}`);
    } finally {
      setIsUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  };

  const handleUrlSubmit = () => {
    if (!urlInput.trim()) {
      toast.error('Please enter a valid URL');
      return;
    }

    // Basic URL validation
    try {
      new URL(urlInput);
      console.log('✅ Hero image URL updated:', urlInput);
      onChange(urlInput);
      setUrlInput("");
      setShowUrlInput(false);
      toast.success('Hero image URL added successfully!');
    } catch (error) {
      toast.error('Please enter a valid URL');
    }
  };

  const handleRemove = () => {
    onChange(undefined);
    toast.success('Hero image removed');
  };

  return (
    <div className="space-y-3">
      {/* Current Image Preview */}
      {imageUrl && (
        <div className="relative border border-gray-300 rounded-lg overflow-hidden bg-gray-50">
          <ImageWithFallback
            src={imageUrl}
            alt="Hero background"
            className="w-full h-64 object-cover"
          />
          <Button
            type="button"
            variant="destructive"
            size="sm"
            onClick={handleRemove}
            className="absolute top-2 right-2 gap-1"
          >
            <X className="w-4 h-4" />
            Remove
          </Button>
        </div>
      )}

      {/* Upload from computer */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={(e) => handleFileSelected(e.target.files?.[0])}
      />
      <Button
        type="button"
        onClick={() => fileInputRef.current?.click()}
        disabled={isUploading}
        className="w-full gap-2"
      >
        <Upload className="w-4 h-4" />
        {isUploading ? "Uploading…" : imageUrl ? "Replace with a file" : "Upload an image"}
      </Button>

      {/* URL Input Section */}
      {showUrlInput && (
        <div className="space-y-2 p-3 border border-gray-300 rounded-lg bg-gray-50">
          <Input
            type="url"
            placeholder="https://example.com/image.jpg"
            value={urlInput}
            onChange={(e) => setUrlInput(e.target.value)}
            className="text-sm"
          />
          <div className="flex gap-2">
            <Button
              type="button"
              onClick={handleUrlSubmit}
              className="flex-1"
              size="sm"
            >
              Use URL
            </Button>
            <Button
              type="button"
              onClick={() => {
                setShowUrlInput(false);
                setUrlInput("");
              }}
              variant="outline"
              size="sm"
            >
              Cancel
            </Button>
          </div>
        </div>
      )}

      {/* Action Button */}
      {!showUrlInput && (
        <button
          type="button"
          onClick={() => setShowUrlInput(true)}
          className="w-full inline-flex items-center justify-center gap-2 px-4 py-2.5 border border-gray-300 hover:border-black transition-colors text-center"
          style={{
            fontFamily: "-apple-system, BlinkMacSystemFont, 'SF Pro Text', system-ui, sans-serif",
            fontSize: '14px',
            letterSpacing: '-0.01em'
          }}
        >
          <Link className="w-4 h-4" />
          Or paste an image URL
        </button>
      )}

      <p className="text-xs text-gray-500">
        Enter the URL of your hero background image. You can use Unsplash, Imgur, or any publicly accessible image URL.
      </p>
      
      {showUrlInput && (
        <div className="text-xs text-gray-600 bg-blue-50 border border-blue-200 rounded p-2">
          <div className="font-semibold mb-1">💡 Example URLs:</div>
          <div className="space-y-1 font-mono text-[11px]">
            <div>https://images.unsplash.com/photo-...</div>
            <div>https://i.imgur.com/example.jpg</div>
          </div>
        </div>
      )}
    </div>
  );
}