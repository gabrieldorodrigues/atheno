"use client";

import { useState } from "react";
import { TableOfContents } from "@/components/table-of-contents";

interface ArticleLayoutProps {
  content: string;
  hasReferences?: boolean;
  children: React.ReactNode;
}

export function ArticleLayout({ content, hasReferences, children }: ArticleLayoutProps) {
  const [isTocCollapsed, setIsTocCollapsed] = useState(true);

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-16">
        {/* Table of Contents - Left Sidebar */}
        <aside className="hidden lg:block lg:col-span-3">
          <TableOfContents 
            content={content}
            hasReferences={hasReferences}
            onCollapseChange={setIsTocCollapsed}
          />
        </aside>

        {/* Main Content */}
        <div className={isTocCollapsed ? "lg:col-span-9 lg:col-start-3" : "lg:col-span-9"}>
          {children}
        </div>
      </div>
    </div>
  );
}
