import type { TableConfiguration } from "@/components/table/types";
import type { ProtocolMetric } from "./types";

import React from "react";
import { Icon } from "@iconify/react";
import Link from "next/link";

import { buildDefillamaUrl } from "./helpers";

import { formatCurrency } from "@/lib/utils/helper";

function isValidNumericValue(value: unknown): value is number {
  return typeof value === "number" && !isNaN(value) && isFinite(value);
}

function renderCurrencyValue(value: unknown): React.ReactNode {
  const numericValue = isValidNumericValue(value) ? value : null;

  return <span className="font-medium text-white">{numericValue !== null ? formatCurrency(numericValue, true) : "-"}</span>;
}

// Memoized components for better performance
const ProtocolNameCell = React.memo(({ name }: { name: string }) => <span className="font-semibold text-white pl-4">{name}</span>);

ProtocolNameCell.displayName = "ProtocolNameCell";

const ActionButtonCell = React.memo(({ slug, id }: { slug?: string; id: string }) => {
  const defillamaUrl = buildDefillamaUrl(slug || "", id);

  return (
    <Link
      className="inline-flex items-center justify-center p-2 rounded-lg hover:bg-white/10 transition-colors text-gray-400 hover:text-primary"
      href={defillamaUrl}
      rel="noopener noreferrer"
      target="_blank"
      title="View on DeFiLlama"
      onClick={(e) => e.stopPropagation()}>
      <Icon icon="lucide:external-link" width={18} />
    </Link>
  );
});

ActionButtonCell.displayName = "ActionButtonCell";

export const keyMetricsTableConfig: TableConfiguration<ProtocolMetric> = {
  columns: [
    {
      key: "name",
      label: "Protocol",
      sortable: true,
      align: "left",
      render: (item) => <ProtocolNameCell name={item.name} />,
    },
    {
      key: "tvl",
      label: "TVL",
      sortable: true,
      align: "right",
      render: (item) => renderCurrencyValue(item.tvl),
    },
    {
      key: "fees",
      label: "24h Fees",
      sortable: true,
      align: "right",
      render: (item) => renderCurrencyValue(item.fees),
    },
    {
      key: "revenue",
      label: "24h Revenue",
      sortable: true,
      align: "right",
      render: (item) => renderCurrencyValue(item.revenue),
    },
    {
      key: "action",
      label: "",
      sortable: false,
      align: "center",
      width: 60,
      render: (item) => <ActionButtonCell id={item.id} slug={item.slug} />,
    },
  ],
  defaultSort: {
    column: "tvl",
    direction: "descending",
  },
  searchFields: ["name"],
  rowsPerPage: 100,
};
