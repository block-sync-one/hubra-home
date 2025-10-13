import type { TableConfiguration } from "../types";

import { TokenCell } from "../cells";

import { Token } from "@/lib/types/token";

export const tokensTableConfig: TableConfiguration<Token> = {
  columns: [
    {
      key: "rank",
      label: "#",
      sortable: false,
      align: "center",
      hiddenOnMobile: true,
      width: "50px",
      render: (item: Token) => <TokenCell columnKey="rank" item={item} />,
    },
    {
      key: "token",
      label: "Name",
      sortable: false,
      align: "left",
      width: "240px",
      render: (item: Token) => <TokenCell columnKey="token" item={item} />,
    },
    {
      key: "price",
      label: "Price",
      sortable: true,
      align: "right",
      width: "150px",
      render: (item: Token) => <TokenCell columnKey="price" item={item} />,
    },
    {
      key: "priceChange24hPct",
      label: "Change (24h)",
      sortable: true,
      align: "right",
      width: "150px",
      render: (item: Token) => <TokenCell columnKey="priceChange24hPct" item={item} />,
    },
    {
      key: "chart",
      label: "Chart (24h)",
      sortable: false,
      align: "right",
      hiddenOnMobile: true,
      width: "180px",
      render: (item: Token) => <TokenCell columnKey="chart" item={item} />,
    },
    {
      key: "marketCap",
      label: "Market Cap",
      sortable: true,
      align: "right",
      hiddenOnMobile: true,
      width: "150px",
      render: (item: Token) => <TokenCell columnKey="marketCap" item={item} />,
    },
    {
      key: "action",
      label: "",
      sortable: false,
      align: "center",
      hiddenOnMobile: true,
      width: "120px",
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
