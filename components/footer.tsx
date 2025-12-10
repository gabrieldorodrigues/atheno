import Link from "next/link";
import { Github } from "lucide-react";

export function Footer() {
  return (
    <footer className="border-t mt-auto">
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col items-center gap-4">
          <div className="flex flex-wrap justify-center gap-8 text-sm text-muted-foreground">
            <Link href="/about" className="hover:text-foreground transition-colors">
              About
            </Link>
            <Link href="/docs" className="hover:text-foreground transition-colors">
              Docs
            </Link>
            <Link href="/api" className="hover:text-foreground transition-colors">
              API
            </Link>
            <Link href="/terms" className="hover:text-foreground transition-colors">
              Terms & Privacy
            </Link>
          </div>
          <div className="flex items-center gap-4 text-sm text-muted-foreground">
            <span className="font-serif font-semibold">Atheno</span>
            <span>•</span>
            <Link 
              href="https://github.com/gabrieldorodrigues/atheno" 
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 hover:text-foreground transition-colors"
            >
              <Github className="h-4 w-4" />
              GitHub
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
