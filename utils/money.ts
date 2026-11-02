// Converts "$29.99" or "Item total: $39.98" into integer cents.
// Integer maths keeps the sum comparison exact (floats give 39.980000000000004).
export function toCents(text: string): number {
  const match = text.match(/\$\s*([\d,]+\.\d{2})/);
  if (!match) throw new Error(`No currency amount found in: "${text}"`);
  return Math.round(parseFloat(match[1].replace(/,/g, '')) * 100);
}

// For readable assertion messages, e.g. 3998 -> "$39.98"
export const formatCents = (cents: number): string => `$${(cents / 100).toFixed(2)}`;