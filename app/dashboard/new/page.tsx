"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Label } from "@/components/ui/label";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import remarkMath from "remark-math";
import rehypeKatex from "rehype-katex";
import "katex/dist/katex.min.css";
import { ArrowLeft, Save } from "lucide-react";
import Link from "next/link";
import { toast } from "sonner";
import { CoverCustomizer, CoverStyle } from "@/components/cover-customizer";

export default function NewArticlePage() {
  const router = useRouter();
  const [isSaving, setIsSaving] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    abstract: "",
    content: "",
    references: "",
    tags: "",
    pseudonym: "",
  });
  const [coverStyle, setCoverStyle] = useState<CoverStyle | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);

    try {
      const response = await fetch("/api/articles", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...formData,
          coverStyle: coverStyle ? JSON.stringify(coverStyle) : null,
          tags: formData.tags
            .split(",")
            .map((tag) => tag.trim())
            .filter(Boolean),
        }),
      });

      if (response.ok) {
        toast.success("Article created successfully!");
        router.push("/dashboard");
        router.refresh();
      } else {
        toast.error("Failed to create article");
      }
    } catch (error) {
      toast.error("Error creating article");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-6xl">
      <div className="mb-6">
        <Link href="/dashboard">
          <Button variant="ghost" size="sm">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Dashboard
          </Button>
        </Link>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Form - 2/3 width */}
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>New Article</CardTitle>
              <CardDescription>
                Create a new scientific article. Use Markdown for formatting.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="title">Title</Label>
                  <Input
                    id="title"
                    placeholder="Article title"
                    value={formData.title}
                    onChange={(e) =>
                      setFormData({ ...formData, title: e.target.value })
                    }
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="abstract">Abstract</Label>
                  <Textarea
                    id="abstract"
                    placeholder="Brief summary of your article"
                    value={formData.abstract}
                    onChange={(e) =>
                      setFormData({ ...formData, abstract: e.target.value })
                    }
                    rows={4}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="tags">Tags</Label>
                  <Input
                    id="tags"
                    placeholder="machine learning, AI, neural networks (comma separated)"
                    value={formData.tags}
                    onChange={(e) =>
                      setFormData({ ...formData, tags: e.target.value })
                    }
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="pseudonym">Pseudonym (optional)</Label>
                  <Input
                    id="pseudonym"
                    placeholder="Leave empty to use your real name"
                    value={formData.pseudonym}
                    onChange={(e) =>
                      setFormData({ ...formData, pseudonym: e.target.value })
                    }
                  />
                  <p className="text-xs text-muted-foreground">
                    If provided, this name will be displayed instead of your real
                    name on the published article.
                  </p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="references">References (optional)</Label>
                  <Textarea
                    id="references"
                    placeholder="List your references here (one per line)..."
                    value={formData.references}
                    onChange={(e) =>
                      setFormData({ ...formData, references: e.target.value })
                    }
                    rows={6}
                  />
                  <p className="text-xs text-muted-foreground">
                    Add bibliographic references for your article.
                  </p>
                </div>

                <div className="space-y-2">
                  <Label>Content</Label>
                  <Tabs defaultValue="edit" className="w-full">
                    <TabsList className="grid w-full grid-cols-2">
                      <TabsTrigger value="edit">Edit</TabsTrigger>
                      <TabsTrigger value="preview">Preview</TabsTrigger>
                    </TabsList>
                    <TabsContent value="edit" className="mt-4">
                      <Textarea
                        placeholder="Write your article content in Markdown..."
                        value={formData.content}
                        onChange={(e) =>
                          setFormData({ ...formData, content: e.target.value })
                        }
                        rows={20}
                        className="font-mono"
                        required
                      />
                    </TabsContent>
                    <TabsContent value="preview" className="mt-4">
                      <div className="min-h-[500px] border rounded-lg p-6 prose dark:prose-invert max-w-none">
                        <ReactMarkdown
                          remarkPlugins={[remarkGfm, remarkMath]}
                          rehypePlugins={[rehypeKatex]}
                        >
                          {formData.content || "*Preview will appear here...*"}
                        </ReactMarkdown>
                      </div>
                    </TabsContent>
                  </Tabs>
                </div>

                <div className="flex gap-4">
                  <Button type="submit" disabled={isSaving}>
                    <Save className="mr-2 h-4 w-4" />
                    {isSaving ? "Saving..." : "Save Draft"}
                  </Button>
                  <Link href="/dashboard">
                    <Button type="button" variant="outline">
                      Cancel
                    </Button>
                  </Link>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>

        {/* Cover Customizer - 1/3 width */}
        <div className="lg:col-span-1">
          <CoverCustomizer
            title={formData.title || "Article Title"}
            coverStyle={coverStyle}
            onChange={setCoverStyle}
          />
        </div>
      </div>
    </div>
  );
}
