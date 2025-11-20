export function calculateReadingTime(content: string, wordsPerMinute: number = 225): number {
  const plainText = content.replace(/<[^>]*>/g, "");
  const words = plainText.trim().split(/\s+/).length;
  const minutes = Math.ceil(words / wordsPerMinute);

  return Math.max(1, minutes);
}

export function calculateWordCount(content: string): number {
  const plainText = content.replace(/<[^>]*>/g, " ");
  const cleaned = plainText.replace(/\s+/g, " ").trim();
  const words = cleaned.split(/\s+/).filter((word) => word.length > 0);

  return words.length;
}

export function formatReadingTime(minutes: number): string {
  return `${minutes} min read`;
}
