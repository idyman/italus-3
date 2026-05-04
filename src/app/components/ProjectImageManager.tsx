import { useRef, useState } from "react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Textarea } from "./ui/textarea";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "./ui/collapsible";
import { Trash2, Upload, Link2, Loader2, ChevronDown, Plus } from "lucide-react";
import type { ProjectImage } from "../App";
import { toast } from "sonner";
import { uploadFile, deleteFileByUrl } from "../../lib/uploadFile";
import { FirebaseImageUploader } from "./admin/FirebaseImageUploader";

interface ProjectImageManagerProps {
  images: ProjectImage[];
  onChange: (images: ProjectImage[]) => void;
  maxImages?: number;
}

export function ProjectImageManager({ images, onChange, maxImages = 10 }: ProjectImageManagerProps) {
  const [isUploading, setIsUploading] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [showUrlField, setShowUrlField] = useState(false);
  const [pasteUrl, setPasteUrl] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  const remaining = maxImages - images.length;
  const canAddMore = remaining > 0;

  const handleFilesSelected = async (files: FileList | null) => {
    if (!files || files.length === 0) return;

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
          uploaded.push({ url, description: "" });
        } catch (error) {
          const message = error instanceof Error ? error.message : "Unknown error";
          toast.error(`Failed to upload ${file.name}: ${message}`);
        }
      }
      if (uploaded.length > 0) {
        onChange([...images, ...uploaded]);
        toast.success(`Uploaded ${uploaded.length} image${uploaded.length === 1 ? "" : "s"}`);
      }
    } finally {
      setIsUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
    if (!canAddMore || isUploading) return;
    handleFilesSelected(e.dataTransfer.files);
  };

  const handleAddFromUrl = () => {
    const trimmed = pasteUrl.trim();
    if (!trimmed || !canAddMore) return;
    onChange([...images, { url: trimmed, description: "" }]);
    setPasteUrl("");
    toast.success("Image added");
  };

  const handleRemoveImage = async (index: number) => {
    const removed = images[index];
    onChange(images.filter((_, i) => i !== index));
    if (removed?.url) {
      try {
        await deleteFileByUrl(removed.url);
      } catch (err) {
        const message = err instanceof Error ? err.message : "Storage cleanup failed";
        toast.warning(`Image removed from project, but Storage cleanup failed: ${message}`);
      }
    }
  };

  const handleUpdateDescription = (index: number, description: string) => {
    onChange(images.map((img, i) => (i === index ? { ...img, description } : img)));
  };

  const handleUpdateUrl = (index: number, url: string) => {
    onChange(images.map((img, i) => (i === index ? { ...img, url } : img)));
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
            <div key={index} className="border border-gray-200 rounded-lg p-4 bg-gray-50 space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm font-semibold text-gray-700">Image {index + 1}</span>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => handleRemoveImage(index)}
                  className="text-red-600 hover:text-red-700 hover:bg-red-50 gap-1"
                >
                  <Trash2 size={14} />
                  Remove
                </Button>
              </div>

              <FirebaseImageUploader
                value={image.url}
                onChange={(url) => handleUpdateUrl(index, url)}
                folder="projects"
                previewClassName="w-full aspect-video"
                previewObjectFit="cover"
                previewAlt={`Project image ${index + 1}`}
              />

              <div>
                <Label className="text-xs" htmlFor={`desc-${index}`}>
                  Description
                </Label>
                <Textarea
                  id={`desc-${index}`}
                  value={image.description}
                  onChange={(e) => handleUpdateDescription(index, e.target.value)}
                  placeholder="Describe this image..."
                  rows={2}
                  className="text-sm resize-none mt-1"
                />
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Add New Image — primary uploader */}
      {canAddMore && (
        <div className="space-y-3">
          <div
            onDragOver={(e) => {
              e.preventDefault();
              if (!isUploading) setIsDragging(true);
            }}
            onDragLeave={() => setIsDragging(false)}
            onDrop={handleDrop}
            onClick={() => {
              if (!isUploading) fileInputRef.current?.click();
            }}
            role="button"
            tabIndex={0}
            onKeyDown={(e) => {
              if ((e.key === "Enter" || e.key === " ") && !isUploading) {
                e.preventDefault();
                fileInputRef.current?.click();
              }
            }}
            className={`flex flex-col items-center justify-center gap-3 rounded-lg border-2 border-dashed px-4 py-10 text-center cursor-pointer transition-colors ${
              isDragging
                ? "border-black bg-gray-50"
                : "border-gray-300 hover:border-gray-400 hover:bg-gray-50"
            } ${isUploading ? "opacity-60 cursor-not-allowed" : ""}`}
          >
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              multiple
              className="hidden"
              onChange={(e) => handleFilesSelected(e.target.files)}
              disabled={isUploading}
            />
            {isUploading ? (
              <>
                <Loader2 className="w-7 h-7 text-gray-500 animate-spin" />
                <span className="text-sm font-medium text-gray-700">Uploading…</span>
              </>
            ) : (
              <>
                <Upload className="w-7 h-7 text-gray-500" />
                <div>
                  <span className="text-base font-medium text-gray-800">
                    Drop images here, or <span className="underline">browse</span>
                  </span>
                  <p className="text-xs text-gray-500 mt-1">
                    JPG, PNG, GIF, WebP, or SVG · up to 10&nbsp;MB each · multiple files allowed · {remaining} slot{remaining === 1 ? "" : "s"} left
                  </p>
                </div>
              </>
            )}
          </div>

          <Collapsible open={showUrlField} onOpenChange={setShowUrlField}>
            <CollapsibleTrigger asChild>
              <button
                type="button"
                className="flex items-center gap-1.5 text-xs text-gray-500 hover:text-gray-700 transition-colors"
              >
                <Link2 className="w-3 h-3" />
                {showUrlField ? "Hide URL field" : "Use URL instead"}
                <ChevronDown className={`w-3 h-3 transition-transform ${showUrlField ? "rotate-180" : ""}`} />
              </button>
            </CollapsibleTrigger>
            <CollapsibleContent className="pt-2 space-y-2">
              <div className="flex gap-2">
                <Input
                  type="url"
                  value={pasteUrl}
                  onChange={(e) => setPasteUrl(e.target.value)}
                  placeholder="https://i.imgur.com/xxxxx.jpg"
                  className="text-sm font-mono"
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      e.preventDefault();
                      handleAddFromUrl();
                    }
                  }}
                />
                <Button
                  type="button"
                  variant="outline"
                  onClick={handleAddFromUrl}
                  disabled={!pasteUrl.trim()}
                  className="gap-1 flex-shrink-0"
                >
                  <Plus size={14} />
                  Add
                </Button>
              </div>
              <p className="text-xs text-gray-500">
                Paste a direct image URL (Imgur, Cloudinary, or any public image link).
              </p>
            </CollapsibleContent>
          </Collapsible>
        </div>
      )}

      {images.length === 0 && (
        <p className="text-center py-2 text-gray-400 text-xs">
          No images yet. Drop or browse to add at least one.
        </p>
      )}
    </div>
  );
}
