/**
 * Token URL Utilities
 * @description Helper functions for converting token names to URL-friendly slugs
 */

/**
 * Convert token name to URL-friendly slug
 * @param name - Token name (e.g., "Bitcoin", "Wrapped SOL")
 * @returns URL-friendly slug (e.g., "bitcoin", "wrapped-sol")
 */
export function tokenNameToSlug(name: string): string {
  return name
    .toLowerCase()
    .trim()
    .replace(/\s+/g, "-") // Replace spaces with hyphens
    .replace(/[^\w-]/g, "") // Remove special characters except hyphens
    .replace(/-+/g, "-"); // Replace multiple hyphens with single hyphen
}

/**
 * Convert URL slug back to display name
 * @param slug - URL slug (e.g., "bitcoin", "wrapped-sol")
 * @returns Display name (e.g., "Bitcoin", "Wrapped Sol")
 */
export function slugToTokenName(slug: string): string {
  return slug
    .split("-")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
}
