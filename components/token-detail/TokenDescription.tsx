"use client";

import React, { useMemo } from "react";
import { Card, CardBody, CardHeader } from "@heroui/react";
import { Icon } from "@iconify/react";

interface TokenDescriptionProps {
  description: string;
  twitter?: string;
  website?: string;
}

// Clean HTML from description and convert to plain text
function cleanDescription(html: string): string {
  if (!html) return "No description available";

  // Remove HTML tags
  let text = html.replace(/<[^>]*>/g, " ");

  // Decode HTML entities
  text = text
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&amp;/g, "&")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&nbsp;/g, " ");

  // Remove extra whitespace
  text = text.replace(/\s+/g, " ").trim();

  // Limit length for better UX
  if (text.length > 500) {
    text = text.substring(0, 500) + "...";
  }

  return text || "No description available";
}

export function TokenDescription({ description, twitter, website }: TokenDescriptionProps) {
  const cleanedDescription = useMemo(() => cleanDescription(description), [description]);

  return (
    <Card className="bg-card rounded-2xl">
      <CardHeader className="p-5">
        <h3 className="text-sm font-medium text-white">About</h3>
      </CardHeader>
      <CardBody className="p-5 pt-0">
        <p className="text-sm text-gray-400 leading-relaxed mb-4 whitespace-pre-line">{cleanedDescription}</p>

        <div className="flex gap-4">
          {twitter && (
            <Icon
              className="h-5 w-5 text-gray-400 cursor-pointer hover:text-white transition-colors"
              icon="lucide:twitter"
              onClick={() => window.open(twitter, "_blank")}
            />
          )}
          {website && (
            <Icon
              className="h-5 w-5 text-gray-400 cursor-pointer hover:text-white transition-colors"
              icon="lucide:globe"
              onClick={() => window.open(website, "_blank")}
            />
          )}
        </div>
      </CardBody>
    </Card>
  );
}
