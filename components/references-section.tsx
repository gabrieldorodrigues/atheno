"use client";

import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { ChevronDown, ChevronUp } from "lucide-react";

export function ReferencesSection({ references }: { references: string }) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <section className="mb-8">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between text-2xl font-bold mb-4 hover:text-primary transition-colors"
      >
        <span>References</span>
        {isOpen ? (
          <ChevronUp className="h-6 w-6" />
        ) : (
          <ChevronDown className="h-6 w-6" />
        )}
      </button>
      
      {isOpen && (
        <Card className="bg-muted/30">
          <CardContent className="pt-6">
            <div className="space-y-2 text-sm text-muted-foreground whitespace-pre-wrap">
              {references}
            </div>
          </CardContent>
        </Card>
      )}
    </section>
  );
}
