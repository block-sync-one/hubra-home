/**
 * @deprecated This component has been replaced by UnifiedChart.
 * Use UnifiedChart with rangeSelectorConfig instead.
 * This component is only kept for internal use by UnifiedChart.
 */
// RangeSelector.tsx
import { Tabs, Tab } from "@heroui/react";

export default function RangeSelector({
  range,
  setRange,
  ranges,
  className,
}: {
  range: string;
  setRange: (range: string) => void;
  ranges: any;
  className?: string;
}) {
  return (
    <Tabs
      aria-label="Select time range for chart"
      className={`${className}`}
      classNames={{
        tabList: "lg:bg-gray-30 bg-transparent gap-2 w-full h-[38] rounded-lg shadow-none border-none",
        tab: "border-none shadow-none h-[32] lg:w-[56px] ",
        cursor: "group-data-[selected=true]:bg-card shadow-none border-none",
      }}
      role="tablist"
      selectedKey={range}
      variant="solid"
      onSelectionChange={setRange as any}>
      {Object.keys(ranges).map((r) => (
        <Tab
          key={r}
          aria-selected={range === r}
          className="border-none text-sm shadow-none px-4"
          role="tab"
          title={<span className="flex items-center gap-2">{r}</span>}
        />
      ))}
    </Tabs>
  );
}
