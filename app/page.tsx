"use client";
import { HeroSection } from "@/components/HeroSection";
import { MainContentSection } from "@/components/MainContent";

export default function Home() {
  return (
    <section className="w-full flex flex-col items-center justify-center gap-20">
      <HeroSection />
      <MainContentSection />
    </section>
  );
}
