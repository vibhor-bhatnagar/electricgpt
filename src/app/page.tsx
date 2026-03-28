"use client";

import { useState, useCallback, useMemo, useEffect } from "react";
import { BlueprintForm } from "@/components/blueprint-form";
import { BlueprintDisplay } from "@/components/blueprint-display";
import { BlueprintNav } from "@/components/blueprint-nav";
import { generateBlueprint, type BlueprintParams } from "@/lib/blueprint-engine";
import { ThemeControls } from "@/components/theme-controls";
import { slugifySection } from "@/lib/utils";
import { Zap } from "lucide-react";

export default function Home() {
  const [content, setContent] = useState("");
  const [status, setStatus] = useState<"ready" | "generating" | "done" | "error">("ready");
  const [activeSection, setActiveSection] = useState<string>("");

  const handleGenerate = useCallback((params: BlueprintParams) => {
    setStatus("generating");
    setActiveSection("");
    setTimeout(() => {
      try {
        const blueprint = generateBlueprint(params);
        setContent(blueprint);
        setStatus("done");
      } catch {
        setStatus("error");
      }
    }, 80);
  }, []);

  // Parse sections from the full content
  const sections = useMemo(
    () =>
      content
        .split("\n")
        .filter((l) => l.startsWith("# "))
        .map((l) => {
          const title = l.replace(/^# /, "").trim();
          return { title, slug: slugifySection(title) };
        }),
    [content]
  );

  // Always select the first section whenever new content arrives
  useEffect(() => {
    if (sections.length > 0) {
      setActiveSection(sections[0].slug);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [content]);

  const hasContent = content.length > 0;
  const displayStatus =
    status === "generating" ? "streaming" :
    status === "error"      ? "error"     : "ready";

  return (
    <div className="flex flex-col min-h-screen bg-background">
      {/* ── Header ── */}
      <header className="flex-shrink-0 border-b border-border bg-card/60 backdrop-blur-sm sticky top-0 z-20">
        <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 h-14 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/20 border border-primary/40">
              <Zap className="h-4 w-4 text-primary" />
            </div>
            <div>
              <span className="text-sm font-bold text-foreground tracking-tight">
                Electric<span className="text-primary">GPT</span>
              </span>
              <span className="hidden sm:inline text-xs text-muted-foreground ml-2">
                Electrical Engineering Design Ideation
              </span>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <span className="hidden md:flex items-center gap-1.5 text-[10px] text-muted-foreground border border-border rounded-full px-2.5 py-1">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
              CEC · NBC · NFPA
            </span>
            <ThemeControls />
          </div>
        </div>
      </header>

      {/* ── Hero ── */}
      <section className="relative flex-shrink-0 overflow-hidden border-b border-border">
        <div className="hero-grid absolute inset-0 opacity-20 pointer-events-none" />
        <div className="relative max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-10">
          <div className="max-w-2xl">
            <div className="flex items-center gap-2 mb-3">
              <span className="inline-flex items-center gap-1.5 rounded-full border border-primary/30 bg-primary/10 px-3 py-1 text-xs font-medium text-primary">
                <Zap className="h-3 w-3" />
                Document-Referenced · Canadian Standards
              </span>
            </div>
            <h1 className="text-3xl sm:text-4xl font-bold text-foreground tracking-tight leading-tight mb-2">
              Electrical Engineering{" "}
              <span className="text-primary">Design Blueprint</span>{" "}
              Generator
            </h1>
            <p className="text-sm text-muted-foreground leading-relaxed max-w-xl">
              Generate comprehensive electrical design blueprints referencing{" "}
              <span className="text-foreground font-medium">CEC</span>,{" "}
              <span className="text-foreground font-medium">NBC</span>, and{" "}
              <span className="text-foreground font-medium">NFPA</span> standards.
              Configure your project below.
            </p>
          </div>
        </div>
      </section>

      {/* ── Project Parameters strip ── */}
      <div className="flex-shrink-0 border-b border-border bg-card/80 backdrop-blur-sm">
        <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <BlueprintForm
            onGenerate={handleGenerate}
            isLoading={status === "generating"}
          />
        </div>
      </div>

      {/* ── Main: sticky nav + blueprint ── */}
      <main className="flex-1">
        <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex gap-6 items-start">

            {/* Sticky vertical nav — only shown when content exists */}
            {hasContent && (
              <aside className="hidden lg:block w-[200px] shrink-0 sticky top-[3.75rem]">
                <div className="border border-border rounded-lg bg-card shadow-sm py-3">
                  <BlueprintNav
                    sections={sections}
                    activeSection={activeSection}
                    onSelect={setActiveSection}
                  />
                </div>
              </aside>
            )}

            {/* Blueprint display — full remaining width */}
            <div className="flex-1 min-w-0 flex flex-col gap-3">
              {/* Mobile horizontal nav (hidden on lg+) */}
              {hasContent && (
                <div className="lg:hidden border border-border rounded-lg bg-card shadow-sm overflow-hidden">
                  <BlueprintNav
                    sections={sections}
                    activeSection={activeSection}
                    onSelect={setActiveSection}
                    horizontal
                  />
                </div>
              )}
              <BlueprintDisplay
                content={content}
                status={displayStatus}
                error={
                  status === "error"
                    ? new Error("Failed to generate blueprint. Please try again.")
                    : undefined
                }
                activeSection={activeSection}
                totalSections={sections.length}
              />
            </div>

          </div>
        </div>
      </main>

      {/* ── Footer ── */}
      <footer className="flex-shrink-0 border-t border-border py-4">
        <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-2">
          <p className="text-[11px] text-muted-foreground">
            ElectricGPT — For professional reference only. Always verify with your local AHJ and licensed engineer.
          </p>
          <p className="text-[11px] text-muted-foreground">
            CEC CSA C22.1:24 · NBC 2020 · NFPA 72/101/110 · CSA C282
          </p>
        </div>
      </footer>
    </div>
  );
}
