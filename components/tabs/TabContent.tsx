import { TabId, TabIdType } from "@/lib/models";
import { HotTokensContent, LosersContent, GainersContent, VolumeContent } from "@/components/tabs";

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
      return <LosersContent />;
    case TabId.gainers:
      return <GainersContent />;
    case TabId.volume:
      return <VolumeContent />;
    default:
      return (
        <div className="flex flex-col items-center justify-center min-h-[200px]">
          <p className="text-gray-500">Unknown Tab: {tabId}</p>
        </div>
      );
  }
};
