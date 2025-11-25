"use client";

/**
 * MDXContent Component
 * Renders compiled MDX with React components support
 */

import { MDXProvider } from "@mdx-js/react";
import { useMemo } from "react";
import * as runtime from "react/jsx-runtime";

import { getMDXComponents } from "../mdx/mdx-components";

interface MDXContentProps {
  code: string;
  components?: Record<string, React.ComponentType<any>>;
}

/**
 * Evaluate compiled MDX code and render it with custom components
 */
export function MDXContent({ code, components: customComponents = {} }: MDXContentProps) {
  const mdxComponents = getMDXComponents(customComponents);

  // Evaluate the compiled MDX code
  const Content = useMemo(() => {
    try {
      // The compiled MDX with outputFormat: "function-body" returns a function
      // that when called returns the MDX component
      const keys = Object.keys(runtime);
      const values = Object.values(runtime);

      // Create and execute the function with the compiled MDX code
      const mdxModule = new Function(...keys, code)(...values);

      // The function returns the MDX component directly
      return mdxModule;
    } catch (error) {
      console.error("Error evaluating MDX:", error);
      console.error("Code that failed:", code?.substring(0, 200));

      return () => (
        <div className="rounded-lg bg-red-900/20 border border-red-500/50 p-4 text-red-300">
          <p className="font-semibold">Error rendering MDX content</p>
          <p className="text-sm mt-2">Please check the console for details.</p>
        </div>
      );
    }
  }, [code]);

  return (
    <MDXProvider components={mdxComponents}>
      <div className="mdx-content">
        <Content components={mdxComponents} />
      </div>
    </MDXProvider>
  );
}

/**
 * Fallback for when MDX content is provided as HTML (backward compatibility)
 */
export function HTMLContent({ html }: { html: string }) {
  return (
    <div
      dangerouslySetInnerHTML={{ __html: html }}
      className="prose prose-invert prose-lg max-w-none
        prose-headings:text-white prose-headings:font-bold
        prose-h1:text-4xl prose-h2:text-3xl prose-h2:border-b prose-h2:border-gray-800 prose-h2:pb-2 prose-h3:text-2xl
        prose-p:text-gray-300 prose-p:leading-relaxed prose-p:mb-6
        prose-a:text-primary-500 prose-a:underline hover:prose-a:text-primary-400 hover:prose-a:no-underline
        prose-strong:text-white prose-strong:font-bold
        prose-em:text-gray-200 prose-em:italic
        prose-code:text-primary-400 prose-code:bg-gray-900 prose-code:px-2 prose-code:py-1 prose-code:rounded prose-code:font-mono prose-code:text-sm prose-code:border prose-code:border-gray-800
        prose-pre:bg-gray-900 prose-pre:border prose-pre:border-gray-800 prose-pre:rounded-lg prose-pre:p-4
        prose-ul:text-gray-300 prose-ul:list-disc prose-ul:ml-6 prose-ul:mb-6 prose-ul:marker:text-primary-500
        prose-ol:text-gray-300 prose-ol:list-decimal prose-ol:ml-6 prose-ol:mb-6 prose-ol:marker:text-primary-500
        prose-li:text-gray-300 prose-li:mb-2 prose-li:pl-2
        prose-blockquote:border-l-4 prose-blockquote:border-l-primary-500 prose-blockquote:text-gray-400 prose-blockquote:bg-card prose-blockquote:pl-6 prose-blockquote:py-4 prose-blockquote:rounded-r-lg prose-blockquote:italic
        prose-img:rounded-xl prose-img:shadow-lg
        prose-hr:border-gray-800 prose-hr:my-8
        prose-table:border prose-table:border-gray-800 prose-table:rounded-lg prose-table:my-8
        prose-th:bg-card prose-th:text-white prose-th:font-semibold prose-th:p-3
        prose-td:text-gray-300 prose-td:p-3 prose-td:border-t prose-td:border-gray-800"
    />
  );
}
