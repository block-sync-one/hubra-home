import type { TableConfiguration } from "../types";

import { Token } from "@/lib/models/token";

import { TokenCell } from "../cells";

export const tokensTableConfig: TableConfiguration<Token> = {
  columns: [
    {
      key: "token",
      label: "Token",
      sortable: false,
      align: "left",
      render: (item: Token) => <TokenCell columnKey="token" earnOpportunity={item.earnOpportunity} item={item} />,
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
      key: "balance",
      label: "Balance",
      sortable: true,
      align: "right",
      render: (item: Token) => <TokenCell columnKey="balance" item={item} />,
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
    column: "value",
    direction: "descending",
  },
  searchFields: ["asset.symbol", "asset.name"],
  rowsPerPage: 100,
};
