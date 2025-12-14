/**
 * MDX Components
 * Custom components for rendering MDX content with enhanced styling
 */

import type { MDXComponents } from "mdx/types";

import Image from "next/image";
import Link from "next/link";

/**
 * Custom MDX components mapping
 * These components will be used when rendering MDX content
 */
export function getMDXComponents(components?: MDXComponents): MDXComponents {
  return {
    // Custom heading components with anchor links
    h1: ({ children, ...props }) => (
      <h1 className="mb-6 mt-8 text-4xl font-bold tracking-tight text-white first:mt-0" {...props}>
        {children}
      </h1>
    ),
    h2: ({ children, ...props }) => (
      <h2 className="mb-4 mt-8 text-3xl font-semibold tracking-tight text-white" {...props}>
        {children}
      </h2>
    ),
    h3: ({ children, ...props }) => (
      <h3 className="mb-3 mt-6 text-2xl font-semibold tracking-tight text-white" {...props}>
        {children}
      </h3>
    ),
    h4: ({ children, ...props }) => (
      <h4 className="mb-2 mt-4 text-xl font-semibold text-white" {...props}>
        {children}
      </h4>
    ),
    h5: ({ children, ...props }) => (
      <h5 className="mb-2 mt-4 text-lg font-semibold text-white" {...props}>
        {children}
      </h5>
    ),
    h6: ({ children, ...props }) => (
      <h6 className="mb-2 mt-4 text-base font-semibold text-white" {...props}>
        {children}
      </h6>
    ),

    // Paragraph with proper spacing
    p: ({ children, ...props }) => (
      <p className="mb-4 leading-7 text-gray-300" {...props}>
        {children}
      </p>
    ),

    // Links with Next.js Link component
    a: ({ href, children, ...props }) => {
      const isExternal = href?.startsWith("http");
      const isAnchor = href?.startsWith("#");

      if (isExternal) {
        return (
          <a
            className="font-medium text-blue-400 underline decoration-blue-400/30 underline-offset-4 transition-colors hover:text-blue-300 hover:decoration-blue-300/50"
            href={href}
            rel="noopener noreferrer"
            target="_blank"
            {...props}>
            {children}
          </a>
        );
      }

      if (isAnchor) {
        return (
          <a
            className="font-medium text-blue-400 underline decoration-blue-400/30 underline-offset-4 transition-colors hover:text-blue-300 hover:decoration-blue-300/50"
            href={href}
            {...props}>
            {children}
          </a>
        );
      }

      return (
        <Link
          className="font-medium text-blue-400 underline decoration-blue-400/30 underline-offset-4 transition-colors hover:text-blue-300 hover:decoration-blue-300/50"
          href={href || "#"}
          {...props}>
          {children}
        </Link>
      );
    },

    // Code blocks with syntax highlighting
    code: ({ children, className, ...props }) => {
      const isInline = !className;

      if (isInline) {
        return (
          <code className="rounded bg-gray-800 px-1.5 py-0.5 font-mono text-sm text-pink-400" {...props}>
            {children}
          </code>
        );
      }

      return (
        <code className={className} {...props}>
          {children}
        </code>
      );
    },

    pre: ({ children, ...props }) => (
      <pre className="mb-4 overflow-x-auto rounded-lg bg-gray-900 p-4 text-sm" {...props}>
        {children}
      </pre>
    ),

    // Lists
    ul: ({ children, ...props }) => (
      <ul className="mb-4 ml-6 list-disc space-y-2 text-gray-300" {...props}>
        {children}
      </ul>
    ),
    ol: ({ children, ...props }) => (
      <ol className="mb-4 ml-6 list-decimal space-y-2 text-gray-300" {...props}>
        {children}
      </ol>
    ),
    li: ({ children, ...props }) => (
      <li className="leading-7" {...props}>
        {children}
      </li>
    ),

    // Blockquote
    blockquote: ({ children, ...props }) => (
      <blockquote className="mb-4 border-l-4 border-blue-500 bg-gray-800/50 py-2 pl-4 pr-4 italic text-gray-300" {...props}>
        {children}
      </blockquote>
    ),

    // Tables
    table: ({ children, ...props }) => (
      <div className="mb-4 overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-700" {...props}>
          {children}
        </table>
      </div>
    ),
    thead: ({ children, ...props }) => (
      <thead className="bg-gray-800" {...props}>
        {children}
      </thead>
    ),
    tbody: ({ children, ...props }) => (
      <tbody className="divide-y divide-gray-700 bg-gray-900/50" {...props}>
        {children}
      </tbody>
    ),
    tr: ({ children, ...props }) => <tr {...props}>{children}</tr>,
    th: ({ children, ...props }) => (
      <th className="px-4 py-3 text-left text-sm font-semibold text-white" {...props}>
        {children}
      </th>
    ),
    td: ({ children, ...props }) => (
      <td className="px-4 py-3 text-sm text-gray-300" {...props}>
        {children}
      </td>
    ),

    // Horizontal rule
    hr: (props) => <hr className="my-8 border-gray-700" {...props} />,

    // Supports custom dimensions via HTML attributes in MDX:
    // <img src="image.jpg" alt="Description" width="800" height="600" />
    img: ({ src, alt, width, height, ...props }) => {
      if (!src) return null;

      // Parse dimensions to numbers if they're strings, or use defaults
      const imageWidth = width ? (typeof width === "string" ? parseInt(width, 10) : width) : 800;
      const imageHeight = height ? (typeof height === "string" ? parseInt(height, 10) : height) : 400;

      // Check if image is external (starts with http:// or https://)
      const isExternalImage = typeof src === "string" && (src.startsWith("http://") || src.startsWith("https://"));

      return (
        <div className="my-6 flex justify-center">
          <Image
            alt={alt || ""}
            className="rounded-lg"
            height={imageHeight}
            src={src}
            unoptimized={isExternalImage}
            width={imageWidth}
            {...props}
          />
        </div>
      );
    },

    // Strong/Bold
    strong: ({ children, ...props }) => (
      <strong className="font-semibold text-white" {...props}>
        {children}
      </strong>
    ),

    // Emphasis/Italic
    em: ({ children, ...props }) => (
      <em className="italic text-gray-200" {...props}>
        {children}
      </em>
    ),

    // Allow custom components to override defaults
    ...components,
  };
}
