import React, { createContext, useContext, useState, useEffect } from "react";

import { currencies, getCurrencyById } from "@/lib/constants/currencies";
import { Currency, CurrencyId, CurrencyIdType } from "@/lib/models/currency";
import { VirtualStorageService } from "@/lib/utils/virtual-storage";
import { fixedNumber } from "@/lib/utils/helper";

interface CurrencyContextType {
  currency: Currency;
  setCurrency: (currency: Currency) => void;
  formatPrice: (value: number, longNumbers?: boolean) => string;
  convertCurrency: (value: number, fromCurrency: CurrencyIdType, toCurrency: CurrencyIdType) => number;
  exchangeRates: Record<CurrencyIdType, number>;
  isLoading: boolean;
}

const CurrencyContext = createContext<CurrencyContextType | undefined>(undefined);

export function CurrencyProvider({ children }: { children: React.ReactNode }) {
  console.log("=== CurrencyProvider", new Date().toISOString()); // local storage service
  const vrs = new VirtualStorageService();
  const [currency, setCurrency] = useState<Currency>(() => {
    const savedCurrencyId = vrs.localStorage.getData("preferredCurrency") ?? currencies[CurrencyId.USD].id;

    return getCurrencyById(savedCurrencyId);
  });

  const [exchangeRates, setExchangeRates] = useState<Record<CurrencyIdType, number>>({} as Record<CurrencyIdType, number>);
  const [isLoading, setIsLoading] = useState(true);

  // Save currency preference to localStorage when it changes
  useEffect(() => {
    vrs.localStorage.saveData("preferredCurrency", currency.id);
  }, [currency]);

  // Fetch exchange rates
  useEffect(() => {
    let isMounted = true;
    const fetchExchangeRates = async () => {
      if (!isMounted) return;

      setIsLoading(true);
      try {
        const response = await fetch(
          "https://api.coingecko.com/api/v3/simple/price?ids=solana,bitcoin&vs_currencies=usd,eur,gbp,jpy,cny,inr"
        );

        if (!isMounted) return;

        const data = await response.json();

        // Convert the API response to our exchange rates format
        const rates: Record<CurrencyIdType, number> = {
          USD: 1, // Base currency
          EUR: data.bitcoin.usd / data.bitcoin.eur,
          GBP: data.bitcoin.usd / data.bitcoin.gbp,
          JPY: data.bitcoin.usd / data.bitcoin.jpy,
          CNY: data.bitcoin.usd / data.bitcoin.cny,
          INR: data.bitcoin.usd / data.bitcoin.inr,
          BTC: data.bitcoin.usd, // Store BTC price in USD
          SOL: data.solana.usd, // Store SOL price in USD
        };

        setExchangeRates(rates);
      } catch (error) {
        console.error("Error fetching exchange rates:", error);
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    };

    // Initial fetch
    fetchExchangeRates();

    // Only set up polling if the component is mounted
    const interval = setInterval(fetchExchangeRates, 5 * 60 * 1000);

    return () => {
      isMounted = false;
      clearInterval(interval);
    };
  }, []);

  const formatPrice = (value: number, longNumbers?: boolean) => {
    const { id, symbol } = currency;
    // Convert the value to the selected currency if we have exchange rates
    const convertedValue = !isLoading && exchangeRates[id] ? convertCurrency(value, CurrencyId.USD, id) : value;

    // For crypto currencies
    if (id === CurrencyId.BTC || id === CurrencyId.SOL) {
      const formattedValue = new Intl.NumberFormat("en-US", {
        minimumFractionDigits: 2,
        maximumFractionDigits: 8,
      }).format(convertedValue);

      return `${fixedNumber(Number(formattedValue))} ${symbol}`;
    }
    // For fiat currencies, use Intl.NumberFormat with custom symbol position
    // const formatter = new Intl.NumberFormat("en-US", {
    //   style: "currency",
    //   currency: id,
    //   minimumFractionDigits: 2,
    //   maximumFractionDigits: 8,
    // });

    // Get the formatted parts
    // const parts = formatter.formatToParts(convertedValue);

    // Reconstruct the string with the symbol in the correct position
    if (longNumbers) {
      const formattedValue = new Intl.NumberFormat("en-US", {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      }).format(convertedValue);

      return symbol + formattedValue;
    }

    return symbol + fixedNumber(convertedValue);

    // return parts
    //   .map((part) => {
    //     if (part.type === "currency") {
    //       return symbol;
    //     }

    //     return part.value;
    //   })
    //   .join("");
  };

  const convertCurrency = (value: number, fromCurrency: CurrencyIdType, toCurrency: CurrencyIdType): number => {
    if (fromCurrency === toCurrency) return value;

    // Convert to USD first (our base currency)
    let valueInUSD: number;

    if (fromCurrency === CurrencyId.BTC || fromCurrency === CurrencyId.SOL) {
      // If converting from crypto, multiply by its USD price
      valueInUSD = value / exchangeRates[fromCurrency];
    } else {
      // If converting from fiat, use the exchange rate
      valueInUSD = value / exchangeRates[fromCurrency];
    }

    // Then convert to target currency

    if (toCurrency === CurrencyId.BTC || toCurrency === CurrencyId.SOL) {
      // If converting to crypto, divide by its USD price
      return Number(valueInUSD / exchangeRates[toCurrency]).toFixedNoRounding(4);
    } else {
      // If converting to fiat, use the exchange rate
      return Number(valueInUSD / exchangeRates[toCurrency]);
    }
  };

  return (
    <CurrencyContext.Provider
      value={{
        currency,
        setCurrency,
        formatPrice,
        convertCurrency,
        exchangeRates,
        isLoading,
      }}>
      {children}
    </CurrencyContext.Provider>
  );
}

export function useCurrency() {
  const context = useContext(CurrencyContext);

  if (context === undefined) {
    throw new Error("useCurrency must be used within a CurrencyProvider");
  }

  return context;
}
