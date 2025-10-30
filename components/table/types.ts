import { AppTab } from "@/lib/models";

export interface TableColumn<T = any> {
  key: string;
  label: string;
  sortable?: boolean;
  hiddenOnMobile?: boolean;
  align?: "left" | "right" | "center";
  width?: string | number;
  render?: (item: T, value: any) => React.ReactNode;
  showHeader?: boolean;
}

export interface TableConfiguration<T = any> {
  columns: TableColumn<T>[];
  defaultSort?: {
    column: string;
    direction: "ascending" | "descending";
  };
  searchFields?: string[];
  rowsPerPage?: number;
}

export interface TableProps<T = any> {
  data: T[];
  configuration: TableConfiguration<T>;
  isLoading?: boolean;
  totalValue?: number;
  tableType?: string;
  onRowClick?: (item: T) => void;
  filterValue?: string;
  onFilterChange?: (value: string) => void;
}

export interface TableWrapperProps {
  tabs: AppTab[];
  data: any;
  isLoading: boolean;
  onAssetClick?: (asset: any) => void;
}

// Data types from the original file
