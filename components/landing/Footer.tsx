import Image from "next/image";
import Link from "next/link";
import { Icon } from "@iconify/react";

type FooterLink = {
  label: string;
  href: string;
  external?: boolean;
  disabled?: boolean;
};

const columns: { title: string; links: FooterLink[] }[] = [
  {
    title: "Product",
    links: [
      { label: "Web App", href: "https://hubra.app", external: true },
      { label: "Docs", href: "https://docs.hubra.app", external: true },
      { label: "Download App (soon)", href: "#", disabled: true },
    ],
  },
  {
    title: "Community",
    links: [
      { label: "Discord", href: "https://discord.hubra.app", external: true },
      { label: "Telegram", href: "https://t.me/hubraapp", external: true },
      { label: "X (Twitter)", href: "https://x.com/HubraApp", external: true },
    ],
  },
  {
    title: "Resources",
    links: [
      { label: "GitHub", href: "https://github.com/block-sync-one/hubra-home", external: true },
      { label: "Blog", href: "/blog" },
    ],
  },
];

const socials = [
  { icon: "prime:twitter", href: "https://x.com/HubraApp" },
  { icon: "ri:github-fill", href: "https://github.com/block-sync-one/hubra-home" },
  { icon: "ri:discord-fill", href: "https://discord.hubra.app" },
];

export function Footer() {
  return (
    <footer className="w-full">
      <div className="mx-auto max-w-[1200px] px-6 py-16 md:py-20">
        <div className="flex flex-col md:flex-row gap-14 md:gap-8 justify-between">
          <div className="flex flex-col gap-5 max-w-xs">
            <div className="inline-flex items-center gap-2.5">
              <Image alt="Hubra" className="rounded-none" height={24} src="/logo.png" width={24} />
              <span className="text-white font-semibold text-base">Hubra</span>
            </div>
            <p className="text-white/35 text-sm leading-relaxed">
              Your own AI DeFi agent on Solana. Non-custodial, permissioned, transparent.
            </p>
            <div className="inline-flex items-center gap-5 mt-1">
              {socials.map((s) => (
                <Link key={s.icon} href={s.href} rel="noopener noreferrer" target="_blank">
                  <Icon className="w-5 h-5 text-white/25 hover:text-white/60 transition-colors" icon={s.icon} />
                </Link>
              ))}
            </div>
          </div>

          <div className="flex flex-wrap gap-x-16 gap-y-10">
            {columns.map((col) => (
              <div key={col.title} className="flex flex-col gap-4 min-w-[120px]">
                <span className="text-white/70 text-sm font-medium">{col.title}</span>
                <div className="flex flex-col gap-3">
                  {col.links.map((link) =>
                    link.disabled ? (
                      <span key={link.label} className="text-white/20 text-sm cursor-not-allowed">
                        {link.label}
                      </span>
                    ) : (
                      <Link
                        key={link.label}
                        className="text-white/40 hover:text-white/70 text-sm transition-colors"
                        href={link.href}
                        {...(link.external ? { target: "_blank", rel: "noopener noreferrer" } : {})}>
                        {link.label}
                      </Link>
                    )
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-16 pt-8 border-t border-white/[0.04] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <span className="text-white/20 text-xs">&copy; {new Date().getFullYear()} Hubra. All rights reserved.</span>
          <span className="text-white/20 text-xs">Built on Solana</span>
        </div>
      </div>
    </footer>
  );
}
