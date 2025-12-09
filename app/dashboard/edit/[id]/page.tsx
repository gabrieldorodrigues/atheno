"use client";

import { useState, useEffect } from "react";
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
import { ArrowLeft, Save, Send, Trash2 } from "lucide-react";
import Link from "next/link";
import { toast } from "sonner";
import { CoverCustomizer, CoverStyle } from "@/components/cover-customizer";

interface Article {
  id: string;
  title: string;
  abstract: string;
  content: string;
  tags: string[];
  published: boolean;
}

export default function EditArticlePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const router = useRouter();
  const [articleId, setArticleId] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [isPublishing, setIsPublishing] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [formData, setFormData] = useState({
    title: "",
    abstract: "",
    content: "",
    references: "",
    tags: "",
    pseudonym: "",
    published: false,
  });
  const [coverStyle, setCoverStyle] = useState<CoverStyle | null>(null);

  useEffect(() => {
    params.then((resolvedParams) => {
      setArticleId(resolvedParams.id);
      fetchArticle(resolvedParams.id);
    });
  }, []);

  const fetchArticle = async (id: string) => {
    try {
      const response = await fetch(`/api/articles/${id}`);
      if (response.ok) {
        const article: Article = await response.json();
        setFormData({
          title: article.title,
          abstract: article.abstract,
          content: article.content,
          references: (article as any).references || "",
          tags: article.tags.join(", "),
          pseudonym: (article as any).pseudonym || "",
          published: article.published,
        });
        if ((article as any).coverStyle) {
          try {
            setCoverStyle(JSON.parse((article as any).coverStyle));
          } catch {
            setCoverStyle(null);
          }
        }
      }
    } catch (error) {
      console.error("Error fetching article:", error);
      toast.error("Failed to load article");
    } finally {
      setIsLoading(false);
    }
  };

  const handleSave = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!articleId) return;

    setIsSaving(true);

    try {
      const response = await fetch(`/api/articles/${articleId}`, {
        method: "PATCH",
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
        toast.success("Article updated successfully!");
        router.refresh();
      } else {
        toast.error("Failed to update article");
      }
    } catch (error) {
      toast.error("Error updating article");
    } finally {
      setIsSaving(false);
    }
  };

  const handlePublish = async () => {
    if (!articleId) return;

    setIsPublishing(true);

    try {
      const response = await fetch(`/api/articles/${articleId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...formData,
          coverStyle: coverStyle ? JSON.stringify(coverStyle) : null,
          tags: formData.tags
            .split(",")
            .map((tag) => tag.trim())
            .filter(Boolean),
          published: !formData.published,
        }),
      });

      if (response.ok) {
        setFormData({ ...formData, published: !formData.published });
        toast.success(
          formData.published
            ? "Article unpublished"
            : "Article published successfully!"
        );
        router.refresh();
      } else {
        const errorData = await response.json().catch(() => ({}));
        console.error("Publish error:", {
          status: response.status,
          statusText: response.statusText,
          errorData,
        });
        toast.error(
          errorData.error || `Failed to publish article (${response.status})`
        );
      }
    } catch (error) {
      toast.error("Error publishing article");
    } finally {
      setIsPublishing(false);
    }
  };

  const handleDelete = async () => {
    if (!articleId) return;

    if (
      !confirm(
        "Are you sure you want to delete this article? This action cannot be undone."
      )
    ) {
      return;
    }

    setIsDeleting(true);

    try {
      const response = await fetch(`/api/articles/${articleId}`, {
        method: "DELETE",
      });

      if (response.ok) {
        toast.success("Article deleted successfully");
        router.push("/dashboard");
        router.refresh();
      } else {
        toast.error("Failed to delete article");
      }
    } catch (error) {
      toast.error("Error deleting article");
    } finally {
      setIsDeleting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8 flex items-center justify-center">
        <p className="text-muted-foreground">Loading article...</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-6xl">
      <div className="mb-6 flex items-center justify-between">
        <Link href="/dashboard">
          <Button variant="ghost" size="sm">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Dashboard
          </Button>
        </Link>
        <Button
          variant="destructive"
          size="sm"
          onClick={handleDelete}
          disabled={isDeleting}
        >
          <Trash2 className="mr-2 h-4 w-4" />
          {isDeleting ? "Deleting..." : "Delete"}
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Form - 2/3 width */}
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>Edit Article</CardTitle>
              <CardDescription>
                Make changes to your article. Use Markdown for formatting.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSave} className="space-y-6">
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
                    If provided, this name will be displayed instead of your
                    real name on the published article.
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
                      <div className="min-h-[500px] border rounded-lg p-6 prose prose-slate max-w-none">
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
                    {isSaving ? "Updating..." : "Update"}
                  </Button>
                  <Button
                    type="button"
                    variant={formData.published ? "outline" : "default"}
                    onClick={handlePublish}
                    disabled={isPublishing}
                  >
                    <Send className="mr-2 h-4 w-4" />
                    {isPublishing
                      ? "Processing..."
                      : formData.published
                      ? "Unpublish"
                      : "Publish"}
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
