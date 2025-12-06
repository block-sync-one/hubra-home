"use client";

import Link from "next/link";
import { Button } from "@heroui/react";
import { Home, TrendingUp } from "lucide-react";

import { siteConfig } from "@/config/site";

export default function NotFoundClient() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[80vh] px-4 py-12">
      <div className="max-w-2xl w-full text-center space-y-8">
        <div className="relative">
          <h1 className="text-[150px] md:text-[200px] font-bold text-transparent bg-clip-text bg-gradient-to-r from-white via-primary to-primary-400 animate-pulse leading-none">
            404
          </h1>
          <div className="absolute inset-0 blur-3xl opacity-30 bg-gradient-to-r from-white via-primary to-primary-400" />
        </div>

        <div className="space-y-4">
          <h2 className="text-3xl md:text-4xl font-bold text-white">Page Not Found</h2>
          <p className="text-lg text-gray-400 max-w-md mx-auto">
            Looks like this page took a trip to another blockchain. Let&apos;s get you back on track.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center pt-4">
          <Button
            as={Link}
            className="bg-white text-black hover:bg-gray-100 font-medium min-w-[160px]"
            href="/"
            radius="full"
            size="lg"
            startContent={<Home size={20} />}>
            Go Home
          </Button>
          <Button
            as={Link}
            className="backdrop-blur-md bg-white/10 hover:bg-white/20 text-white font-medium min-w-[160px]"
            href="/tokens"
            radius="full"
            size="lg"
            startContent={<TrendingUp size={20} />}
            variant="flat">
            View Tokens
          </Button>
        </div>

        <div className="pt-8 border-t border-white/10">
          <div className="flex flex-wrap justify-center gap-4">
            <Link className="text-sm text-gray-400 hover:text-white transition-colors" href="/tokens">
              Tokens
            </Link>
            <span className="text-gray-600">•</span>
            <Link className="text-sm text-gray-400 hover:text-white transition-colors" href="/blog">
              Blog
            </Link>
            <span className="text-gray-600">•</span>
            <Link className="text-sm text-gray-400 hover:text-white transition-colors" href={siteConfig.links.docs}>
              Docs
            </Link>
            <span className="text-gray-600">•</span>
            <Link className="text-sm text-gray-400 hover:text-white transition-colors" href={siteConfig.links.app}>
              Launch App
            </Link>
          </div>
        </div>

        <div className="absolute top-20 left-10 w-32 h-32 bg-primary/10 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-20 right-10 w-40 h-40 bg-primary-400/10 rounded-full blur-3xl animate-pulse delay-1000" />
      </div>
    </div>
  );
}
