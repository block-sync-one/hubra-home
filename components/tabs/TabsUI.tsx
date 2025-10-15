"use client";

import React, { useMemo } from "react";
import { Icon } from "@iconify/react";
import { Tabs, Tab, Chip, DropdownTrigger, Dropdown, Button, DropdownMenu, DropdownItem } from "@heroui/react";

import { AppTab, TabIdType } from "@/lib/models/appTab";

interface TabsUIProps {
  selectedTab: TabIdType;
  onTabChange: (tab: TabIdType) => void;
  className?: string;
  tabsData: AppTab[];
  shouldKeepTabOnSmallScreen?: boolean;
}

export const TabsUI = React.memo(({ selectedTab, onTabChange, tabsData, className, shouldKeepTabOnSmallScreen = false }: TabsUIProps) => {
  // Memoize the selected tab data to avoid repeated lookups
  const selectedTabData = useMemo(() => tabsData.find((tab) => tab.id === selectedTab), [tabsData, selectedTab]);

  // Memoize tab rendering to prevent unnecessary re-renders
  const renderTab = useMemo(
    () => (tab: AppTab) => {
      const isSelected = tab.id === selectedTab;
      const color = isSelected ? "primary" : "default";

      return (
        <Tab
          key={tab.id}
          title={
            <div className="flex items-center gap-2">
              {tab.icon && <Icon icon={tab.icon} width={16} />} {tab.label}
              {tab.itemCount && (
                <Chip color={color} size="sm" variant="flat">
                  {tab.itemCount}
                </Chip>
              )}
            </div>
          }
          value={tab.id}
        />
      );
    },
    [selectedTab]
  );

  // Memoize dropdown item rendering
  const renderDropdownItem = useMemo(
    () => (tab: AppTab) => {
      const isSelected = tab.id === selectedTab;
      const color = isSelected ? "primary" : "default";

      return (
        <DropdownItem key={tab.id} className="text-white hover:bg-white/10" color={color} textValue={tab.label}>
          <div className="flex items-center gap-2">
            {tab.icon && <Icon icon={tab.icon} width={16} />} {tab.label}
            {tab.itemCount && (
              <Chip color={color} size="sm" variant="flat">
                {tab.itemCount}
              </Chip>
            )}
          </div>
        </DropdownItem>
      );
    },
    [selectedTab]
  );

  return (
    <>
      <Tabs
        className={`w-full ${shouldKeepTabOnSmallScreen ? "" : "hidden lg:block"} ${className ?? ""}`}
        classNames={{
          tabList: "gap-2 w-full relative rounded-none py-0",
          cursor: "bg-primary w-full",
          tab: "h-8",
          tabContent:
            "text-gray-400 font-medium group-data-[selected=true]:text-base transition-colors duration-150 mb-4 group-data-[selected=true]:font-bold",
        }}
        selectedKey={selectedTab}
        variant="underlined"
        onSelectionChange={(key) => onTabChange(key as TabIdType)}>
        {tabsData.map(renderTab)}
      </Tabs>
      {!shouldKeepTabOnSmallScreen && (
        <Dropdown
          classNames={{
            content: "border-none shadow-none",
          }}
          placement="bottom-end">
          <DropdownTrigger className="mb-4 lg:hidden">
            <Button
              className="min-w-fit capitalize bg-white/5 backdrop-blur-md text-white flex items-center gap-1.5 font-semibold"
              radius="full"
              size="md"
              variant="flat">
              {selectedTabData?.icon && <Icon icon={selectedTabData.icon} width={16} />} {selectedTabData?.label}
              {selectedTabData?.itemCount && (
                <Chip className="hidden lg:block" color="primary" size="sm" variant="flat">
                  {selectedTabData.itemCount}
                </Chip>
              )}
              <Icon className="text-gray-400" icon="lucide:chevron-down" width={16} />
            </Button>
          </DropdownTrigger>
          <DropdownMenu
            disallowEmptySelection
            aria-label="Single selection"
            className="bg-black/90 backdrop-blur-md border-none"
            selectedKeys={[selectedTab]}
            selectionMode="single"
            variant="flat"
            onSelectionChange={(keys) => onTabChange(Array.from(keys)[0] as TabIdType)}>
            {tabsData.map(renderDropdownItem)}
          </DropdownMenu>
        </Dropdown>
      )}
    </>
  );
});
