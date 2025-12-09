import { auth, currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import Link from "next/link";
import prisma from "@/lib/db";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { FileText, Eye, BarChart3, Calendar, TrendingUp, Clock } from "lucide-react";
import { ArticleCover } from "@/components/article-cover";

export default async function DashboardPage() {
  const { userId } = await auth();
  const user = await currentUser();

  if (!userId || !user) {
    redirect("/sign-in");
  }

  // Get or create user in database
  let dbUser = await prisma.user.findUnique({
    where: { clerkId: userId },
  });

  if (!dbUser) {
    dbUser = await prisma.user.create({
      data: {
        clerkId: userId,
        email: user.emailAddresses[0].emailAddress,
        name: user.fullName || user.username || "User",
      },
    });
  }

  // Get user's articles
  const articles = await prisma.article.findMany({
    where: { authorId: dbUser.id },
    orderBy: { updatedAt: "desc" },
  });

  // Calculate statistics
  const totalArticles = articles.length;
  const publishedArticles = articles.filter((a) => a.published).length;
  const draftArticles = totalArticles - publishedArticles;
  const recentArticles = articles.filter(
    (a) => new Date(a.updatedAt) > new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)
  ).length;

  // Get all unique tags
  const allTags = [...new Set(articles.flatMap((a) => a.tags))];

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">My Articles</h1>
        <p className="text-muted-foreground mt-2">
          Manage and publish your scientific articles
        </p>
      </div>      {articles.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-16">
            <FileText className="h-16 w-16 text-muted-foreground mb-4" />
            <h3 className="text-lg font-semibold mb-2">No articles yet</h3>
            <p className="text-muted-foreground mb-4">
              Start creating your first scientific article
            </p>
            <Link href="/dashboard/new">
              <Button>
                Create Article
              </Button>
            </Link>
          </CardContent>
        </Card>
      ) : (
        <>
          {/* Statistics Cards */}
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 mb-8">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Total Articles
                </CardTitle>
                <FileText className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{totalArticles}</div>
                <p className="text-xs text-muted-foreground">
                  All your articles
                </p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Published
                </CardTitle>
                <TrendingUp className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{publishedArticles}</div>
                <p className="text-xs text-muted-foreground">
                  Live articles
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Drafts
                </CardTitle>
                <Clock className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{draftArticles}</div>
                <p className="text-xs text-muted-foreground">
                  In progress
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Recent Updates
                </CardTitle>
                <Calendar className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{recentArticles}</div>
                <p className="text-xs text-muted-foreground">
                  Last 7 days
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Tabs for filtering articles */}
          <Tabs defaultValue="all" className="w-full">
            <TabsList className="grid w-full max-w-md grid-cols-3">
              <TabsTrigger value="all">All ({totalArticles})</TabsTrigger>
              <TabsTrigger value="published">Published ({publishedArticles})</TabsTrigger>
              <TabsTrigger value="drafts">Drafts ({draftArticles})</TabsTrigger>
            </TabsList>

            <TabsContent value="all" className="mt-6">
              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
                {articles.map((article) => (
                  <div key={article.id} className="flex flex-col gap-3">
                    <div className="aspect-[2/3] w-full rounded-lg overflow-hidden shadow-md">
                      <ArticleCover
                        title={article.title}
                        coverStyle={
                          (article as any).coverStyle
                            ? JSON.parse((article as any).coverStyle)
                            : null
                        }
                      />
                    </div>
                    <Card>
                      <CardHeader className="pb-3">
                        <div className="flex items-center gap-2 mb-2">
                          <Badge
                            variant={article.published ? "default" : "secondary"}
                            className="text-xs"
                          >
                            {article.published ? "Published" : "Draft"}
                          </Badge>
                        </div>
                        <CardTitle className="text-base line-clamp-2 leading-tight">{article.title}</CardTitle>
                        <CardDescription className="line-clamp-3 text-xs mt-2">
                          {article.abstract}
                        </CardDescription>
                      </CardHeader>
                      <CardContent>
                        <div className="flex flex-col gap-2">
                          {article.published && (
                            <Link href={`/article/${article.slug}`} className="w-full">
                              <Button variant="default" size="sm" className="w-full">
                                <Eye className="mr-2 h-3 w-3" />
                                View
                              </Button>
                            </Link>
                          )}
                          <Link href={`/dashboard/edit/${article.id}`} className="w-full">
                            <Button variant="outline" size="sm" className="w-full">
                              Edit
                            </Button>
                          </Link>
                          <span className="text-xs text-muted-foreground text-center mt-1">
                            {new Date(article.updatedAt).toLocaleDateString()}
                          </span>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                ))}
              </div>
            </TabsContent>

            <TabsContent value="published" className="mt-6">
              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
                {articles.filter((a) => a.published).map((article) => (
                  <div key={article.id} className="flex flex-col gap-3">
                    <div className="aspect-[2/3] w-full rounded-lg overflow-hidden shadow-md">
                      <ArticleCover
                        title={article.title}
                        coverStyle={
                          (article as any).coverStyle
                            ? JSON.parse((article as any).coverStyle)
                            : null
                        }
                      />
                    </div>
                    <Card>
                      <CardHeader className="pb-3">
                        <div className="flex items-center gap-2 mb-2">
                          <Badge variant="default" className="text-xs">Published</Badge>
                        </div>
                        <CardTitle className="text-base line-clamp-2 leading-tight">{article.title}</CardTitle>
                        <CardDescription className="line-clamp-3 text-xs mt-2">
                          {article.abstract}
                        </CardDescription>
                      </CardHeader>
                      <CardContent>
                        <div className="flex flex-col gap-2">
                          <Link href={`/article/${article.slug}`} className="w-full">
                            <Button variant="default" size="sm" className="w-full">
                              <Eye className="mr-2 h-3 w-3" />
                              View
                            </Button>
                          </Link>
                          <Link href={`/dashboard/edit/${article.id}`} className="w-full">
                            <Button variant="outline" size="sm" className="w-full">
                              Edit
                            </Button>
                          </Link>
                          <span className="text-xs text-muted-foreground text-center mt-1">
                            {new Date(article.updatedAt).toLocaleDateString()}
                          </span>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                ))}
              </div>
            </TabsContent>

            <TabsContent value="drafts" className="mt-6">
              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
                {articles.filter((a) => !a.published).map((article) => (
                  <div key={article.id} className="flex flex-col gap-3">
                    <div className="aspect-[2/3] w-full rounded-lg overflow-hidden shadow-md">
                      <ArticleCover
                        title={article.title}
                        coverStyle={
                          (article as any).coverStyle
                            ? JSON.parse((article as any).coverStyle)
                            : null
                        }
                      />
                    </div>
                    <Card>
                      <CardHeader className="pb-3">
                        <div className="flex items-center gap-2 mb-2">
                          <Badge variant="secondary" className="text-xs">Draft</Badge>
                        </div>
                        <CardTitle className="text-base line-clamp-2 leading-tight">{article.title}</CardTitle>
                        <CardDescription className="line-clamp-3 text-xs mt-2">
                          {article.abstract}
                        </CardDescription>
                      </CardHeader>
                      <CardContent>
                        <div className="flex flex-col gap-2">
                          <Link href={`/dashboard/edit/${article.id}`} className="w-full">
                            <Button variant="outline" size="sm" className="w-full">
                              Edit
                            </Button>
                          </Link>
                          <span className="text-xs text-muted-foreground text-center mt-1">
                            {new Date(article.updatedAt).toLocaleDateString()}
                          </span>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                ))}
              </div>
            </TabsContent>
          </Tabs>
        </>
      )}
    </div>
  );
}
