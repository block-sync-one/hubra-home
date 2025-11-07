import type { TableConfiguration } from "../types";

import { ProtocolCell } from "../cells";

import { Protocol } from "@/lib/types/defi-stats";

/**
 * Protocols Table Configuration
 * Defines columns, sorting, and rendering for DeFi protocols table
 */
export const protocolsTableConfig: TableConfiguration<Protocol> = {
  columns: [
    {
      key: "rank",
      label: "#",
      sortable: false,
      align: "center",
      hiddenOnMobile: true,
      width: "50px",
      render: (item: Protocol) => <ProtocolCell columnKey="rank" item={item} />,
    },
    {
      key: "protocol",
      label: "Name",
      sortable: false,
      align: "left",
      width: "300px",
      render: (item: Protocol) => <ProtocolCell columnKey="protocol" item={item} />,
    },
    {
      key: "tvl",
      label: "TVL",
      sortable: true,
      align: "right",
      width: "150px",
      render: (item: Protocol) => <ProtocolCell columnKey="tvl" item={item} />,
    },
    {
      key: "change_7d",
      label: "7d Change",
      sortable: true,
      align: "right",
      width: "150px",
      render: (item: Protocol) => <ProtocolCell columnKey="change_7d" item={item} />,
    },
    {
      key: "category",
      label: "Categories",
      sortable: false,
      align: "right",
      hiddenOnMobile: true,
      width: "300px",
      render: (item: Protocol) => <ProtocolCell columnKey="category" item={item} />,
    },
  ],
  defaultSort: {
    column: "tvl",
    direction: "descending",
  },
  searchFields: ["name", "category"],
  rowsPerPage: 50,
};
