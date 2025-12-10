"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/theme-toggle";
import { UserButton, useUser } from "@clerk/nextjs";
import { ReactNode } from "react";
import { SearchBar } from "@/components/search-bar";

interface HeaderProps {
  showAuth?: boolean;
  showBrowse?: boolean;
  showSearch?: boolean;
  centerContent?: ReactNode;
}

export function Header({
  showAuth = false,
  showBrowse = false,
  showSearch = false,
  centerContent,
}: HeaderProps) {
  const { isSignedIn, isLoaded } = useUser();

  return (
    <nav className="border-b">
      <div className="container mx-auto px-4 py-4 flex items-center justify-between gap-8">
        <Link href="/" className="text-xl font-bold font-serif shrink-0">
          Atheno
        </Link>
        {centerContent && (
          <div className="flex-1 max-w-2xl">{centerContent}</div>
        )}
        {!centerContent && showSearch && isSignedIn && (
          <div className="flex-1 max-w-2xl">
            <SearchBar />
          </div>
        )}
        <div className="flex gap-4 shrink-0 items-center">
          {showBrowse && (
            <Link href="/articles">
              <Button variant="ghost">Browse Articles</Button>
            </Link>
          )}
          {showAuth && isLoaded && !isSignedIn && (
            <Link href="/sign-in">
              <Button variant="outline">Sign In to Publish</Button>
            </Link>
          )}
          {showAuth && isLoaded && isSignedIn && (
            <UserButton afterSignOutUrl="/" />
          )}
          <ThemeToggle />
        </div>
      </div>
    </nav>
  );
}
