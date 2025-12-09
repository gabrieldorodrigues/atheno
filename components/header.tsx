import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ReactNode } from "react";

interface HeaderProps {
  showAuth?: boolean;
  showBrowse?: boolean;
  centerContent?: ReactNode;
}

export function Header({
  showAuth = false,
  showBrowse = false,
  centerContent,
}: HeaderProps) {
  return (
    <nav className="border-b">
      <div className="container mx-auto px-4 py-4 flex items-center justify-between gap-8">
        <Link href="/" className="text-xl font-bold font-serif shrink-0">
          Atheno
        </Link>
        {centerContent && (
          <div className="flex-1 max-w-2xl">{centerContent}</div>
        )}
        <div className="flex gap-4 shrink-0">
          {showBrowse && (
            <Link href="/articles">
              <Button variant="ghost">Browse Articles</Button>
            </Link>
          )}
          {showAuth && (
            <Link href="/sign-in">
              <Button variant="outline">Sign In to Publish</Button>
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
}
