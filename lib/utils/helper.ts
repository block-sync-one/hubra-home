declare global {
  interface Number {
    toFixedNoRounding: Function;
  }
}

export function fixedNumber(value: number): string {
  if (value > 0.1) {
    return formatBigNumbers(value);
  }

  // Convert the input to a number
  const num: number = Number(value);

  if (num.toString().includes("e")) {
    return num.toFixed(10).replace(/\.?0+$/, ""); // trim trailing zeros
  }

  // If the number is not valid, return '0.00'
  if (isNaN(num) || !isFinite(num)) {
    return "0.00";
  }
  // Find the closest positive number
  const absNum = Math.abs(num);

  // Find the minimum number of decimal places needed
  let decimalPlaces = 2; // Start with minimum 2 decimal places
  let tempNum = absNum;

  while (tempNum < 0.01 && tempNum > 0) {
    tempNum *= 10;
    decimalPlaces++;
  }

  // Cap the decimal places at 8 to avoid excessive precision
  decimalPlaces = Math.min(decimalPlaces, 8);

  // Format the number with the calculated decimal places
  const formattedNum = absNum.toFixedNoRounding(decimalPlaces);

  // Remove trailing zeros after the decimal point, but keep at least 2 decimal places
  const trimmedNum = parseFloat(formattedNum).toFixedNoRounding(Math.max(2, (formattedNum.split(".")[1] || "").replace(/0+$/, "").length));

  // Localize the number
  return trimmedNum;
}

/**
 * Formats a blockchain address to show first 4 and last 4 characters
 * @param addr Full blockchain address
 * @returns Object containing full address and shortened version (e.g., "0x1234...5678")
 */
export function addrUtil(addr: string, maxLength = 8): { addr: string; addrShort: string } {
  if (!addr || typeof addr !== "string") {
    return { addr: "", addrShort: "" }; // or return null, or a placeholder
  }
  // If the address is shorter than or equal to 8 characters,
  // return it unchanged to avoid awkward truncation like `abc...abc`.
  if (addr.length <= maxLength) {
    return { addr, addrShort: addr };
  }

  return {
    addr,
    addrShort: `${addr.substring(0, maxLength / 2)}...${addr.substring(addr.length - maxLength / 2)}`,
  };
}
/**
 * Formats a number to a fixed number of decimal places without rounding
 * @param n Number of decimal places
 */
Number.prototype.toFixedNoRounding = function (n: number) {
  const reg = new RegExp("^-?\\d+(?:\\.\\d{0," + n + "})?", "g");
  const a = this.toString().match(reg)?.[0] || this.toString();
  const dot = a.indexOf(".");

  if (dot === -1) {
    // integer, insert decimal dot and pad up zeros
    return a + "." + "0".repeat(n);
  }
  const b = n - (a.length - dot) + 1;

  return b > 0 ? a + "0".repeat(b) : a;
};

/**
 * Formats large numbers with K, M, B, T suffixes for better readability
 */
export function formatBigNumbers(n: number, decimals = 2): string {
  if (n < 1e3) return n.toFixedNoRounding(decimals);
  if (n >= 1e3 && n < 1e6) return Math.floor((n / 1e3) * 10) / 10 + "K";
  if (n >= 1e6 && n < 1e9) return Math.floor((n / 1e6) * 10) / 10 + "M";
  if (n >= 1e9 && n < 1e12) return Math.floor((n / 1e9) * 10) / 10 + "B";
  if (n >= 1e12) return Math.floor((n / 1e12) * 10) / 10 + "T";

  return n.toString();
}

export function generateUUID() {
  if (typeof crypto !== "undefined" && crypto.randomUUID) {
    return crypto.randomUUID(); // e.g., "123e4567-e89b-12d3-a456-426614174000"
  }
  // Fallback for older environments
  const timestamp = Date.now().toString(36);
  const random = Math.random().toString(36).slice(2, 8);

  return `${timestamp}-${random}`; // e.g., "1j4k5m-npqr56"
}

export function localNumberInputAmount(value: number) {
  return value.toLocaleString(undefined, {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
}
