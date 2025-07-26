export type SiteConfig = typeof siteConfig;

export const siteConfig = {
  name: "Hubra",
  description: "Hubra - the power of CEX, the freedom of DeFi",
  longDescription: "Hubra is your Solana all-in-one portal to the decentralized world — delivering a seamless, CEX-grade experience without compromising on security, trust, or speed.",
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
    "Web3"
  ],
  url: "https://hubra.com", // Update with your actual domain
  ogImage: "/image/hubra-og-image.png", // Using existing hubra image
  twitterHandle: "@HubraApp", // Update with your actual Twitter handle
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
    github: "https://github.com/heroui-inc/heroui",
    twitter: "https://twitter.com/hero_ui",
    docs: "https://heroui.com",
    discord: "https://discord.gg/9b6yyZKmH4",
    sponsor: "https://patreon.com/jrgarciadev",
  },
};
