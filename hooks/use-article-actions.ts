import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { CoverStyle } from "@/components/cover-customizer";
import { prepareArticleForSubmit, ArticleFormData } from "@/lib/form-utils";

interface UseArticleSubmitOptions {
  onSuccess?: () => void;
}

/**
 * Hook for handling article creation
 */
export function useCreateArticle(options?: UseArticleSubmitOptions) {
  const router = useRouter();
  const [isSaving, setIsSaving] = useState(false);

  const createArticle = async (
    formData: ArticleFormData,
    coverStyle: CoverStyle | null
  ) => {
    setIsSaving(true);

    try {
      const submitData = prepareArticleForSubmit(formData, coverStyle);
      const response = await fetch("/api/articles", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(submitData),
      });

      if (response.ok) {
        toast.success("Article created successfully!");
        router.push("/dashboard");
        router.refresh();
        options?.onSuccess?.();
      } else {
        toast.error("Failed to create article");
      }
    } catch (error) {
      console.error("Error creating article:", error);
      toast.error("Error creating article");
    } finally {
      setIsSaving(false);
    }
  };

  return { createArticle, isSaving };
}

interface UseUpdateArticleOptions {
  articleId: string;
  onSuccess?: () => void;
}

/**
 * Hook for handling article updates
 */
export function useUpdateArticle(options: UseUpdateArticleOptions) {
  const router = useRouter();
  const [isSaving, setIsSaving] = useState(false);

  const updateArticle = async (
    formData: ArticleFormData & { published?: boolean },
    coverStyle: CoverStyle | null
  ) => {
    setIsSaving(true);

    try {
      const submitData = prepareArticleForSubmit(formData, coverStyle);
      const response = await fetch(`/api/articles/${options.articleId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(submitData),
      });

      if (response.ok) {
        toast.success("Article updated successfully!");
        router.refresh();
        options?.onSuccess?.();
      } else {
        toast.error("Failed to update article");
      }
    } catch (error) {
      console.error("Error updating article:", error);
      toast.error("Error updating article");
    } finally {
      setIsSaving(false);
    }
  };

  return { updateArticle, isSaving };
}

/**
 * Hook for handling article publishing/unpublishing
 */
export function usePublishArticle(options: UseUpdateArticleOptions) {
  const router = useRouter();
  const [isPublishing, setIsPublishing] = useState(false);

  const togglePublish = async (
    formData: ArticleFormData & { published: boolean },
    coverStyle: CoverStyle | null
  ) => {
    setIsPublishing(true);

    try {
      const submitData = prepareArticleForSubmit(
        { ...formData, published: !formData.published },
        coverStyle
      );
      const response = await fetch(`/api/articles/${options.articleId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(submitData),
      });

      if (response.ok) {
        toast.success(
          formData.published
            ? "Article unpublished"
            : "Article published successfully!"
        );
        router.refresh();
        options?.onSuccess?.();
        return true;
      } else {
        const errorData = await response
          .json()
          .catch(() => ({ error: "Unknown error" }));
        toast.error(
          errorData.error || `Failed to publish article (${response.status})`
        );
        return false;
      }
    } catch (error) {
      console.error("Error publishing article:", error);
      toast.error("Error publishing article");
      return false;
    } finally {
      setIsPublishing(false);
    }
  };

  return { togglePublish, isPublishing };
}

/**
 * Hook for handling article deletion
 */
export function useDeleteArticle() {
  const router = useRouter();
  const [isDeleting, setIsDeleting] = useState(false);

  const deleteArticle = async (articleId: string) => {
    if (
      !confirm(
        "Are you sure you want to delete this article? This action cannot be undone."
      )
    ) {
      return false;
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
        return true;
      } else {
        toast.error("Failed to delete article");
        return false;
      }
    } catch (error) {
      console.error("Error deleting article:", error);
      toast.error("Error deleting article");
      return false;
    } finally {
      setIsDeleting(false);
    }
  };

  return { deleteArticle, isDeleting };
}
