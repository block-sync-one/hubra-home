export function calculateReadingTime(content: string, wordsPerMinute: number = 225): number {
  const plainText = content.replace(/<[^>]*>/g, "");
  const words = plainText.trim().split(/\s+/).length;
  const minutes = Math.ceil(words / wordsPerMinute);

  return Math.max(1, minutes);
}

export function formatReadingTime(minutes: number): string {
  return `${minutes} min read`;
}

export function generateExcerpt(content: string, maxLength: number = 160): string {
  const plainText = content.replace(/<[^>]*>/g, " ");
  const cleaned = plainText.replace(/\s+/g, " ").trim();

  if (cleaned.length <= maxLength) {
    return cleaned;
  }

  const truncated = cleaned.substring(0, maxLength);
  const lastSpace = truncated.lastIndexOf(" ");

  return lastSpace > 0 ? truncated.substring(0, lastSpace) + "..." : truncated + "...";
}

export function formatDate(date: string | Date, format: "long" | "short" | "medium" = "long"): string {
  const dateObj = typeof date === "string" ? new Date(date) : date;

  const formats = {
    long: { month: "long", day: "numeric", year: "numeric" } as Intl.DateTimeFormatOptions,
    medium: { month: "short", day: "numeric", year: "numeric" } as Intl.DateTimeFormatOptions,
    short: { month: "numeric", day: "numeric", year: "numeric" } as Intl.DateTimeFormatOptions,
  };

  return dateObj.toLocaleDateString("en-US", formats[format]);
}
