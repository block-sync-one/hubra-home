import type { TableConfiguration } from "@/components/table/types";
import type { ProtocolMetric } from "./types";

import { Icon } from "@iconify/react";
import Link from "next/link";

import { formatCurrency } from "@/lib/utils/helper";

export const keyMetricsTableConfig: TableConfiguration<ProtocolMetric> = {
  columns: [
    {
      key: "name",
      label: "Protocol",
      sortable: true,
      align: "left",
      render: (item) => <span className="font-semibold text-white">{item.name || "-"}</span>,
    },
    {
      key: "tvl",
      label: "TVL",
      sortable: true,
      align: "right",
      render: (item) => {
        const value = typeof item.tvl === "number" && !isNaN(item.tvl) && isFinite(item.tvl) ? item.tvl : null;

        return <span className="font-medium text-white">{value !== null && value !== undefined ? formatCurrency(value, true) : "-"}</span>;
      },
    },
    {
      key: "fees",
      label: "24h Fees",
      sortable: true,
      align: "right",
      render: (item) => {
        const value = typeof item.fees === "number" && !isNaN(item.fees) && isFinite(item.fees) ? item.fees : null;

        return <span className="font-medium text-white">{value !== null && value !== undefined ? formatCurrency(value, true) : "-"}</span>;
      },
    },
    {
      key: "revenue",
      label: "24h Revenue",
      sortable: true,
      align: "right",
      render: (item) => {
        const value = typeof item.revenue === "number" && !isNaN(item.revenue) && isFinite(item.revenue) ? item.revenue : null;

        return <span className="font-medium text-white">{value !== null && value !== undefined ? formatCurrency(value, true) : "-"}</span>;
      },
    },
    {
      key: "action",
      label: "",
      sortable: false,
      align: "center",
      width: 60,
      render: (item) => {
        const slug = item.slug || item.id;
        const defillamaUrl = `https://defillama.com/protocol/${slug}`;

        return (
          <Link
            className="inline-flex items-center justify-center p-2 rounded-lg hover:bg-white/10 transition-colors text-gray-400 hover:text-white"
            href={defillamaUrl}
            rel="noopener noreferrer"
            target="_blank"
            title="View on DeFiLlama"
            onClick={(e) => e.stopPropagation()}>
            <Icon icon="lucide:external-link" width={18} />
          </Link>
        );
      },
    },
  ],
  defaultSort: {
    column: "tvl",
    direction: "descending",
  },
  searchFields: ["name"],
  rowsPerPage: 100,
};
