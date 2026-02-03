"use client";

import { Button, Chip, Link } from "@heroui/react";

type StakeSolButtonClientProps = {
  apyLabel: string | null;
};

export function StakeSolButtonClient({ apyLabel }: StakeSolButtonClientProps) {
  return (
    <Button as={Link} className="text-sm font-medium" color="default" href="https://hubra.app/earn/stake" radius="full" variant="light">
      Stake SOL{" "}
      {apyLabel && (
        <Chip className="font-extrabold" color="success" radius="md" size="sm" variant="flat">
          {apyLabel != null ? ` ${apyLabel}` : ""}
        </Chip>
      )}
    </Button>
  );
}
