import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Plus, X, Image as ImageIcon } from "lucide-react";
import type { ProjectImage } from "../App";
import { FirebaseImageUploader } from "./admin/FirebaseImageUploader";
import { deleteFileByUrl } from "../../lib/uploadFile";
import { toast } from "sonner";

interface LogoManagerProps {
  logos: ProjectImage[];
  onChange: (logos: ProjectImage[]) => void;
}

const MAX_LOGOS = 10;

export function LogoManager({ logos, onChange }: LogoManagerProps) {
  const addLogo = () => {
    onChange([...logos, { url: "", description: "" }]);
  };

  const updateLogo = (index: number, field: keyof ProjectImage, value: string) => {
    const newLogos = [...logos];
    newLogos[index] = { ...newLogos[index], [field]: value };
    onChange(newLogos);
  };

  const removeLogo = async (index: number) => {
    const removed = logos[index];
    onChange(logos.filter((_, i) => i !== index));
    if (removed?.url) {
      try {
        await deleteFileByUrl(removed.url);
      } catch (err) {
        const message = err instanceof Error ? err.message : "Storage cleanup failed";
        toast.warning(`Logo removed, but Storage cleanup failed: ${message}`);
      }
    }
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
                <span className="text-sm font-medium text-gray-700">Logo {index + 1}</span>
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

              <FirebaseImageUploader
                value={logo.url}
                onChange={(url) => updateLogo(index, "url", url)}
                folder="logos"
                previewClassName="w-full h-32"
                previewObjectFit="contain"
                previewAlt={logo.description || `Logo ${index + 1}`}
              />

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
          ))}
        </div>
      )}

      {logos.length < MAX_LOGOS && (
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
          <p className="text-sm text-gray-500 mb-4">
            No logos added yet. Add logos to showcase different variations.
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
        Add up to {MAX_LOGOS} logo variations. Drop a file to upload, or paste a URL.
      </p>
    </div>
  );
}
