export const CurrencyId = {
  USD: "USD",
  EUR: "EUR",
  GBP: "GBP",
  JPY: "JPY",
  CNY: "CNY",
  INR: "INR",
  BTC: "BTC",
  SOL: "SOL",
} as const;

export type CurrencyIdType = (typeof CurrencyId)[keyof typeof CurrencyId];

export type Currency = {
  id: CurrencyIdType;
  label: string;
  name: string;
  symbol: string;
};
