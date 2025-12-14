/**
 * Rehype plugin to automatically center images in blog posts
 * - Wraps all images in centered divs
 * - Resolves relative image paths to /blog/ directory
 */
import type { Root, Element } from "hast";

import { visit } from "unist-util-visit";

/**
 * Normalize className to always be an array of strings
 */
function normalizeClassName(className: unknown): string[] {
  if (Array.isArray(className)) {
    return className.map(String);
  }
  if (typeof className === "string") {
    return [className];
  }

  return [];
}

export function rehypeCenterImages() {
  return (tree: Root) => {
    visit(tree, "element", (node: Element, index, parent) => {
      if (node.tagName !== "img" || !parent || typeof index !== "number" || !Array.isArray(parent.children)) {
        return;
      }

      // Resolve relative image paths to /blog/ directory
      const src = node.properties?.src;

      if (typeof src === "string" && src && !src.startsWith("/") && !src.startsWith("http")) {
        node.properties.src = `/blog/${src}`;
      }

      // Add image styling with centering
      const existingClass = normalizeClassName(node.properties?.className);

      node.properties.className = [...existingClass, "rounded-lg", "max-w-full", "h-auto", "mx-auto", "block"];

      // Wrap in centered container
      parent.children[index] = {
        type: "element",
        tagName: "div",
        properties: { className: ["my-6", "w-full", "flex", "justify-center"] },
        children: [node],
      };
    });
  };
}
