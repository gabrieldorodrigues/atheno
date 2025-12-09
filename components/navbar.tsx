import Link from "next/link";
import { UserButton } from "@clerk/nextjs";
import { Button } from "@/components/ui/button";

export function Navbar() {
  return (
    <nav className="border-b">
      <div className="container mx-auto px-4 py-4 flex items-center justify-between">
        <div className="flex items-center gap-8">
          <Link href="/" className="text-xl font-bold font-serif">
            Atheno
          </Link>
          <div className="hidden md:flex items-center gap-4">
            <Link href="/articles">
              <Button variant="ghost">Browse Articles</Button>
            </Link>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <UserButton afterSignOutUrl="/" />
        </div>
      </div>
    </nav>
  );
}
