export const formatCurrency = (
  amount: number | undefined | null,
  currencyCode: string
) => {
  // Map currency codes to their symbols
  const currencySymbols: Record<string, string> = {
    USD: "$",
    BDT: "৳",
    TK: "৳",
    EUR: "€",
    GBP: "£",
    JPY: "¥",
    INR: "₹",
    // Add more as needed
  };

  // Default to $ if currency not found
  const symbol = currencySymbols[currencyCode] || "$";

  // Handle undefined/null amount
  if (amount === undefined || amount === null) {
    return `${symbol} 0.00`;
  }

  return `${symbol} ${amount.toFixed()}`;
};
