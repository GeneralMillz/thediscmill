/**
 * Canonical brand slug utility — single source of truth for all brand-to-URL conversions.
 *
 * Rules:
 *   1. Lowercase everything
 *   2. Replace any run of non-alphanumeric characters with a single hyphen
 *   3. Strip leading/trailing hyphens
 *
 * Examples:
 *   "Innova Champion Discs" → "innova-champion-discs"
 *   "MVP Disc Sports"       → "mvp-disc-sports"
 *   "EV-7"                  → "ev-7"
 *   "Above Ground Level"    → "above-ground-level"
 */
export function brandSlug(name: string): string {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '');
}
