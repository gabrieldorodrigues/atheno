import { notFound } from "next/navigation";
import prisma from "@/lib/db";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import remarkMath from "remark-math";
import rehypeKatex from "rehype-katex";
import "katex/dist/katex.min.css";
import { Calendar, User } from "lucide-react";
import { Header } from "@/components/header";
import { ReferencesSection } from "@/components/references-section";
import { ArticleCover } from "@/components/article-cover";
import { ArticleLayout } from "@/components/article-layout";

export default async function ArticlePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  const article = await prisma.article.findUnique({
    where: {
      slug,
      published: true,
    },
    include: {
      author: {
        select: {
          name: true,
          email: true,
        },
      },
    },
  });

  if (!article) {
    notFound();
  }

  const displayName = article.pseudonym || article.author.name;

  return (
    <div className="min-h-screen">
      <Header showBrowse showAuth showSearch />

      <ArticleLayout
        content={article.content}
        hasReferences={!!(article as any).references}
      >
        <article>
          <header className="mb-8">
            <h1 className="text-4xl font-bold mb-4">{article.title}</h1>

            <div className="flex items-center gap-4 text-muted-foreground mb-6">
              <div className="flex items-center gap-2">
                <User className="h-4 w-4" />
                <span>{displayName}</span>
              </div>
              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4" />
                <span>
                  {new Date(article.createdAt).toLocaleDateString("en-US", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })}
                </span>
              </div>
            </div>

            <div className="flex gap-2 flex-wrap mb-6">
              {article.tags.map((tag) => (
                <Badge key={tag} variant="secondary">
                  {tag}
                </Badge>
              ))}
            </div>

            <div className="flex gap-6 items-start">
              <div className="w-48 flex-shrink-0">
                <ArticleCover
                  title={article.title}
                  coverStyle={
                    (article as any).coverStyle
                      ? JSON.parse((article as any).coverStyle)
                      : null
                  }
                />
              </div>

              <Card className="bg-muted/50 flex-1">
                <CardHeader>
                  <h2 className="text-lg font-semibold">Abstract</h2>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground leading-relaxed">
                    {article.abstract}
                  </p>
                </CardContent>
              </Card>
            </div>
          </header>

          <Separator className="mb-8" />

          <div className="prose dark:prose-invert max-w-none prose-headings:font-bold prose-h1:text-3xl prose-h2:text-2xl prose-h3:text-xl prose-a:text-primary prose-img:rounded-lg">
            <ReactMarkdown
              remarkPlugins={[remarkGfm, remarkMath]}
              rehypePlugins={[rehypeKatex]}
            >
              {article.content}
            </ReactMarkdown>
          </div>

          <Separator className="my-8" />

          {(article as any).references && (
            <>
              <ReferencesSection references={(article as any).references} />
              <Separator className="my-8" />
            </>
          )}

          <footer className="text-sm text-muted-foreground">
            <p>
              Last updated:{" "}
              {new Date(article.updatedAt).toLocaleDateString("en-US", {
                year: "numeric",
                month: "long",
                day: "numeric",
              })}
            </p>
          </footer>
        </article>
      </ArticleLayout>
    </div>
  );
}
