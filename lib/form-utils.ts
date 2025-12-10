import { CoverStyle } from "@/components/cover-customizer";

export interface ArticleFormData {
  title: string;
  abstract: string;
  content: string;
  references: string;
  tags: string;
  pseudonym: string;
  published?: boolean;
}

export interface ArticleSubmitData {
  title: string;
  abstract: string;
  content: string;
  references: string;
  coverStyle: string | null;
  tags: string[];
  pseudonym: string;
  published?: boolean;
}

/**
 * Prepares form data for API submission
 */
export function prepareArticleForSubmit(
  formData: ArticleFormData,
  coverStyle: CoverStyle | null
): ArticleSubmitData {
  return {
    title: formData.title,
    abstract: formData.abstract,
    content: formData.content,
    references: formData.references,
    coverStyle: coverStyle ? JSON.stringify(coverStyle) : null,
    tags: formData.tags
      .split(",")
      .map((tag) => tag.trim())
      .filter(Boolean),
    pseudonym: formData.pseudonym,
    ...(formData.published !== undefined && { published: formData.published }),
  };
}
