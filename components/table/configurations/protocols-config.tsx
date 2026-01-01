import type { TableConfiguration } from "../types";

import { ProtocolCell } from "../cells";

import { Protocol } from "@/lib/types/defi-stats";

/**
 * Protocols Table Configuration
 *
 * Defines columns, sorting, and rendering for DeFi protocols table.
 *
 * Column Structure:
 * - Rank: Protocol ranking (center-aligned, 50px)
 * - Name: Protocol name with logo (left-aligned, 200px)
 * - TVL: Total Value Locked (right-aligned, 200px, sortable)
 * - Protocol Asset: Asset token or symbol (right-aligned, 200px, hidden on mobile)
 * - Categories: Protocol categories as chips (right-aligned, auto-width, hidden on mobile)
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
      width: "200px",
      render: (item: Protocol) => <ProtocolCell columnKey="protocol" item={item} />,
    },
    {
      key: "tvl",
      label: "TVL",
      sortable: true,
      align: "right",
      width: "200px",
      render: (item: Protocol) => <ProtocolCell columnKey="tvl" item={item} />,
    },
    {
      key: "assetToken",
      label: "Protocol Asset",
      sortable: false,
      align: "right",
      hiddenOnMobile: true,
      width: "200px",
      render: (item: Protocol) => <ProtocolCell columnKey="assetToken" item={item} />,
    },
    {
      key: "category",
      label: "Categories",
      sortable: false,
      align: "right",
      hiddenOnMobile: true,
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
