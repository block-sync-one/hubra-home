import { Currency, CurrencyId, CurrencyIdType } from "@/lib/models/currency";

export const usd: Currency = {
  id: CurrencyId.USD,
  label: "USD ($)",
  name: "US-Dollar",
  symbol: "$",
};

export const euro: Currency = {
  id: CurrencyId.EUR,
  label: "EUR (€)",
  name: "Euro",
  symbol: "€",
};

export const pound: Currency = {
  id: CurrencyId.GBP,
  label: "GBP (£)",
  name: "Pound Sterling",
  symbol: "£",
};

export const yen: Currency = {
  id: CurrencyId.JPY,
  label: "JPY (¥)",
  name: "Japanese yen",
  symbol: "¥",
};

export const yuan: Currency = {
  id: CurrencyId.CNY,
  label: "CNY (¥)",
  name: "Chinese yuan",
  symbol: "¥",
};

export const rupee: Currency = {
  id: CurrencyId.INR,
  label: "INR (₹)",
  name: "Indian Rupee",
  symbol: "₹",
};

export const bitcoin: Currency = {
  id: CurrencyId.BTC,
  label: "BTC (₿)",
  name: "Bitcoin",
  symbol: "₿",
};

export const solana: Currency = {
  id: CurrencyId.SOL,
  label: "SOL (◎)",
  name: "Solana",
  symbol: "◎",
};

export const currencies: Record<CurrencyIdType, Currency> = {
  [CurrencyId.USD]: usd,
  [CurrencyId.EUR]: euro,
  [CurrencyId.GBP]: pound,
  [CurrencyId.JPY]: yen,
  [CurrencyId.CNY]: yuan,
  [CurrencyId.INR]: rupee,
  [CurrencyId.BTC]: bitcoin,
  [CurrencyId.SOL]: solana,
};

/**
 * Returns the corresponding `Currency` object for the given currency ID.
 * If the provided ID is unknown returns USD as a fallback.
 *
 * @param {string} currencyId - The ID of the currency to look up.
 * @returns {Currency} The matching `Currency` object, or USD if unknown.
 */
export function getCurrencyById(currencyId: string): Currency {
  const currency = currencies[currencyId as CurrencyIdType];

  if (!currency) {
    console.error(`Unknown currency id: ${currencyId}`);

    return currencies[CurrencyId.USD];
  }

  return currency;
}
