import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import prisma from "@/lib/db";
import { validateArticleOwnership, getOrCreateUser } from "@/lib/user-service";
import { generateSlug, ERROR_MESSAGES } from "@/lib/article-utils";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json(
        { error: ERROR_MESSAGES.UNAUTHORIZED },
        { status: 401 }
      );
    }

    const { id } = await params;
    const user = await prisma.user.findUnique({
      where: { clerkId: userId },
    });

    if (!user) {
      return NextResponse.json(
        { error: ERROR_MESSAGES.USER_NOT_FOUND },
        { status: 404 }
      );
    }

    const article = await validateArticleOwnership(id, user.id);
    return NextResponse.json(article);
  } catch (error) {
    console.error("Error fetching article:", error);

    if (error instanceof Error) {
      if (error.message === "Article not found") {
        return NextResponse.json(
          { error: ERROR_MESSAGES.ARTICLE_NOT_FOUND },
          { status: 404 }
        );
      }
      if (error.message === "Forbidden") {
        return NextResponse.json(
          { error: ERROR_MESSAGES.FORBIDDEN },
          { status: 403 }
        );
      }
    }

    return NextResponse.json(
      { error: ERROR_MESSAGES.FETCH_FAILED },
      { status: 500 }
    );
  }
}

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json(
        { error: ERROR_MESSAGES.UNAUTHORIZED },
        { status: 401 }
      );
    }

    const { id } = await params;
    const body = await request.json();
    const {
      title,
      abstract,
      content,
      references,
      coverStyle,
      tags,
      published,
      pseudonym,
    } = body;

    const user = await prisma.user.findUnique({
      where: { clerkId: userId },
    });

    if (!user) {
      return NextResponse.json(
        { error: ERROR_MESSAGES.USER_NOT_FOUND },
        { status: 404 }
      );
    }

    const existingArticle = await validateArticleOwnership(id, user.id);

    // Update article
    const updateData: any = {};

    if (title !== undefined) {
      updateData.title = title;
      // Regenerate slug if title changed and article is not published
      if (title !== existingArticle.title && !existingArticle.published) {
        updateData.slug = generateSlug(title);
      }
    }
    if (abstract !== undefined) updateData.abstract = abstract;
    if (content !== undefined) updateData.content = content;
    if (references !== undefined) updateData.references = references || null;
    if (coverStyle !== undefined) updateData.coverStyle = coverStyle || null;
    if (tags !== undefined) updateData.tags = Array.isArray(tags) ? tags : [];
    if (pseudonym !== undefined) updateData.pseudonym = pseudonym || null;

    // Allow publishing
    if (published !== undefined) {
      updateData.published = published;
    }

    const article = await prisma.article.update({
      where: { id },
      data: updateData,
    });

    return NextResponse.json(article);
  } catch (error) {
    console.error("Error updating article:", error);

    if (error instanceof Error) {
      if (error.message === "Article not found") {
        return NextResponse.json(
          { error: ERROR_MESSAGES.ARTICLE_NOT_FOUND },
          { status: 404 }
        );
      }
      if (error.message === "Forbidden") {
        return NextResponse.json(
          { error: ERROR_MESSAGES.FORBIDDEN },
          { status: 403 }
        );
      }
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json(
      { error: ERROR_MESSAGES.UPDATE_FAILED },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json(
        { error: ERROR_MESSAGES.UNAUTHORIZED },
        { status: 401 }
      );
    }

    const { id } = await params;
    const user = await prisma.user.findUnique({
      where: { clerkId: userId },
    });

    if (!user) {
      return NextResponse.json(
        { error: ERROR_MESSAGES.USER_NOT_FOUND },
        { status: 404 }
      );
    }

    await validateArticleOwnership(id, user.id);
    await prisma.article.delete({ where: { id } });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error deleting article:", error);

    if (error instanceof Error) {
      if (error.message === "Article not found") {
        return NextResponse.json(
          { error: ERROR_MESSAGES.ARTICLE_NOT_FOUND },
          { status: 404 }
        );
      }
      if (error.message === "Forbidden") {
        return NextResponse.json(
          { error: ERROR_MESSAGES.FORBIDDEN },
          { status: 403 }
        );
      }
    }

    return NextResponse.json(
      { error: ERROR_MESSAGES.DELETE_FAILED },
      { status: 500 }
    );
  }
}
