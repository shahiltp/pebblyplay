/**
 * Format amount in cents/paisa to INR currency string
 */
export function formatINR(amountCents: number): string {
  const amount = amountCents / 100;
  return `₹${amount.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
}

