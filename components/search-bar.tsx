"use client";

import { useState, useEffect, useRef } from "react";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { ArticleCover } from "@/components/article-cover";
import { safeJsonParse } from "@/lib/article-utils";
import { CoverStyle } from "@/components/cover-customizer";

interface Article {
  id: string;
  title: string;
  slug: string;
  abstract: string;
  tags: string[];
  author: {
    name: string;
  };
  pseudonym?: string;
  coverStyle?: string;
}

export function SearchBar() {
  const [searchQuery, setSearchQuery] = useState("");
  const [articles, setArticles] = useState<Article[]>([]);
  const [filteredArticles, setFilteredArticles] = useState<Article[]>([]);
  const [showPreview, setShowPreview] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const searchRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const fetchArticles = async () => {
      setIsLoading(true);
      try {
        const response = await fetch("/api/articles");
        if (response.ok) {
          const data = await response.json();
          setArticles(data);
        }
      } catch (error) {
        console.error("Error fetching articles:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchArticles();
  }, []);

  useEffect(() => {
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      const filtered = articles.filter(
        (article) =>
          article.title.toLowerCase().includes(query) ||
          article.abstract.toLowerCase().includes(query) ||
          article.tags.some((tag) => tag.toLowerCase().includes(query)) ||
          article.author.name.toLowerCase().includes(query) ||
          (article.pseudonym && article.pseudonym.toLowerCase().includes(query))
      );
      setFilteredArticles(filtered.slice(0, 5)); // Show max 5 results
      setShowPreview(true);
    } else {
      setFilteredArticles([]);
      setShowPreview(false);
    }
  }, [searchQuery, articles]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        searchRef.current &&
        !searchRef.current.contains(event.target as Node)
      ) {
        setShowPreview(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const highlightText = (text: string, query: string) => {
    if (!query.trim()) return text;

    const parts = text.split(new RegExp(`(${query})`, "gi"));
    return parts.map((part, index) =>
      part.toLowerCase() === query.toLowerCase() ? (
        <mark key={index} className="bg-yellow-200 dark:bg-yellow-800">
          {part}
        </mark>
      ) : (
        part
      )
    );
  };

  return (
    <div ref={searchRef} className="relative w-full">
      <div className="relative flex items-center justify-center">
        {!searchQuery && (
          <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 flex items-center gap-2 pointer-events-none">
            <Search className="h-4 w-4 text-muted-foreground" />
            <span className="text-sm text-muted-foreground">
              Search articles...
            </span>
          </div>
        )}
        <Input
          type="text"
          placeholder=""
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          onFocus={() => searchQuery && setShowPreview(true)}
          className="text-center bg-transparent focus-visible:ring-0 focus-visible:ring-offset-0"
        />
      </div>

      {showPreview && searchQuery && (
        <div className="absolute top-full left-0 right-0 mt-2 bg-background border rounded-lg shadow-lg z-50 max-h-96 overflow-y-auto">
          {isLoading ? (
            <div className="p-4 text-center text-muted-foreground">
              Loading...
            </div>
          ) : filteredArticles.length > 0 ? (
            <div className="divide-y">
              {filteredArticles.map((article) => {
                const coverStyle = safeJsonParse<CoverStyle>(
                  article.coverStyle || null
                );
                return (
                  <Link
                    key={article.id}
                    href={`/article/${article.slug}`}
                    onClick={() => {
                      setShowPreview(false);
                      setSearchQuery("");
                    }}
                    className="block p-4 hover:bg-muted/50 transition-colors"
                  >
                    <div className="flex items-start gap-3">
                      <div className="w-16 h-20 shrink-0 rounded overflow-hidden">
                        <ArticleCover
                          title={article.title}
                          coverStyle={coverStyle}
                          compact
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className="font-semibold text-sm mb-1 line-clamp-1">
                          {highlightText(article.title, searchQuery)}
                        </h4>
                        <p className="text-xs text-muted-foreground line-clamp-2 mb-2">
                          {highlightText(
                            article.abstract.substring(0, 100) + "...",
                            searchQuery
                          )}
                        </p>
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="text-xs text-muted-foreground">
                            by {article.pseudonym || article.author.name}
                          </span>
                          {article.tags.slice(0, 2).map((tag) => (
                            <Badge
                              key={tag}
                              variant="secondary"
                              className="text-xs"
                            >
                              {highlightText(tag, searchQuery)}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    </div>
                  </Link>
                );
              })}
              <Link
                href={`/articles?search=${encodeURIComponent(searchQuery)}`}
                onClick={() => {
                  setShowPreview(false);
                  setSearchQuery("");
                }}
                className="block p-3 text-center text-sm text-primary hover:bg-muted/50 transition-colors font-medium"
              >
                View all results for "{searchQuery}"
              </Link>
            </div>
          ) : (
            <div className="p-8 text-center text-muted-foreground">
              <Search className="h-12 w-12 mx-auto mb-2 opacity-50" />
              <p>No articles found for "{searchQuery}"</p>
              <p className="text-xs mt-1">Try different keywords</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
