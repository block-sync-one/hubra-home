type NavItem = {
  label: string;
  href?: string;
  show?: boolean;
  description?: string;
  navItems?: {
    icon?: string;
    label: string;
    href: string;
  }[];
};

export type SiteConfig = typeof siteConfig;

export const siteConfig = {
  name: "Hubra",
  description: "Hubra - the power of CEX, the freedom of DeFi",
  longDescription:
    " Hubra is your Solana all-in-one portal to the decentralized world - delivering a seamless, CEX-grade experience without compromising on security, trust, or speed.",
  keywords: [
    "Solana",
    "DeFi",
    "cryptocurrency",
    "blockchain",
    "tokens",
    "SOL",
    "decentralized finance",
    "crypto trading",
    "Solana ecosystem",
    "blockchain analytics",
    "crypto portfolio",
    "Web3",
  ],
  url: "https://hubra.app",
  ogImage: "/hubra-og-image.png",
  twitter: {
    handle: "@hubraApp",
    site: "@hubraApp",
  },
  navItems: [
    {
      label: "Home",
      href: "/",
    },
    {
      label: "Tokens",
      href: "/tokens",
      show: true,
    },
    {
      label: "Blog",
      href: "/blog",
      show: true,
    },
    {
      label: "DeFi",
      href: "/defi",
    },
    {
      label: "Resources",
      description: "Learn more about Hubra",
      navItems: [
        {
          icon: "mdi:docs",
          label: "Docs",
          href: "/docs",
        },
        {
          icon: "mdi:blog",
          label: "Blog",
          href: "/blog",
          show: true,
        },
      ],
    },
    {
      label: "Stats",
      href: "/stats",
    },
  ] as NavItem[],
  navMenuItems: [
    {
      label: "Resources",
      navItems: [
        {
          icon: "mdi:docs",
          label: "Docs",
          href: "/docs",
        },
        {
          icon: "mdi:blog",
          label: "Blog",
          href: "/blog",
        },
      ],
    },
    {
      label: "Tokens",
      href: "/tokens",
      show: true,
    },
    {
      label: "DeFi",
      href: "/defi",
    },
    {
      label: "Stats",
      href: "/stats",
    },
  ] as NavItem[],
  links: {
    app: "https://hubra.app",
    github: "https://github.com/block-sync-one/hubra-app",
    twitter: "https://twitter.com/hubrapp",
    docs: "https://docs.hubra.app",
    discord: "https://discord.gg/62NFPhpHtH",
  },
};
