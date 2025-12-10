import { currentUser } from "@clerk/nextjs/server";
import prisma from "@/lib/db";

/**
 * Gets or creates a user in the database from Clerk authentication
 * @param clerkId - The Clerk user ID
 * @returns The database user record
 * @throws Error if user cannot be found or created
 */
export async function getOrCreateUser(clerkId: string) {
  let user = await prisma.user.findUnique({
    where: { clerkId },
  });

  if (!user) {
    const clerkUser = await currentUser();
    if (!clerkUser) {
      throw new Error("Clerk user not found");
    }

    user = await prisma.user.create({
      data: {
        clerkId,
        email: clerkUser.emailAddresses[0].emailAddress,
        name: clerkUser.fullName || clerkUser.username || "User",
      },
    });
  }

  return user;
}

/**
 * Validates that a user owns an article
 * @param articleId - The article ID
 * @param userId - The database user ID
 * @returns The article if owned by user
 * @throws Error if article not found or not owned by user
 */
export async function validateArticleOwnership(
  articleId: string,
  userId: string
) {
  const article = await prisma.article.findUnique({
    where: { id: articleId },
  });

  if (!article) {
    throw new Error("Article not found");
  }

  if (article.authorId !== userId) {
    throw new Error("Forbidden");
  }

  return article;
}
