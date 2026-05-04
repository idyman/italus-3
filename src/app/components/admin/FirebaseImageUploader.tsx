import { useRef, useState } from "react";
import { Upload, Trash2, Link2, AlertCircle, Loader2, ChevronDown } from "lucide-react";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "../ui/collapsible";
import { uploadFile, deleteFileByUrl } from "../../../lib/uploadFile";
import { toast } from "sonner";

export interface FirebaseImageUploaderProps {
  value: string;
  onChange: (url: string) => void;
  folder: string;
  label?: string;
  helperText?: string;
  maxSizeBytes?: number;
  previewClassName?: string;
  previewObjectFit?: "cover" | "contain";
  previewAlt?: string;
  disabled?: boolean;
}

export function FirebaseImageUploader({
  value,
  onChange,
  folder,
  label,
  helperText,
  maxSizeBytes = 10 * 1024 * 1024,
  previewClassName,
  previewObjectFit = "cover",
  previewAlt = "Uploaded image",
  disabled = false,
}: FirebaseImageUploaderProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [previewError, setPreviewError] = useState(false);
  const [showUrlField, setShowUrlField] = useState(false);

  const acceptUpload = async (file: File) => {
    if (!file.type.startsWith("image/")) {
      toast.error("Please drop an image file (JPG, PNG, GIF, WebP, or SVG)");
      return;
    }
    setIsUploading(true);
    try {
      const url = await uploadFile(file, {
        folder,
        maxSizeBytes,
        allowedMimePrefix: "image/",
      });
      onChange(url);
      setPreviewError(false);
      toast.success("Image uploaded");
    } catch (err) {
      const message = err instanceof Error ? err.message : "Upload failed";
      toast.error(message);
    } finally {
      setIsUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  };

  const handleFileChange = (files: FileList | null) => {
    if (!files || files.length === 0) return;
    void acceptUpload(files[0]);
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
    if (disabled || isUploading) return;
    handleFileChange(e.dataTransfer.files);
  };

  const handleRemove = async () => {
    const urlToDelete = value;
    // Clear UI state immediately so the user sees instant feedback even if
    // the Storage delete is slow or the URL is external (no-op).
    onChange("");
    setPreviewError(false);
    setShowUrlField(false);

    if (!urlToDelete) return;
    setIsDeleting(true);
    try {
      await deleteFileByUrl(urlToDelete);
    } catch (err) {
      const message = err instanceof Error ? err.message : "Failed to delete file from Storage";
      // The URL is already cleared from the form; warn but don't block.
      // Common causes: Storage rules denying delete, or file already gone.
      toast.warning(`Image cleared, but Storage cleanup failed: ${message}`);
    } finally {
      setIsDeleting(false);
    }
  };

  const previewSizing =
    previewClassName ?? "w-full aspect-video";

  if (value) {
    return (
      <div className="space-y-2">
        {label && <Label className="text-xs">{label}</Label>}
        <div className={`relative rounded-lg overflow-hidden border-2 border-gray-200 bg-gray-50 ${previewSizing}`}>
          {previewError ? (
            <div className="absolute inset-0 flex flex-col items-center justify-center text-red-600 bg-red-50 p-4 text-center">
              <AlertCircle className="w-8 h-8 mb-2" />
              <span className="text-sm font-medium">Preview failed to load</span>
              <span className="text-xs text-red-500 mt-1 break-all">{value}</span>
            </div>
          ) : (
            <img
              src={value}
              alt={previewAlt}
              className={`w-full h-full object-${previewObjectFit}`}
              onError={() => setPreviewError(true)}
              onLoad={() => setPreviewError(false)}
            />
          )}
          <Button
            type="button"
            variant="destructive"
            size="sm"
            onClick={handleRemove}
            disabled={disabled || isUploading || isDeleting}
            className="absolute top-2 right-2 gap-1 h-8 shadow-md"
          >
            {isDeleting ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Trash2 className="w-3.5 h-3.5" />}
            {isDeleting ? "Removing…" : "Remove"}
          </Button>
        </div>
        <Collapsible open={showUrlField} onOpenChange={setShowUrlField}>
          <CollapsibleTrigger asChild>
            <button
              type="button"
              className="flex items-center gap-1.5 text-xs text-gray-500 hover:text-gray-700 transition-colors"
            >
              <Link2 className="w-3 h-3" />
              {showUrlField ? "Hide URL" : "Edit URL manually"}
              <ChevronDown
                className={`w-3 h-3 transition-transform ${showUrlField ? "rotate-180" : ""}`}
              />
            </button>
          </CollapsibleTrigger>
          <CollapsibleContent className="pt-2">
            <Input
              type="url"
              value={value}
              onChange={(e) => {
                onChange(e.target.value);
                setPreviewError(false);
              }}
              placeholder="https://..."
              className="text-xs font-mono"
              disabled={disabled}
            />
          </CollapsibleContent>
        </Collapsible>
      </div>
    );
  }

  return (
    <div className="space-y-2">
      {label && <Label className="text-xs">{label}</Label>}
      <div
        onDragOver={(e) => {
          e.preventDefault();
          if (!disabled && !isUploading) setIsDragging(true);
        }}
        onDragLeave={() => setIsDragging(false)}
        onDrop={handleDrop}
        onClick={() => {
          if (!disabled && !isUploading) fileInputRef.current?.click();
        }}
        role="button"
        tabIndex={0}
        onKeyDown={(e) => {
          if ((e.key === "Enter" || e.key === " ") && !disabled && !isUploading) {
            e.preventDefault();
            fileInputRef.current?.click();
          }
        }}
        className={`flex flex-col items-center justify-center gap-2 rounded-lg border-2 border-dashed px-4 py-8 text-center cursor-pointer transition-colors ${
          isDragging
            ? "border-black bg-gray-50"
            : "border-gray-300 hover:border-gray-400 hover:bg-gray-50"
        } ${disabled || isUploading ? "opacity-60 cursor-not-allowed" : ""}`}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={(e) => handleFileChange(e.target.files)}
          disabled={disabled || isUploading}
        />
        {isUploading ? (
          <>
            <Loader2 className="w-6 h-6 text-gray-500 animate-spin" />
            <span className="text-sm font-medium text-gray-700">Uploading…</span>
          </>
        ) : (
          <>
            <Upload className="w-6 h-6 text-gray-500" />
            <div>
              <span className="text-sm font-medium text-gray-700">
                Drop an image here, or <span className="underline">browse</span>
              </span>
              <p className="text-xs text-gray-500 mt-1">
                {helperText ?? `JPG, PNG, GIF, WebP, or SVG · up to ${Math.round(maxSizeBytes / (1024 * 1024))} MB`}
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
            <ChevronDown
              className={`w-3 h-3 transition-transform ${showUrlField ? "rotate-180" : ""}`}
            />
          </button>
        </CollapsibleTrigger>
        <CollapsibleContent className="pt-2">
          <Input
            type="url"
            value={value}
            onChange={(e) => onChange(e.target.value)}
            placeholder="https://i.imgur.com/xxxxx.jpg"
            className="text-xs font-mono"
            disabled={disabled}
          />
          <p className="text-xs text-gray-500 mt-1">
            Paste a direct image URL (Imgur, Cloudinary, or any public image link).
          </p>
        </CollapsibleContent>
      </Collapsible>
    </div>
  );
}
