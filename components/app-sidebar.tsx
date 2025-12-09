"use client";

import { useState } from "react";
import Link from "next/link";
import { UserButton } from "@clerk/nextjs";
import { 
  Home, 
  FileText, 
  PlusCircle, 
  Search,
  ChevronLeft,
  ChevronRight,
  Settings
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { ThemeToggle } from "@/components/theme-toggle";

export function AppSidebar() {
  const [isCollapsed, setIsCollapsed] = useState(false);

  const menuItems = [
    { icon: Home, label: "Home", href: "/" },
    { icon: Search, label: "Browse", href: "/articles" },
    { icon: FileText, label: "My Articles", href: "/dashboard" },
    { icon: PlusCircle, label: "New Article", href: "/dashboard/new" },
  ];

  return (
    <div
      className={cn(
        "fixed left-0 top-0 bottom-0 z-50 flex flex-col border-r bg-background transition-all duration-300",
        isCollapsed ? "w-16" : "w-64"
      )}
    >
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b">
        {!isCollapsed && (
          <Link href="/" className="text-xl font-bold font-serif">
            Atheno
          </Link>
        )}
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setIsCollapsed(!isCollapsed)}
          className={cn("ml-auto", isCollapsed && "mx-auto")}
        >
          {isCollapsed ? (
            <ChevronRight className="h-4 w-4" />
          ) : (
            <ChevronLeft className="h-4 w-4" />
          )}
        </Button>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-2 space-y-1 overflow-y-auto">
        {menuItems.map((item) => (
          <Link key={item.href} href={item.href}>
            <Button
              variant="ghost"
              className={cn(
                "w-full justify-start",
                isCollapsed && "justify-center px-2"
              )}
            >
              <item.icon className={cn("h-4 w-4", !isCollapsed && "mr-2")} />
              {!isCollapsed && <span>{item.label}</span>}
            </Button>
          </Link>
        ))}
      </nav>

      {/* Footer */}
      <div className="p-4 border-t space-y-2">
        <div className={cn("flex items-center gap-2", isCollapsed && "justify-center")}>
          <ThemeToggle />
          {!isCollapsed && <span className="text-sm text-muted-foreground">Theme</span>}
        </div>
        <div className={cn("flex items-center gap-2", isCollapsed && "justify-center")}>
          <UserButton afterSignOutUrl="/" />
          {!isCollapsed && <span className="text-sm text-muted-foreground">Account</span>}
        </div>
      </div>
    </div>
  );
}
