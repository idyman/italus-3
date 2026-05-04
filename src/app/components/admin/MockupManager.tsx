import { useRef, useState } from "react";
import { Plus, Trash2, GripVertical, Upload, Loader2, Link2, ChevronDown } from "lucide-react";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "../ui/collapsible";
import type { MockupItem } from "../../App";
import { uploadFile, deleteFileByUrl } from "../../../lib/uploadFile";
import { toast } from "sonner";
import { FirebaseImageUploader } from "./FirebaseImageUploader";

interface MockupManagerProps {
  mockups: MockupItem[];
  onChange: (mockups: MockupItem[]) => void;
}

export function MockupManager({ mockups, onChange }: MockupManagerProps) {
  const [isUploading, setIsUploading] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [showUrlField, setShowUrlField] = useState(false);
  const [pasteUrl, setPasteUrl] = useState("");
  const [pasteTitle, setPasteTitle] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFilesSelected = async (files: FileList | null) => {
    if (!files || files.length === 0) return;

    setIsUploading(true);
    try {
      const uploaded: MockupItem[] = [];
      for (const file of Array.from(files)) {
        try {
          const url = await uploadFile(file, {
            folder: "mockups",
            maxSizeBytes: 10 * 1024 * 1024,
            allowedMimePrefix: "image/",
          });
          uploaded.push({
            id: `${Date.now()}-${uploaded.length}`,
            imageUrl: url,
          });
        } catch (error) {
          const message = error instanceof Error ? error.message : "Unknown error";
          toast.error(`Failed to upload ${file.name}: ${message}`);
        }
      }
      if (uploaded.length > 0) {
        onChange([...mockups, ...uploaded]);
        toast.success(`Added ${uploaded.length} mockup${uploaded.length === 1 ? "" : "s"}`);
      }
    } finally {
      setIsUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
    if (isUploading) return;
    handleFilesSelected(e.dataTransfer.files);
  };

  const handleAddFromUrl = () => {
    const trimmed = pasteUrl.trim();
    if (!trimmed) return;
    onChange([
      ...mockups,
      {
        id: Date.now().toString(),
        imageUrl: trimmed,
        title: pasteTitle.trim() || undefined,
      },
    ]);
    setPasteUrl("");
    setPasteTitle("");
    toast.success("Mockup added");
  };

  const handleRemoveMockup = async (id: string) => {
    const removed = mockups.find((m) => m.id === id);
    onChange(mockups.filter((m) => m.id !== id));
    if (removed?.imageUrl) {
      try {
        await deleteFileByUrl(removed.imageUrl);
      } catch (err) {
        const message = err instanceof Error ? err.message : "Storage cleanup failed";
        toast.warning(`Mockup removed, but Storage cleanup failed: ${message}`);
      }
    }
  };

  const handleUpdateMockup = (id: string, field: "imageUrl" | "title", value: string) => {
    onChange(mockups.map((m) => (m.id === id ? { ...m, [field]: value } : m)));
  };

  return (
    <div className="space-y-4">
      <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
        <p className="text-sm text-purple-900">
          📱 <strong>Add Mockup Screens:</strong> Drop one or more screen images below — each one becomes a separate mockup. You can edit titles and re-upload images per mockup after.
        </p>
      </div>

      {/* Primary uploader */}
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
                {mockups.length === 0 ? "Drop screen images here" : `Add mockup #${mockups.length + 1}`}, or <span className="underline">browse</span>
              </span>
              <p className="text-xs text-gray-500 mt-1">
                JPG, PNG, GIF, WebP, or SVG · up to 10&nbsp;MB each · multiple files allowed
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
          <div className="space-y-2">
            <Label className="text-xs">Screen Image URL</Label>
            <Input
              type="url"
              value={pasteUrl}
              onChange={(e) => setPasteUrl(e.target.value)}
              placeholder="https://i.imgur.com/xxxxx.png"
              className="text-sm font-mono"
            />
          </div>
          <div className="space-y-2">
            <Label className="text-xs">Title (optional)</Label>
            <Input
              type="text"
              value={pasteTitle}
              onChange={(e) => setPasteTitle(e.target.value)}
              placeholder="Home Screen"
              className="text-sm"
            />
          </div>
          <Button
            type="button"
            variant="outline"
            onClick={handleAddFromUrl}
            disabled={!pasteUrl.trim()}
            className="gap-1 w-full"
          >
            <Plus size={14} />
            Add from URL
          </Button>
        </CollapsibleContent>
      </Collapsible>

      {mockups.length > 0 && (
        <div className="space-y-3 mt-6">
          <h4 className="text-sm font-medium">Mockups ({mockups.length})</h4>
          {mockups.map((mockup, idx) => (
            <div
              key={mockup.id}
              className="border border-gray-200 rounded-lg p-4 space-y-3 bg-white"
            >
              <div className="flex items-start gap-3">
                <div className="flex-shrink-0 mt-2 cursor-move text-gray-400">
                  <GripVertical className="w-4 h-4" />
                </div>

                <div className="flex-1 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-semibold text-gray-700">Mockup {idx + 1}</span>
                  </div>

                  <FirebaseImageUploader
                    value={mockup.imageUrl}
                    onChange={(url) => handleUpdateMockup(mockup.id, "imageUrl", url)}
                    folder="mockups"
                    previewClassName="w-full h-48"
                    previewObjectFit="contain"
                    previewAlt={mockup.title || `Screen ${idx + 1}`}
                  />

                  <div className="space-y-1">
                    <Label className="text-xs">Title (optional)</Label>
                    <Input
                      type="text"
                      value={mockup.title || ""}
                      onChange={(e) => handleUpdateMockup(mockup.id, "title", e.target.value)}
                      placeholder="Home Screen"
                      className="text-sm"
                    />
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => handleRemoveMockup(mockup.id)}
                  className="flex-shrink-0 p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                  title="Remove mockup"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
