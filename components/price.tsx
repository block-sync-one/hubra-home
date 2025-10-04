import { Chip } from "@heroui/react";
import { Icon } from "@iconify/react";
import React from "react";

import { useCurrency } from "@/lib/context/currency-format";

export const PriceDisplay = ({
  value,
  longNumbers = false,
}: {
  value: number;
  longNumbers?: boolean;
}) => {
  const { formatPrice } = useCurrency();

  return <> {formatPrice(value, longNumbers)} </>;
};

export const PriceChangeChip = ({
  changePercent,
  className,
}: {
  changePercent: number;
  className?: string;
  showDecimals?: boolean;
}) => {
  const chipColor = changePercent >= 0 ? "success" : "danger";
  const iconName = changePercent >= 0 ? "mdi:arrow-up" : "mdi:arrow-down";
  const displayValue = changePercent.toFixed(2);

  return (
    <Chip
      aria-label={`price change percent: ${changePercent}%`}
      className={`${className}`}
      color={chipColor}
      size="sm"
      variant="flat"
    >
      <div className="flex items-center font-medium gap-0.5">
        <Icon aria-hidden="true" icon={iconName} />
        <span>{displayValue}%</span>
      </div>
    </Chip>
  );
};
