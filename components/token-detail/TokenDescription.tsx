import React from "react";
import { Card, CardBody, CardHeader } from "@heroui/react";
import { Icon } from "@iconify/react";

interface TokenDescriptionProps {
  description: string;
  onTwitterClick?: () => void;
  onWebsiteClick?: () => void;
}

export function TokenDescription({ description, onTwitterClick, onWebsiteClick }: TokenDescriptionProps) {
  return (
    <Card className="bg-gray-950 border-white/10 rounded-2xl">
      <CardHeader className="p-5">
        <h3 className="text-sm font-medium text-white">Description</h3>
      </CardHeader>
      <CardBody className="p-5 pt-0">
        <p className="text-sm font-medium text-gray-400 leading-relaxed mb-4">{description}</p>

        <div className="flex gap-4">
          <Icon className="h-5 w-5 text-gray-400 cursor-pointer hover:text-white" icon="lucide:twitter" onClick={onTwitterClick} />
          <Icon className="h-5 w-5 text-gray-400 cursor-pointer hover:text-white" icon="lucide:globe" onClick={onWebsiteClick} />
        </div>
      </CardBody>
    </Card>
  );
}
