import type { TableConfiguration } from "../types";

import { TokenCell } from "../cells";

import { Token } from "@/lib/types/token";

export const tokensTableConfig: TableConfiguration<Token> = {
  columns: [
    {
      key: "rank",
      label: "#",
      sortable: false,
      align: "left",
      render: (item: Token) => <TokenCell columnKey="rank" item={item} />,
    },
    {
      key: "token",
      label: "Name",
      sortable: false,
      align: "left",
      render: (item: Token) => <TokenCell columnKey="token" item={item} />,
    },
    {
      key: "price",
      label: "Price",
      sortable: true,
      align: "left",
      render: (item: Token) => <TokenCell columnKey="price" item={item} />,
    },
    {
      key: "priceChange24hPct",
      label: "Change",
      sortable: true,
      align: "left",
      render: (item: Token) => <TokenCell columnKey="priceChange24hPct" item={item} />,
    },
    {
      key: "chart",
      label: "Chart",
      sortable: false,
      align: "left",
      render: (item: Token) => <TokenCell columnKey="chart" item={item} />,
    },
    {
      key: "marketCap",
      label: "Market Cap",
      sortable: true,
      align: "left",
      render: (item: Token) => <TokenCell columnKey="marketCap" item={item} />,
    },
    {
      key: "action",
      label: "",
      sortable: false,
      align: "right",
      render: (item: Token) => <TokenCell columnKey="action" item={item} />,
    },
  ],
  defaultSort: {
    column: "", // Empty to preserve pre-sorted order from API
    direction: "ascending",
  },
  searchFields: ["asset.symbol", "asset.name"],
  rowsPerPage: 100,
};
