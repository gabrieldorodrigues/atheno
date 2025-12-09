import Link from "next/link";
import { Button } from "@/components/ui/button";
import { BookOpen, FileText, Search } from "lucide-react";

export default function Home() {
  return (
    <div className="min-h-screen">
      <nav className="border-b">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="text-xl font-bold">Scientific Articles</div>
          <div className="flex gap-4">
            <Link href="/articles">
              <Button variant="ghost">Browse</Button>
            </Link>
            <Link href="/sign-in">
              <Button variant="outline">Sign In</Button>
            </Link>
            <Link href="/sign-up">
              <Button>Get Started</Button>
            </Link>
          </div>
        </div>
      </nav>

      <main className="container mx-auto px-4 py-20">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-5xl font-bold mb-6">
            Create & Publish Scientific Articles
          </h1>
          <p className="text-xl text-muted-foreground mb-8">
            A modern platform for researchers to write, edit, and share their
            scientific work with the world.
          </p>
          <div className="flex gap-4 justify-center mb-16">
            <Link href="/sign-up">
              <Button size="lg">
                <FileText className="mr-2 h-5 w-5" />
                Start Writing
              </Button>
            </Link>
            <Link href="/articles">
              <Button size="lg" variant="outline">
                <Search className="mr-2 h-5 w-5" />
                Browse Articles
              </Button>
            </Link>
          </div>

          <div className="grid md:grid-cols-3 gap-8 mt-20">
            <div className="p-6 border rounded-lg">
              <BookOpen className="h-12 w-12 mb-4 mx-auto text-primary" />
              <h3 className="text-lg font-semibold mb-2">Write in Markdown</h3>
              <p className="text-muted-foreground">
                Use familiar Markdown syntax with live preview
              </p>
            </div>
            <div className="p-6 border rounded-lg">
              <FileText className="h-12 w-12 mb-4 mx-auto text-primary" />
              <h3 className="text-lg font-semibold mb-2">Easy Publishing</h3>
              <p className="text-muted-foreground">
                Publish your articles with a single click
              </p>
            </div>
            <div className="p-6 border rounded-lg">
              <Search className="h-12 w-12 mb-4 mx-auto text-primary" />
              <h3 className="text-lg font-semibold mb-2">Discoverable</h3>
              <p className="text-muted-foreground">
                Make your research easily searchable by tags
              </p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
