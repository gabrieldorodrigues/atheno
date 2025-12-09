"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Search, Calendar, User } from "lucide-react";
import { Header } from "@/components/header";

interface Article {
  id: string;
  title: string;
  slug: string;
  abstract: string;
  tags: string[];
  pseudonym?: string;
  createdAt: string;
  author: {
    name: string;
    email: string;
  };
}

export default function ArticlesPage() {
  const [articles, setArticles] = useState<Article[]>([]);
  const [filteredArticles, setFilteredArticles] = useState<Article[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedTag, setSelectedTag] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchArticles();
  }, []);

  useEffect(() => {
    filterArticles();
  }, [searchQuery, selectedTag, articles]);

  const fetchArticles = async () => {
    try {
      const response = await fetch("/api/articles");
      if (response.ok) {
        const data = await response.json();
        setArticles(data);
        setFilteredArticles(data);
      }
    } catch (error) {
      console.error("Error fetching articles:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const filterArticles = () => {
    let filtered = articles;

    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(
        (article) =>
          article.title.toLowerCase().includes(query) ||
          article.abstract.toLowerCase().includes(query) ||
          article.tags.some((tag) => tag.toLowerCase().includes(query))
      );
    }

    if (selectedTag) {
      filtered = filtered.filter((article) =>
        article.tags.includes(selectedTag)
      );
    }

    setFilteredArticles(filtered);
  };

  const allTags = Array.from(
    new Set(articles.flatMap((article) => article.tags))
  ).sort();

  return (
    <div className="min-h-screen">
      <Header
        showAuth
        centerContent={
          <div className="relative w-full">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              type="text"
              placeholder="Search by title, abstract, or tags..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 w-full"
            />
          </div>
        }
      />

      <div className="container mx-auto px-4 py-12">
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-4">Browse Articles</h1>
          <p className="text-muted-foreground text-lg">
            Explore published scientific articles from our community
          </p>
        </div>

        {allTags.length > 0 && (
          <div className="mb-8">
            <h3 className="text-sm font-medium mb-3">Filter by tag:</h3>
            <div className="flex gap-2 flex-wrap">
              <Badge
                variant={selectedTag === null ? "default" : "outline"}
                className="cursor-pointer"
                onClick={() => setSelectedTag(null)}
              >
                All
              </Badge>
              {allTags.map((tag) => (
                <Badge
                  key={tag}
                  variant={selectedTag === tag ? "default" : "outline"}
                  className="cursor-pointer"
                  onClick={() => setSelectedTag(tag)}
                >
                  {tag}
                </Badge>
              ))}
            </div>
          </div>
        )}

        {isLoading ? (
          <div className="text-center py-12">
            <p className="text-muted-foreground">Loading articles...</p>
          </div>
        ) : filteredArticles.length === 0 ? (
          <Card>
            <CardContent className="flex flex-col items-center justify-center py-16">
              <Search className="h-16 w-16 text-muted-foreground mb-4" />
              <h3 className="text-lg font-semibold mb-2">No articles found</h3>
              <p className="text-muted-foreground">
                {searchQuery || selectedTag
                  ? "Try adjusting your search or filters"
                  : "No articles have been published yet"}
              </p>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
            {filteredArticles.map((article) => (
              <div key={article.id} className="group relative">
                <Link href={`/article/${article.slug}`}>
                  <div className="relative aspect-[2/3] rounded-lg overflow-hidden shadow-md transition-all duration-300 group-hover:shadow-2xl group-hover:scale-105">
                    {/* Capa do livro */}
                    <div className="absolute inset-0 bg-gradient-to-br from-primary via-primary/90 to-primary/70 p-6 flex flex-col justify-between">
                      {/* Título na capa */}
                      <div className="flex-1 flex items-center justify-center">
                        <h3 className="text-white font-serif font-bold text-lg md:text-xl text-center leading-tight line-clamp-6">
                          {article.title}
                        </h3>
                      </div>

                      {/* Autor na parte inferior */}
                      <div className="text-white/80 text-xs md:text-sm text-center font-serif">
                        {article.pseudonym || article.author.name}
                      </div>
                    </div>

                    {/* Efeito de borda do livro */}
                    <div className="absolute inset-y-0 left-0 w-2 bg-gradient-to-r from-black/20 to-transparent"></div>
                  </div>
                </Link>

                {/* Card de informações ao hover */}
                <div className="hidden group-hover:block absolute left-full top-0 ml-4 w-80 z-50 pointer-events-none">
                  <Card className="shadow-xl pointer-events-auto">
                    <CardHeader>
                      <CardTitle className="text-lg line-clamp-3">
                        {article.title}
                      </CardTitle>
                      <div className="flex items-center gap-3 text-xs text-muted-foreground mt-2">
                        <div className="flex items-center gap-1">
                          <User className="h-3 w-3" />
                          <span>
                            {article.pseudonym || article.author.name}
                          </span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Calendar className="h-3 w-3" />
                          <span>
                            {new Date(article.createdAt).toLocaleDateString(
                              "en-US",
                              {
                                month: "short",
                                day: "numeric",
                                year: "numeric",
                              }
                            )}
                          </span>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <CardDescription className="text-sm mb-4 line-clamp-4">
                        {article.abstract}
                      </CardDescription>
                      <div className="flex gap-2 flex-wrap">
                        {article.tags.map((tag) => (
                          <Badge
                            key={tag}
                            variant="secondary"
                            className="text-xs"
                          >
                            {tag}
                          </Badge>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
