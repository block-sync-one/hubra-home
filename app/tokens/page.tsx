"use client";

import React from "react";

import Tokens from "@/app/tokens/Tokens";
import AllTokens from "@/app/tokens/AllTokens";
import HotTokens from "@/app/tokens/HotTokens";

export default function TokensPage() {
  return (
    <main className="flex flex-col gap-12 md:max-w-7xl mx-auto">
      <Tokens />
      <HotTokens />
      <AllTokens />
    </main>
  );
}
