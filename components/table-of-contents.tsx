"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface Heading {
  id: string;
  text: string;
  level: number;
}

interface TableOfContentsProps {
  content: string;
  hasReferences?: boolean;
  onCollapseChange?: (isCollapsed: boolean) => void;
}

export function TableOfContents({
  content,
  hasReferences,
  onCollapseChange,
}: TableOfContentsProps) {
  const [headings, setHeadings] = useState<Heading[]>([]);
  const [activeId, setActiveId] = useState<string>("");
  const [isCollapsed, setIsCollapsed] = useState(true);

  const handleToggleCollapse = (collapsed: boolean) => {
    setIsCollapsed(collapsed);
    onCollapseChange?.(collapsed);
  };

  useEffect(() => {
    // Extract headings from markdown content
    const headingRegex = /^(#{2,3})\s+(.+)$/gm;
    const matches = Array.from(content.matchAll(headingRegex));

    const extractedHeadings: Heading[] = matches.map((match, index) => {
      const level = match[1].length;
      const text = match[2].trim();
      const id = `heading-${index}`;
      return { id, text, level };
    });

    setHeadings(extractedHeadings);

    // Add IDs to actual headings in the DOM
    const timer = setTimeout(() => {
      const articleHeadings = document.querySelectorAll(
        "article h2, article h3"
      );
      articleHeadings.forEach((heading, index) => {
        heading.id = `heading-${index}`;
      });
    }, 100);

    return () => clearTimeout(timer);
  }, [content]);

  useEffect(() => {
    if (headings.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveId(entry.target.id);
          }
        });
      },
      {
        rootMargin: "-80px 0px -80% 0px",
      }
    );

    headings.forEach(({ id }) => {
      const element = document.getElementById(id);
      if (element) {
        observer.observe(element);
      }
    });

    return () => observer.disconnect();
  }, [headings]);

  if (headings.length === 0 && !hasReferences) return null;

  const scrollToHeading = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      const offset = 80;
      const elementPosition = element.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - offset;

      window.scrollTo({
        top: offsetPosition,
        behavior: "smooth",
      });
    }
  };

  const scrollToReferences = () => {
    const referencesElement = document.querySelector(
      "[data-references-section]"
    );
    if (referencesElement) {
      const offset = 80;
      const elementPosition = referencesElement.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - offset;

      window.scrollTo({
        top: offsetPosition,
        behavior: "smooth",
      });
    }
  };

  return (
    <div className="relative">
      {isCollapsed ? (
        <button
          onClick={() => handleToggleCollapse(false)}
          className="sticky top-4 flex items-center gap-2 p-1 rounded-md hover:bg-muted transition-colors"
          aria-label="Show Table of Contents"
        >
          <ChevronRight className="h-4 w-4" />
          <span className="text-sm font-semibold">Table of Contents</span>
        </button>
      ) : (
        <Card className="sticky top-4 shadow-none border-none">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
            <CardTitle className="text-sm font-semibold">
              Table of Contents
            </CardTitle>
            <button
              onClick={() => handleToggleCollapse(true)}
              className="p-1 rounded-md hover:bg-muted transition-colors"
              aria-label="Hide Table of Contents"
            >
              <ChevronLeft className="h-4 w-4" />
            </button>
          </CardHeader>
          <CardContent>
            <nav className="space-y-2">
              {headings.map((heading) => (
                <button
                  key={heading.id}
                  onClick={() => scrollToHeading(heading.id)}
                  className={`block w-full text-left text-sm transition-colors hover:text-primary ${
                    activeId === heading.id
                      ? "text-primary font-medium"
                      : "text-muted-foreground"
                  } ${heading.level === 3 ? "pl-4" : ""}`}
                >
                  {heading.text}
                </button>
              ))}
              {hasReferences && (
                <button
                  onClick={scrollToReferences}
                  className="block w-full text-left text-sm transition-colors hover:text-primary text-muted-foreground mt-4 pt-4 border-t"
                >
                  References
                </button>
              )}
            </nav>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
