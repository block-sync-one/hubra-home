import { Metadata } from "next";

import { BP2025Landing } from "./BP2025Landing";

export const metadata: Metadata = {
  title: "BP-2025 Competition - Win $250 | Hubra",
  description:
    "Try Hubra, get a chance to win $250! Download the app, create an account, and open an Earn position or stake on raSOL to enter.",
  openGraph: {
    title: "BP-2025 Competition - Win $250 | Hubra",
    description:
      "Try Hubra, get a chance to win $250! Download the app, create an account, and open an Earn position or stake on raSOL to enter.",
    type: "website",
  },
};

export default function BP2025Page() {
  return <BP2025Landing />;
}
