import { AppTab, TabIdType } from "@/lib/models/appTab";
import { TabId } from "@/lib/models";

export const tradable: AppTab = {
  id: TabId.tradable,
  label: "Tradable",
};

export const allAssets: AppTab = {
  id: TabId.allAssets,
  label: "All Assets",
};

export const gainers: AppTab = {
  id: TabId.gainers,
  label: "Gainers",
};

export const losers: AppTab = {
  id: TabId.losers,
  label: "Losers",
};

export const newlyListed: AppTab = {
  id: TabId.newlyListed,
  label: "Newly Listed",
};

export const volume: AppTab = {
  id: TabId.volume,
  label: "Volume",
};

export const hotTokens: AppTab = {
  id: TabId.hotTokens,
  label: "Hot Tokens 🔥",
};

// @ts-ignore
export const quickActionTabs: Record<TabIdType, AppTab> = {
  [TabId.hotTokens]: hotTokens,
  [TabId.losers]: losers,
  [TabId.gainers]: gainers,
  [TabId.volume]: volume,
  [TabId.tradable]: tradable,
  [TabId.allAssets]: allAssets,
  [TabId.newlyListed]: newlyListed,
};
