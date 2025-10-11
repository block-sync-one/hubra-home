import type { TableConfiguration } from "../types";

import { TokenCell } from "../cells";

import { Token } from "@/lib/types/token";

export const tokensTableConfig: TableConfiguration<Token> = {
  columns: [
    {
      key: "token",
      label: "Token",
      sortable: false,
      align: "left",
      render: (item: Token) => <TokenCell columnKey="token" item={item} />,
    },
    {
      key: "price",
      label: "Price",
      sortable: true,
      align: "right",
      hiddenOnMobile: true,
      render: (item: Token) => <TokenCell columnKey="price" item={item} />,
    },
    {
      key: "marketCap",
      label: "Market Cap",
      sortable: true,
      align: "right",
      render: (item: Token) => <TokenCell columnKey="marketCap" item={item} />,
    },
    {
      key: "volume",
      label: "Volume 24h",
      sortable: true,
      align: "right",
      hiddenOnMobile: true,
      render: (item: Token) => <TokenCell columnKey="volume" item={item} />,
    },
    {
      key: "priceChange24hPct",
      label: "24h %",
      sortable: true,
      align: "right",
      hiddenOnMobile: true,
      render: (item: Token) => <TokenCell columnKey="priceChange24hPct" item={item} />,
    },
  ],
  defaultSort: {
    column: "", // Empty to preserve pre-sorted order from API
    direction: "ascending",
  },
  searchFields: ["asset.symbol", "asset.name"],
  rowsPerPage: 100,
};
