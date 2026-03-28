"use client";

import { cn } from "@/lib/utils";

const SECTION_COLORS: Record<string, string> = {
  "project overview":   "text-cyan-700    dark:text-cyan-300",
  "applicable codes":   "text-amber-700   dark:text-amber-300",
  "power distribution": "text-violet-700  dark:text-violet-300",
  "load calculations":  "text-emerald-700 dark:text-emerald-300",
  "service entrance":   "text-sky-700     dark:text-sky-300",
  "emergency":          "text-rose-700    dark:text-rose-300",
  "lighting":           "text-yellow-700  dark:text-yellow-300",
  "fire alarm":         "text-orange-700  dark:text-orange-300",
  "special systems":    "text-indigo-700  dark:text-indigo-300",
  "grounding":          "text-teal-700    dark:text-teal-300",
  "equipment":          "text-purple-700  dark:text-purple-300",
  "inspection":         "text-lime-700    dark:text-lime-300",
};

function getSectionColor(heading: string): string {
  const lower = heading.toLowerCase();
  for (const [key, color] of Object.entries(SECTION_COLORS)) {
    if (lower.includes(key)) return color;
  }
  return "text-foreground";
}

interface BlueprintNavProps {
  sections: { title: string; slug: string }[];
  activeSection: string;
  onSelect: (slug: string) => void;
  /** Renders as a horizontal scrollable pill row instead of vertical list */
  horizontal?: boolean;
}

export function BlueprintNav({ sections, activeSection, onSelect, horizontal = false }: BlueprintNavProps) {
  if (sections.length === 0) return null;

  if (horizontal) {
    return (
      <nav aria-label="Blueprint sections" className="overflow-x-auto scrollbar-none">
        <ul className="flex gap-1.5 px-4 py-2">
          {sections.map(({ title, slug }, i) => {
            const isActive = activeSection === slug;
            return (
              <li key={slug} className="shrink-0">
                <button
                  role="tab"
                  aria-selected={isActive}
                  onClick={() => onSelect(slug)}
                  className={cn(
                    "flex items-center gap-1.5 rounded-full border px-3 py-1 text-[11px] font-medium whitespace-nowrap transition-all",
                    "focus-visible:outline-2 focus-visible:outline-ring",
                    getSectionColor(title),
                    isActive
                      ? "border-current bg-current/10 opacity-100"
                      : "border-border opacity-50 hover:opacity-80"
                  )}
                >
                  <span className="font-mono text-[9px] tabular-nums opacity-60">
                    {(i + 1).toString().padStart(2, "0")}
                  </span>
                  {title}
                </button>
              </li>
            );
          })}
        </ul>
      </nav>
    );
  }

  return (
    <nav aria-label="Blueprint sections">
      <p className="px-3 mb-2 text-[9px] font-semibold uppercase tracking-widest text-muted-foreground">
        Sections
      </p>
      <ul>
        {sections.map(({ title, slug }, i) => {
          const isActive = activeSection === slug;
          return (
            <li key={slug}>
              <button
                role="tab"
                aria-selected={isActive}
                onClick={() => onSelect(slug)}
                className={cn(
                  "w-full text-left flex items-start gap-2.5 border-l-2 pl-3 pr-3 py-1.5 transition-all",
                  "focus-visible:outline-2 focus-visible:outline-ring",
                  getSectionColor(title),
                  isActive
                    ? "border-current opacity-100 bg-current/5"
                    : "border-transparent opacity-40 hover:opacity-75 hover:bg-current/5"
                )}
              >
                <span className="font-mono text-[9px] tabular-nums opacity-60 w-4 text-right shrink-0 mt-[3px] leading-none">
                  {(i + 1).toString().padStart(2, "0")}
                </span>
                <span className="text-[11px] font-medium leading-snug">{title}</span>
              </button>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
