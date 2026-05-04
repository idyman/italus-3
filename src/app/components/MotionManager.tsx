import { useState } from "react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Plus, X, Film } from "lucide-react";
import { ImageWithFallback } from "./figma/ImageWithFallback";
import type { MotionItem } from "../App";

interface MotionManagerProps {
  motion: MotionItem[];
  onChange: (motion: MotionItem[]) => void;
}

export function MotionManager({ motion, onChange }: MotionManagerProps) {
  const addMotion = () => {
    onChange([...motion, { url: "", description: "", type: "video" }]);
  };

  const updateMotion = (index: number, field: keyof MotionItem, value: string) => {
    const newMotion = [...motion];
    newMotion[index] = { ...newMotion[index], [field]: value } as MotionItem;
    onChange(newMotion);
  };

  const removeMotion = (index: number) => {
    onChange(motion.filter((_, i) => i !== index));
  };

  return (
    <div className="space-y-4">
      {motion.length > 0 && (
        <div className="space-y-4">
          {motion.map((item, index) => (
            <div
              key={index}
              className="border border-gray-300 rounded-lg p-4 space-y-3 bg-white"
            >
              <div className="flex justify-between items-start">
                <span className="text-sm font-medium text-gray-700">
                  Motion {index + 1}
                </span>
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => removeMotion(index)}
                  className="h-6 w-6 p-0 text-red-600 hover:text-red-700 hover:bg-red-50"
                >
                  <X size={14} />
                </Button>
              </div>

              {/* Preview */}
              {item.url && (
                <div className="rounded overflow-hidden bg-gray-900 aspect-video">
                  {item.type === "video" ? (
                    <video
                      src={item.url}
                      controls
                      muted
                      playsInline
                      className="w-full h-full object-contain"
                    >
                      Your browser does not support the video tag.
                    </video>
                  ) : (
                    <ImageWithFallback
                      src={item.url}
                      alt={item.description || "Motion graphic"}
                      className="w-full h-full object-contain"
                    />
                  )}
                </div>
              )}

              <div className="space-y-3">
                <div>
                  <Label className="text-xs">Type</Label>
                  <select
                    value={item.type}
                    onChange={(e) =>
                      updateMotion(index, "type", e.target.value)
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="video">Video (MP4, WebM)</option>
                    <option value="gif">GIF</option>
                  </select>
                  <p className="text-xs text-gray-500 mt-1">
                    Choose the type of motion content
                  </p>
                </div>

                <div>
                  <Label className="text-xs">
                    {item.type === "video" ? "Video URL" : "GIF URL"}
                  </Label>
                  <Input
                    type="url"
                    value={item.url}
                    onChange={(e) => updateMotion(index, "url", e.target.value)}
                    placeholder={
                      item.type === "video"
                        ? "https://example.com/animation.mp4"
                        : "https://example.com/animation.gif"
                    }
                    className="text-sm"
                  />
                </div>

                <div>
                  <Label className="text-xs">Description (optional)</Label>
                  <Input
                    value={item.description}
                    onChange={(e) =>
                      updateMotion(index, "description", e.target.value)
                    }
                    placeholder="Loading animation concept"
                    className="text-sm"
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {motion.length < 10 && (
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={addMotion}
          className="gap-2"
        >
          <Plus size={16} />
          Add Motion
        </Button>
      )}

      {motion.length === 0 && (
        <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
          <Film className="mx-auto h-12 w-12 text-gray-400 mb-3" />
          <p className="text-sm text-gray-500 mb-4">
            No motion content added yet. Add videos or GIFs to showcase animations and interactions.
          </p>
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={addMotion}
            className="gap-2"
          >
            <Plus size={16} />
            Add First Motion
          </Button>
        </div>
      )}

      <p className="text-xs text-gray-500">
        Add up to 10 videos or GIFs. These will display in the Motion section showing your project's animations.
      </p>
    </div>
  );
}
