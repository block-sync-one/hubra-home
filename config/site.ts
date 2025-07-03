export type SiteConfig = typeof siteConfig;

export const siteConfig = {
  name: "Hubra",
  description: "Hubra, your solana hub",
  navItems: [
    {
      label: "Home",
      href: "/",
    },
    
    {
      label: "Resources",
      description: "Learn more about Hubra",
      navItems: [
        {
          icon: 'mdi:docs',
          label: "Docs",
          href: "/docs",
        },
        {
          icon: 'mdi:blog',
          label: "Blog",
          href: "/blog",
        }
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
      label: "Learn",
      href: "/learn",
    },
    {
      label: "Stats",
      href: "/stats",
    },
  ],
  navMenuItems: [
    {
      label: "Profile",
      href: "/profile",
    },
    {
      label: "Dashboard",
      href: "/dashboard",
    },
    {
      label: "Projects",
      href: "/projects",
    },
    {
      label: "Team",
      href: "/team",
    },
    {
      label: "Calendar",
      href: "/calendar",
    },
    {
      label: "Settings",
      href: "/settings",
    },
    {
      label: "Help & Feedback",
      href: "/help-feedback",
    },
    {
      label: "Logout",
      href: "/logout",
    },
  ],
  links: {
    github: "https://github.com/heroui-inc/heroui",
    twitter: "https://twitter.com/hero_ui",
    docs: "https://heroui.com",
    discord: "https://discord.gg/9b6yyZKmH4",
    sponsor: "https://patreon.com/jrgarciadev",
  },
};
