// Article utility functions and constants

export const SLUG_CONSTANTS = {
  MAX_LENGTH: 100,
  RANDOM_LENGTH: 7,
} as const;

export const ERROR_MESSAGES = {
  UNAUTHORIZED: "Unauthorized",
  USER_NOT_FOUND: "User not found",
  ARTICLE_NOT_FOUND: "Article not found",
  FORBIDDEN: "Forbidden",
  CREATE_FAILED: "Failed to create article",
  UPDATE_FAILED: "Failed to update article",
  DELETE_FAILED: "Failed to delete article",
  FETCH_FAILED: "Failed to fetch article",
} as const;

/**
 * Generates a URL-friendly slug from a title
 * @param title - The article title
 * @returns A unique slug with random suffix
 */
export function generateSlug(title: string): string {
  const baseSlug = title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .substring(0, SLUG_CONSTANTS.MAX_LENGTH);

  const randomSuffix = Math.random()
    .toString(36)
    .substring(2, 2 + SLUG_CONSTANTS.RANDOM_LENGTH);

  return `${baseSlug}-${randomSuffix}`;
}

/**
 * Parses comma-separated tags into an array
 * @param tags - Comma-separated string of tags
 * @returns Array of trimmed, non-empty tags
 */
export function parseTags(tags: string): string[] {
  return tags
    .split(",")
    .map((tag) => tag.trim())
    .filter(Boolean);
}

/**
 * Safely parses JSON or returns null
 * @param json - JSON string to parse
 * @returns Parsed object or null if invalid
 */
export function safeJsonParse<T>(json: string | null): T | null {
  if (!json) return null;
  try {
    return JSON.parse(json) as T;
  } catch {
    return null;
  }
}
