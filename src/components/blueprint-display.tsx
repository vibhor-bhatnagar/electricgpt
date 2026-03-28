"use client";

import { useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { renderMarkdown } from "@/lib/markdown";
import {
  FileText,
  Zap,
  Copy,
  Check,
  AlertTriangle,
  Loader2,
} from "lucide-react";
import { useState, useCallback } from "react";
import { slugifySection } from "@/lib/utils";

interface BlueprintDisplayProps {
  content: string;
  status: "ready" | "streaming" | "error";
  error?: Error;
  activeSection?: string; // slug — if set, only that section is rendered
  totalSections?: number;
}

/** Extract the lines belonging to a single `# ` section from the full markdown. */
function extractSection(content: string, slug: string): string {
  const lines = content.split("\n");
  const result: string[] = [];
  let inside = false;

  for (const line of lines) {
    if (line.startsWith("# ")) {
      if (inside) break; // reached the next section
      const title = line.replace(/^# /, "").trim();
      if (slugifySection(title) === slug) {
        inside = true;
        result.push(line);
      }
    } else if (inside) {
      result.push(line);
    }
  }

  return result.join("\n").trim();
}

function BlueprintSkeleton() {
  return (
    <div className="space-y-4 p-6 animate-pulse">
      {[80, 55, 65, 45, 70].map((w, i) => (
        <div key={i} className="space-y-2">
          <div className="h-4 rounded bg-muted" style={{ width: `${w}%` }} />
          <div className="h-3 rounded bg-muted/60" style={{ width: "90%" }} />
          <div className="h-3 rounded bg-muted/60" style={{ width: "75%" }} />
          <div className="h-3 rounded bg-muted/60" style={{ width: "82%" }} />
        </div>
      ))}
    </div>
  );
}

export function BlueprintDisplay({
  content,
  status,
  error,
  activeSection,
  totalSections = 0,
}: BlueprintDisplayProps) {
  const [copied, setCopied] = useState<"all" | "section" | null>(null);

  const isLoading = status === "streaming";
  const hasContent = content.length > 0;

  // Filter to only the active section's markdown
  const visibleContent = useMemo(() => {
    if (!hasContent || !activeSection) return content;
    const extracted = extractSection(content, activeSection);
    return extracted || content; // fallback to full content if slug not found
  }, [content, activeSection, hasContent]);

  // Section title for the header subtitle
  const activeSectionTitle = useMemo(
    () =>
      visibleContent
        .split("\n")
        .find((l) => l.startsWith("# "))
        ?.replace(/^# /, "")
        .trim() ?? "",
    [visibleContent]
  );

  const handleCopyAll = useCallback(async () => {
    if (!content) return;
    await navigator.clipboard.writeText(content);
    setCopied("all");
    setTimeout(() => setCopied(null), 2000);
  }, [content]);

  const handleCopySection = useCallback(async () => {
    if (!visibleContent) return;
    await navigator.clipboard.writeText(visibleContent);
    setCopied("section");
    setTimeout(() => setCopied(null), 2000);
  }, [visibleContent]);

  return (
    <Card className="border-border bg-card shadow-xl shadow-black/30">
      {/* Header */}
      <CardHeader className="pb-3 flex-shrink-0 border-b border-border">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary/15 border border-primary/30">
              <FileText className="h-4 w-4 text-primary" />
            </div>
            <div>
              <CardTitle className="text-base font-semibold text-foreground">
                Design Blueprint
              </CardTitle>
              <p className="text-xs text-muted-foreground mt-0.5">
                {isLoading
                  ? "Generating…"
                  : activeSectionTitle
                  ? activeSectionTitle
                  : hasContent
                  ? `${totalSections} sections`
                  : "Awaiting project parameters"}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {isLoading && (
              <div className="flex items-center gap-1.5 text-xs text-primary">
                <Loader2 className="h-3 w-3 animate-spin" />
                <span>Generating</span>
              </div>
            )}
            {hasContent && !isLoading && (
              <div className="flex items-center gap-1.5">
                <button
                  onClick={handleCopySection}
                  title="Copy this section"
                  className="flex items-center gap-1.5 rounded-md border border-border px-2.5 py-1.5 text-xs text-muted-foreground hover:text-foreground hover:border-border/80 transition-colors"
                >
                  {copied === "section" ? (
                    <><Check className="h-3 w-3 text-emerald-400" /> Copied</>
                  ) : (
                    <><Copy className="h-3 w-3" /> Copy section</>
                  )}
                </button>
                <button
                  onClick={handleCopyAll}
                  title="Copy full blueprint"
                  className="flex items-center gap-1.5 rounded-md border border-border px-2.5 py-1.5 text-xs text-muted-foreground hover:text-foreground hover:border-border/80 transition-colors"
                >
                  {copied === "all" ? (
                    <><Check className="h-3 w-3 text-emerald-400" /> Copied</>
                  ) : (
                    <><Copy className="h-3 w-3" /> Copy all</>
                  )}
                </button>
              </div>
            )}
          </div>
        </div>
      </CardHeader>

      {/* Body */}
      <CardContent className="p-0">
        {error ? (
          <div className="flex flex-col items-center justify-center min-h-[400px] gap-3 p-8 text-center">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-destructive/15 border border-destructive/30">
              <AlertTriangle className="h-5 w-5 text-destructive" />
            </div>
            <div>
              <p className="text-sm font-medium text-foreground">Generation Failed</p>
              <p className="text-xs text-muted-foreground mt-1 max-w-xs">
                {error.message || "An unexpected error occurred. Please try again."}
              </p>
            </div>
          </div>
        ) : isLoading && !hasContent ? (
          <BlueprintSkeleton />
        ) : !hasContent ? (
          <EmptyState />
        ) : (
          <div className="p-6">
            <div
              className="blueprint-content"
              dangerouslySetInnerHTML={{ __html: renderMarkdown(visibleContent) }}
            />
          </div>
        )}
      </CardContent>
    </Card>
  );
}

function EmptyState() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[480px] gap-5 p-8">
      <div className="relative">
        <div className="hero-grid absolute inset-0 rounded-2xl opacity-30" />
        <div className="relative flex h-20 w-20 items-center justify-center rounded-2xl border border-primary/30 bg-primary/10">
          <Zap className="h-9 w-9 text-primary" />
        </div>
      </div>
      <div className="text-center space-y-2 max-w-xs">
        <p className="text-sm font-semibold text-foreground">Ready to Generate</p>
        <p className="text-xs text-muted-foreground leading-relaxed">
          Configure your project parameters above, then click{" "}
          <span className="text-primary font-medium">Generate Blueprint</span>{" "}
          to receive a comprehensive electrical engineering document referencing
          CEC, NBC, and NFPA standards.
        </p>
      </div>
      <div className="grid grid-cols-2 gap-2 w-full max-w-xs">
        {[
          "CEC Rule References",
          "NBC Code Articles",
          "NFPA Standards",
          "Load Calculations",
          "Equipment Specs",
          "Permit Checklist",
        ].map((item) => (
          <div
            key={item}
            className="flex items-center gap-1.5 text-[11px] text-muted-foreground rounded-md border border-border/50 px-2.5 py-1.5"
          >
            <Zap className="h-2.5 w-2.5 text-primary/60 flex-shrink-0" />
            {item}
          </div>
        ))}
      </div>
    </div>
  );
}
