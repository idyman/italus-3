import { useState } from "react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Plus, X, Type } from "lucide-react";
import type { TypographyItem } from "../App";

interface TypographyManagerProps {
  typography: TypographyItem[];
  onChange: (typography: TypographyItem[]) => void;
}

export function TypographyManager({ typography, onChange }: TypographyManagerProps) {
  const addTypography = () => {
    onChange([
      ...typography,
      { fontFamily: "", sampleText: "Aa", fontUrl: "" },
    ]);
  };

  const updateTypography = (
    index: number,
    field: keyof TypographyItem,
    value: string
  ) => {
    const newTypography = [...typography];
    newTypography[index] = { ...newTypography[index], [field]: value };
    onChange(newTypography);
  };

  const removeTypography = (index: number) => {
    onChange(typography.filter((_, i) => i !== index));
  };

  return (
    <div className="space-y-4">
      {typography.length > 0 && (
        <div className="space-y-4">
          {typography.map((typo, index) => (
            <div
              key={index}
              className="border border-gray-300 rounded-lg p-4 space-y-3 bg-white"
            >
              <div className="flex justify-between items-start">
                <span className="text-sm font-medium text-gray-700">
                  Font {index + 1}
                </span>
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => removeTypography(index)}
                  className="h-6 w-6 p-0 text-red-600 hover:text-red-700 hover:bg-red-50"
                >
                  <X size={14} />
                </Button>
              </div>

              {/* Font Preview */}
              {typo.fontFamily && typo.sampleText && (
                <div className="bg-gray-50 rounded-lg p-6 flex items-center justify-center min-h-[120px]">
                  {typo.fontUrl && (
                    <link rel="stylesheet" href={typo.fontUrl} />
                  )}
                  <div
                    className="text-6xl font-bold text-gray-800"
                    style={{ fontFamily: typo.fontFamily }}
                  >
                    {typo.sampleText}
                  </div>
                </div>
              )}

              <div className="grid sm:grid-cols-2 gap-3">
                <div>
                  <Label className="text-xs">Font Family</Label>
                  <Input
                    value={typo.fontFamily}
                    onChange={(e) =>
                      updateTypography(index, "fontFamily", e.target.value)
                    }
                    placeholder="Helvetica Neue"
                    className="text-sm"
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    e.g., Arial, Georgia, Roboto
                  </p>
                </div>

                <div>
                  <Label className="text-xs">Sample Text</Label>
                  <Input
                    value={typo.sampleText}
                    onChange={(e) =>
                      updateTypography(index, "sampleText", e.target.value)
                    }
                    placeholder="Aa"
                    className="text-sm"
                    maxLength={10}
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    Letters to display (e.g., Aa, Bb, 123)
                  </p>
                </div>
              </div>

              <div>
                <Label className="text-xs">Font URL (optional)</Label>
                <Input
                  type="url"
                  value={typo.fontUrl || ""}
                  onChange={(e) =>
                    updateTypography(index, "fontUrl", e.target.value)
                  }
                  placeholder="https://fonts.googleapis.com/css2?family=Roboto"
                  className="text-sm"
                />
                <p className="text-xs text-gray-500 mt-1">
                  Google Fonts or custom font CSS URL
                </p>
              </div>
            </div>
          ))}
        </div>
      )}

      {typography.length < 8 && (
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={addTypography}
          className="gap-2"
        >
          <Plus size={16} />
          Add Font
        </Button>
      )}

      {typography.length === 0 && (
        <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
          <Type className="mx-auto h-12 w-12 text-gray-400 mb-3" />
          <p className="text-sm text-gray-500 mb-4">
            No typography samples added yet. Add fonts to showcase your project's type system.
          </p>
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={addTypography}
            className="gap-2"
          >
            <Plus size={16} />
            Add First Font
          </Button>
        </div>
      )}

      <p className="text-xs text-gray-500">
        Add up to 8 font samples. These will display as large letter samples in the Typography section.
      </p>
    </div>
  );
}
