import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function slugifySection(text: string): string {
  return "section-" + text.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/, "");
}
