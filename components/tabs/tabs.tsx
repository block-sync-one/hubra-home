import { Icon } from "@iconify/react";
import {
  Tabs,
  Tab,
  Chip,
  DropdownTrigger,
  Dropdown,
  Button,
  DropdownMenu,
  DropdownItem,
} from "@heroui/react";

import { AppTab, TabId, TabIdType } from "@/lib/models/appTab";
import { HotTokensContent } from "@/components/tabs/HotTokensContent";

interface TabsUIProps {
  selectedTab: TabIdType;
  onTabChange: (tab: TabIdType) => void;
  className?: string;
  tabsData: AppTab[];
  shouldKeepTabOnSmallScreen?: boolean;
}

export const TabsUI = ({
  selectedTab,
  onTabChange,
  tabsData,
  className,
  shouldKeepTabOnSmallScreen = false,
}: TabsUIProps) => {
  return (
    <>
      <Tabs
        className={`w-full ${shouldKeepTabOnSmallScreen ? "" : "hidden lg:block"} ${className ?? ""}`}
        classNames={{
          tabList: "gap-2  w-full relative rounded-none  py-0 ",
          cursor: "w-full bg-primary",
          tab: " h-[40px] w-full",
          tabContent:
            "px-4 text-gray-400 font-medium group-data-[selected=true]:text-base transition-colors duration-150  mb-[12px] group-data-[selected=true]:font-bold",
        }}
        // color="primary"
        selectedKey={selectedTab}
        variant="underlined"
        onSelectionChange={(key) => onTabChange(key as TabIdType)}
      >
        {tabsData.map((tab) => {
          const isSelected = tab.id === selectedTab;
          const color = isSelected ? "primary" : "default";

          return (
            <Tab
              key={tab.id}
              className="w-full"
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
        })}
      </Tabs>
      {!shouldKeepTabOnSmallScreen && (
        <Dropdown placement="bottom-end">
          <DropdownTrigger className="mb-4 lg:hidden bg-card">
            <Button
              className="min-w-fit capitalize bg-card flex items-center gap-1.5 font-semibold"
              radius="full"
              size="md"
              variant="flat"
            >
              {tabsData.find((tab) => tab.id === selectedTab)?.icon && (
                <Icon
                  icon={
                    tabsData.find((tab) => tab.id === selectedTab)
                      ?.icon as string
                  }
                  width={16}
                />
              )}{" "}
              {tabsData.find((tab) => tab.id === selectedTab)?.label}
              {tabsData.find((tab) => tab.id === selectedTab)?.itemCount && (
                <Chip
                  className={`hidden lg:block`}
                  color="primary"
                  size="sm"
                  variant="flat"
                >
                  {tabsData.find((tab) => tab.id === selectedTab)?.itemCount}
                </Chip>
              )}
              <Icon color="gray" icon="lucide:chevron-down" width={16} />
            </Button>
          </DropdownTrigger>
          <DropdownMenu
            disallowEmptySelection
            aria-label="Single selection"
            selectedKeys={[selectedTab]}
            selectionMode="single"
            variant="flat"
            onSelectionChange={(keys) =>
              onTabChange(Array.from(keys)[0] as TabIdType)
            }
          >
            {tabsData.map((tab) => {
              const isSelected = tab.id === selectedTab;
              const color = isSelected ? "primary" : "default";

              return (
                <DropdownItem key={tab.id} color={color} textValue={tab.label}>
                  <div className="flex items-center gap-2">
                    {tab.icon && <Icon icon={tab.icon} width={16} />}{" "}
                    {tab.label}
                    {tab.itemCount && (
                      <Chip color={color} size="sm" variant="flat">
                        {tab.itemCount}
                      </Chip>
                    )}
                  </div>
                </DropdownItem>
              );
            })}
          </DropdownMenu>
        </Dropdown>
      )}
    </>
  );
};

/**
 * Tab Content Component
 *
 * Renders the appropriate tab content based on the selected tab ID.
 * Each tab component receives the props it needs.
 */
interface TabContentProps {
  tabId: TabIdType;
}

export const TabContent: React.FC<TabContentProps> = ({ tabId }) => {
  // Render appropriate tab content based on tab ID
  switch (tabId) {
    case TabId.hotTokens:
      return <HotTokensContent />;
    case TabId.losers:
      return <p>Losers Tab</p>;
    case TabId.gainers:
      return <p>Gainers Tab</p>;
    case TabId.volume:
      return <p>Volume Tab</p>;
    default:
      return (
        <div className="flex flex-col items-center justify-center min-h-[200px]">
          <p className="text-gray-500">Unknown Tab: {tabId}</p>
        </div>
      );
  }
};
