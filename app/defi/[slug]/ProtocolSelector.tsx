"use client";

import Link from "next/link";
import { Button, Dropdown, DropdownTrigger, DropdownMenu, DropdownItem } from "@heroui/react";
import { Icon } from "@iconify/react";

import { ProtocolSelectorProps } from "@/app/defi/protocol-options";

export function ProtocolSelector({ currentProtocol, relatedProtocols }: ProtocolSelectorProps) {
  if (!relatedProtocols || relatedProtocols.length === 0) {
    return <h1 className="text-2xl font-bold mb-1 text-white">{currentProtocol.name}</h1>;
  }

  return (
    <Dropdown placement="bottom-start">
      <DropdownTrigger>
        <Button className="min-w-fit h-auto p-0 bg-transparent hover:bg-white/5 data-[hover=true]:bg-white/5" radius="sm" variant="light">
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold text-white">{currentProtocol.name}</h1>
            <Icon className="text-gray-400" icon="lucide:chevron-down" width={20} />
          </div>
        </Button>
      </DropdownTrigger>
      <DropdownMenu
        aria-label="Select protocol"
        classNames={{
          base: "bg-card backdrop-blur-sm border border-gray-30 min-w-[200px]",
        }}
        selectedKeys={[currentProtocol.slug]}
        selectionMode="single"
        variant="flat">
        {relatedProtocols.map((protocol) => (
          <DropdownItem
            key={protocol.slug}
            classNames={{
              base: protocol.slug === currentProtocol.slug ? "bg-primary/10 text-primary" : "",
            }}
            textValue={protocol.name}>
            <Link className="flex items-center justify-between w-full" href={`/defi/${protocol.slug}`}>
              <span className={protocol.slug === currentProtocol.slug ? "font-semibold text-primary" : ""}>{protocol.name}</span>
            </Link>
          </DropdownItem>
        ))}
      </DropdownMenu>
    </Dropdown>
  );
}
