"use client";

import { useEffect } from "react";
import { Loader2 } from "lucide-react";

import { siteConfig } from "@/config/site";

export default function SmartLinkRedirect() {
  useEffect(() => {
    if (typeof window === "undefined") return;

    const ua = navigator.userAgent.toLowerCase();
    const isSeeker = ua.includes("seeker") || ua.includes("solanamobile/seeker");
    const isAndroid = ua.includes("android");

    const { solanaDappStore, googlePlay, app } = siteConfig.links;

    if (isSeeker) {
      window.location.href = solanaDappStore;
    } else if (isAndroid) {
      window.location.href = googlePlay;
    } else {
      window.location.href = app;
    }
  }, []);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen">
      <Loader2 className="w-12 h-12 text-primary animate-spin" />
      <p className="text-gray-400 mt-4">Redirecting...</p>
    </div>
  );
}
