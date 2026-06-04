/**
 * Booking Deposit Utilities
 *
 * Handles deposit calculation based on detailer's booking protection policy.
 */

export type BookingProtectionType = "none" | "fixed" | "percentage";

export interface DepositCalculation {
  requiresPayment: boolean;
  depositPence: number;
  displayText: string;
}

/**
 * Calculate deposit based on detailer's protection policy
 *
 * @param totalPence - Total booking amount in pence
 * @param protectionType - Type of protection: none, fixed, or percentage
 * @param protectionValue - Value: pence for fixed, percentage for percentage, null for none
 * @returns Deposit calculation with payment requirement and display text
 *
 * @example
 * calculateDeposit(18514, 'none', null)
 * // Returns: { requiresPayment: false, depositPence: 0, displayText: "No deposit required" }
 *
 * @example
 * calculateDeposit(18514, 'fixed', 2000)
 * // Returns: { requiresPayment: true, depositPence: 2000, displayText: "£20 deposit required" }
 *
 * @example
 * calculateDeposit(18514, 'percentage', 25)
 * // Returns: { requiresPayment: true, depositPence: 4629, displayText: "25% deposit required (£46.29)" }
 */
export function calculateDeposit(
  totalPence: number,
  protectionType: BookingProtectionType,
  protectionValue: number | null
): DepositCalculation {
  // CASE 1: No deposit required
  if (protectionType === "none") {
    return {
      requiresPayment: false,
      depositPence: 0,
      displayText: "No deposit required",
    };
  }

  // CASE 2: Fixed deposit
  if (protectionType === "fixed") {
    if (!protectionValue || protectionValue <= 0) {
      throw new Error("Fixed deposit requires a positive value");
    }

    const depositPounds = (protectionValue / 100).toFixed(2);
    return {
      requiresPayment: true,
      depositPence: protectionValue,
      displayText: `£${depositPounds} deposit required`,
    };
  }

  // CASE 3: Percentage deposit
  if (protectionType === "percentage") {
    if (!protectionValue || protectionValue <= 0 || protectionValue > 100) {
      throw new Error("Percentage deposit requires a value between 1 and 100");
    }

    const depositPence = Math.round((totalPence * protectionValue) / 100);
    const depositPounds = (depositPence / 100).toFixed(2);
    return {
      requiresPayment: true,
      depositPence,
      displayText: `${protectionValue}% deposit required (£${depositPounds})`,
    };
  }

  throw new Error(`Unknown protection type: ${protectionType}`);
}

/**
 * Format deposit info for display
 *
 * @param requiresPayment - Whether payment is required
 * @param depositPence - Deposit amount in pence
 * @returns Formatted display string
 */
export function formatDepositInfo(
  requiresPayment: boolean,
  depositPence: number
): string {
  if (!requiresPayment) {
    return "No deposit required";
  }
  const depositPounds = (depositPence / 100).toFixed(2);
  return `Deposit: £${depositPounds}`;
}

/**
 * Calculate remaining balance after deposit
 *
 * @param totalPence - Total booking amount in pence
 * @param depositPence - Deposit amount in pence
 * @returns Remaining balance in pence
 */
export function calculateRemainingBalance(
  totalPence: number,
  depositPence: number
): number {
  return Math.max(0, totalPence - depositPence);
}

/**
 * Format remaining balance for display
 *
 * @param totalPence - Total booking amount in pence
 * @param depositPence - Deposit amount in pence
 * @returns Formatted display string
 */
export function formatRemainingBalance(
  totalPence: number,
  depositPence: number
): string {
  const remainingPence = calculateRemainingBalance(totalPence, depositPence);
  if (remainingPence === 0) {
    return "Paid in full";
  }
  const remainingPounds = (remainingPence / 100).toFixed(2);
  return `Balance due on completion: £${remainingPounds}`;
}
