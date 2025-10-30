export const TabId = {
  hotTokens: "Hot Tokens",
  losers: "Losers",
  gainers: "Gainers",
  volume: "Volume",
  tradable: "Tradable",
  allAssets: "All Assets",
  newlyListed: "Newly Listed",
  undefined: "undefined",
} as const;

export type TabIdType = (typeof TabId)[keyof typeof TabId];

export type AppTab = {
  id: TabIdType;
  label: string;
  itemCount?: number;
  icon?: string;
};
