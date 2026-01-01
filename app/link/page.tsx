"use client";

import { useEffect } from "react";
import { Loader2 } from "lucide-react";

import { siteConfig } from "@/config/site";

export default function SmartLinkRedirect() {
  useEffect(() => {
    if (typeof window === "undefined") return;

    async function detectAndRedirect() {
      let isSeeker = false;

      if ("userAgentData" in navigator && navigator.userAgentData) {
        try {
          const hints = await (navigator.userAgentData as any).getHighEntropyValues(["model", "platform"]);
          const model = hints.model?.toLowerCase() || "";

          isSeeker = model === "seeker" || model.includes("seeker");
        } catch (error: any) {}
      }

      const { solanaDappStore, app } = siteConfig.links;

      if (isSeeker) {
        const opened = window.open(solanaDappStore, "_blank");

        if (opened) {
          opened.focus();
        } else {
          window.location.href = app;
        }
      } else {
        window.location.href = app;
      }
    }

    detectAndRedirect();
  }, []);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen">
      <Loader2 className="w-12 h-12 text-primary animate-spin" />
      <p className="text-gray-400 mt-4">Redirecting...</p>
    </div>
  );
}
