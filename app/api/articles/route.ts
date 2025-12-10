import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import prisma from "@/lib/db";
import { getOrCreateUser } from "@/lib/user-service";
import { generateSlug, ERROR_MESSAGES } from "@/lib/article-utils";

export async function POST(request: Request) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json(
        { error: ERROR_MESSAGES.UNAUTHORIZED },
        { status: 401 }
      );
    }

    const body = await request.json();
    const {
      title,
      abstract,
      content,
      references,
      coverStyle,
      tags,
      pseudonym,
    } = body;

    const user = await getOrCreateUser(userId);

    // Create article
    const article = await prisma.article.create({
      data: {
        title,
        slug: generateSlug(title),
        abstract,
        content,
        references: references || null,
        coverStyle: coverStyle || null,
        tags: Array.isArray(tags) ? tags : [],
        pseudonym: pseudonym || null,
        authorId: user.id,
      },
    });

    return NextResponse.json(article);
  } catch (error) {
    console.error("Error creating article:", error);
    const errorMessage =
      error instanceof Error ? error.message : ERROR_MESSAGES.CREATE_FAILED;
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}

export async function GET() {
  try {
    const articles = await prisma.article.findMany({
      where: { published: true },
      include: {
        author: {
          select: {
            name: true,
            email: true,
          },
        },
      },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json(articles);
  } catch (error) {
    console.error("Error fetching articles:", error);
    const errorMessage =
      error instanceof Error ? error.message : ERROR_MESSAGES.FETCH_FAILED;
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}
