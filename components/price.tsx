import { Chip } from "@heroui/react";
import { Icon } from "@iconify/react";
import React from "react";

import { useCurrency } from "@/lib/context/currency-format";
import { formatBigNumbers } from "@/lib/utils";

export const PriceDisplay = ({ value, longNumbers = false }: { value: number; longNumbers?: boolean }) => {
  const { formatPrice } = useCurrency();

  return <> {formatPrice(value, longNumbers)} </>;
};

export const PriceChangeChip = ({ changePercent, className }: { changePercent: number; className?: string; showDecimals?: boolean }) => {
  const chipColor = changePercent >= 0 ? "success" : "danger";
  const iconName = changePercent >= 0 ? "mdi:arrow-up" : "mdi:arrow-down";
  const displayValue = changePercent.toFixed(2);

  return (
    <Chip aria-label={`price change percent: ${changePercent}%`} className={`${className}`} color={chipColor} size="sm" variant="flat">
      <div className="flex items-center font-medium gap-0.5">
        <Icon aria-hidden="true" icon={iconName} />
        <span>{displayValue}%</span>
      </div>
    </Chip>
  );
};

const getChangeConfig = (value: number) => {
  const isPositive = value >= 0;

  return {
    isPositive,
    icon: isPositive ? "mdi:arrow-up" : "mdi:arrow-down",
    bgColor: isPositive ? "bg-green-500/20" : "bg-red-500/20",
    textColor: isPositive ? "text-success-500" : "text-error-500",
    iconColor: isPositive ? "text-success-500" : "text-error-500",
  };
};

export const ChangeIndicator = React.memo(({ value }: { value: number }) => {
  const config = getChangeConfig(value);

  return (
    <div className={`${config.bgColor} rounded-xl px-1 py-0.5 flex items-center gap-1`}>
      <Icon className={`w-3 h-3 ${config.iconColor}`} icon={config.icon} />
      <span className={`text-xs font-medium ${config.textColor}`}>{formatBigNumbers(Math.abs(value))}%</span>
    </div>
  );
});

ChangeIndicator.displayName = "ChangeIndicator";
