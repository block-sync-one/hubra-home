import { remark } from "remark";
import remarkGfm from "remark-gfm";
import remarkHtml from "remark-html";

export async function mdxToHtml(source: string): Promise<string> {
  try {
    const result = await remark().use(remarkGfm).use(remarkHtml, { sanitize: false }).process(source);

    return String(result);
  } catch {
    throw new Error("Failed to compile MDX content");
  }
}
