import { Metadata } from "next";

import { NotFoundPage } from "@/components/NotFoundPage";

export const metadata: Metadata = {
  title: "404 - Page Not Found | Hubra",
  description: "The page you're looking for doesn't exist. Navigate back to explore Solana tokens and DeFi data.",
  robots: {
    index: false,
    follow: true,
  },
};

export default function NotFound() {
  return <NotFoundPage />;
}
