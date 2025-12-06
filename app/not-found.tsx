import { Metadata } from "next";

import NotFoundClient from "./NotFoundClient";

export const metadata: Metadata = {
  title: "404 - Page Not Found",
  description: "The page you're looking for doesn't exist. Navigate back to explore Solana tokens and DeFi data.",
  robots: {
    index: false,
    follow: true,
  },
};

export default function NotFound() {
  return <NotFoundClient />;
}
