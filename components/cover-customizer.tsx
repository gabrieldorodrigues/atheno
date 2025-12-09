"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ArticleCover } from "@/components/article-cover";
import { Upload } from "lucide-react";

export interface CoverStyle {
  type: "gradient" | "image";
  // Gradient options
  color1?: string;
  color2?: string;
  // Image options
  imageUrl?: string;
  blur?: number;
  grayscale?: number;
  brightness?: number;
  grain?: number;
  // Display options
  showTitle?: boolean;
}

interface CoverCustomizerProps {
  title: string;
  coverStyle?: CoverStyle | null;
  onChange: (style: CoverStyle) => void;
}

const PRESET_COLORS = [
  { name: "Blue", color1: "#3b82f6", color2: "#1e40af" },
  { name: "Purple", color1: "#a855f7", color2: "#7c3aed" },
  { name: "Green", color1: "#10b981", color2: "#059669" },
  { name: "Red", color1: "#ef4444", color2: "#dc2626" },
  { name: "Orange", color1: "#f97316", color2: "#ea580c" },
  { name: "Pink", color1: "#ec4899", color2: "#db2777" },
];

export function CoverCustomizer({
  title,
  coverStyle,
  onChange,
}: CoverCustomizerProps) {
  const [localStyle, setLocalStyle] = useState<CoverStyle>(
    coverStyle || {
      type: "gradient",
      color1: "#3b82f6",
      color2: "#1e40af",
      showTitle: true,
    }
  );

  useEffect(() => {
    onChange(localStyle);
  }, [localStyle]);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setLocalStyle({
          ...localStyle,
          type: "image",
          imageUrl: reader.result as string,
          blur: localStyle.type === "image" ? localStyle.blur : 0,
          grayscale: localStyle.type === "image" ? localStyle.grayscale : 0,
          brightness: localStyle.type === "image" ? localStyle.brightness : 100,
          grain: localStyle.type === "image" ? localStyle.grain : 0,
        });
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Customize Cover</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Preview */}
        <div className="w-full max-w-[200px] mx-auto">
          <ArticleCover title={title} coverStyle={localStyle} />
        </div>

        <div className="flex items-center justify-between">
          <Label htmlFor="show-title">Show title on cover</Label>
          <Switch
            id="show-title"
            checked={localStyle.showTitle !== false}
            onCheckedChange={(checked) =>
              setLocalStyle({ ...localStyle, showTitle: checked })
            }
          />
        </div>

        <Tabs
          value={localStyle.type}
          onValueChange={(value) =>
            setLocalStyle({
              type: value as "gradient" | "image",
              ...(value === "gradient"
                ? { color1: "#3b82f6", color2: "#1e40af" }
                : {
                    imageUrl: "",
                    blur: 0,
                    grayscale: 0,
                    brightness: 100,
                    grain: 0,
                  }),
            })
          }
        >
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="gradient">Gradient</TabsTrigger>
            <TabsTrigger value="image">Image</TabsTrigger>
          </TabsList>

          <TabsContent value="gradient" className="space-y-4 mt-4">
            <div className="space-y-3">
              <Label>Preset Colors</Label>
              <div className="grid grid-cols-3 gap-2">
                {PRESET_COLORS.map((preset) => (
                  <Button
                    key={preset.name}
                    variant="outline"
                    size="sm"
                    onClick={() =>
                      setLocalStyle({
                        ...localStyle,
                        type: "gradient",
                        color1: preset.color1,
                        color2: preset.color2,
                      })
                    }
                    className="h-12"
                    style={{
                      background: `linear-gradient(135deg, ${preset.color1}, ${preset.color2})`,
                    }}
                  >
                    <span className="text-white text-xs font-semibold drop-shadow">
                      {preset.name}
                    </span>
                  </Button>
                ))}
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="color1">Color 1</Label>
              <div className="flex gap-2">
                <Input
                  id="color1"
                  type="color"
                  value={localStyle.color1 || "#3b82f6"}
                  onChange={(e) =>
                    setLocalStyle({ ...localStyle, color1: e.target.value })
                  }
                  className="w-20 h-10"
                />
                <Input
                  type="text"
                  value={localStyle.color1 || "#3b82f6"}
                  onChange={(e) =>
                    setLocalStyle({ ...localStyle, color1: e.target.value })
                  }
                  className="flex-1"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="color2">Color 2</Label>
              <div className="flex gap-2">
                <Input
                  id="color2"
                  type="color"
                  value={localStyle.color2 || "#1e40af"}
                  onChange={(e) =>
                    setLocalStyle({ ...localStyle, color2: e.target.value })
                  }
                  className="w-20 h-10"
                />
                <Input
                  type="text"
                  value={localStyle.color2 || "#1e40af"}
                  onChange={(e) =>
                    setLocalStyle({ ...localStyle, color2: e.target.value })
                  }
                  className="flex-1"
                />
              </div>
            </div>
          </TabsContent>

          <TabsContent value="image" className="space-y-4 mt-4">
            <div className="space-y-2">
              <Label htmlFor="image">Upload Image</Label>
              <div className="flex items-center gap-2">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => document.getElementById("image")?.click()}
                  className="w-full"
                >
                  <Upload className="mr-2 h-4 w-4" />
                  Choose Image
                </Button>
                <Input
                  id="image"
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="hidden"
                />
              </div>
            </div>

            {localStyle.imageUrl && (
              <>
                <div className="space-y-2">
                  <Label htmlFor="blur">Blur: {localStyle.blur || 0}px</Label>
                  <Input
                    id="blur"
                    type="range"
                    min="0"
                    max="20"
                    value={localStyle.blur || 0}
                    onChange={(e) =>
                      setLocalStyle({
                        ...localStyle,
                        blur: parseInt(e.target.value),
                      })
                    }
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="grayscale">
                    Grayscale: {localStyle.grayscale || 0}%
                  </Label>
                  <Input
                    id="grayscale"
                    type="range"
                    min="0"
                    max="100"
                    value={localStyle.grayscale || 0}
                    onChange={(e) =>
                      setLocalStyle({
                        ...localStyle,
                        grayscale: parseInt(e.target.value),
                      })
                    }
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="brightness">
                    Brightness: {localStyle.brightness || 100}%
                  </Label>
                  <Input
                    id="brightness"
                    type="range"
                    min="20"
                    max="150"
                    value={localStyle.brightness || 100}
                    onChange={(e) =>
                      setLocalStyle({
                        ...localStyle,
                        brightness: parseInt(e.target.value),
                      })
                    }
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="grain">Grain: {localStyle.grain || 0}%</Label>
                  <Input
                    id="grain"
                    type="range"
                    min="0"
                    max="100"
                    value={localStyle.grain || 0}
                    onChange={(e) =>
                      setLocalStyle({
                        ...localStyle,
                        grain: parseInt(e.target.value),
                      })
                    }
                  />
                </div>
              </>
            )}
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}
