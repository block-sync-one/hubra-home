import remarkGfm from "remark-gfm";
import rehypeHighlight from "rehype-highlight";
import rehypeSlug from "rehype-slug";
import rehypeAutolinkHeadings from "rehype-autolink-headings";
import { unified } from "unified";
import remarkParse from "remark-parse";
import remarkRehype from "remark-rehype";
import rehypeStringify from "rehype-stringify";

/**
 * Convert MDX/Markdown to HTML string
 * Uses remark and rehype for processing
 * Supports syntax highlighting, auto-linking, and GFM
 */
export async function mdxToHtml(source: string): Promise<string> {
  try {
    const result = await unified()
      .use(remarkParse) // Parse markdown
      .use(remarkGfm) // GitHub Flavored Markdown
      .use(remarkRehype) // Convert to HTML AST
      .use(rehypeSlug) // Add IDs to headings
      .use(rehypeAutolinkHeadings) // Add links to headings
      .use(rehypeHighlight) // Syntax highlighting
      .use(rehypeStringify) // Convert to HTML string
      .process(source);

    return String(result);
  } catch (error) {
    console.error("MDX processing error:", error);
    throw new Error("Failed to process MDX content");
  }
}

/**
 * Alias for backward compatibility
 */
export async function compileMDX(source: string): Promise<string> {
  return mdxToHtml(source);
}
