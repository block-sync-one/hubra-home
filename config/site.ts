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
        },
      ],
    },
    {
      label: "Stats",
      href: "/stats",
    },
  ],
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
    },
    {
      label: "DeFi",
      href: "/defi",
    },
    {
      label: "Stats",
      href: "/stats",
    },
    // {
    //   label: "Launch App",
    //   href: "https://patreon.com/jrgarciadev",
    //   external: true,
    // },
  ],
  links: {
    app: "https://hubra.app",
    github: "https://github.com/block-sync-one/hubra-app",
    twitter: "https://twitter.com/hubrapp",
    docs: "https://docs.hubra.app",
    discord: "https://discord.gg/62NFPhpHtH",
  },
};
