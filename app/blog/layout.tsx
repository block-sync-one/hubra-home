/**
 * Blog Layout Component
 *
 * Wraps all blog pages with consistent padding
 * Metadata is defined in individual pages for better control
 */
export default function BlogLayout({ children }: { children: React.ReactNode }) {
  return <section className="py-6 md:py-11">{children}</section>;
}
