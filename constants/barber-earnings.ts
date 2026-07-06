export const EARNINGS_PERIODS = ["day", "week", "month"] as const;

export type EarningsPeriod = (typeof EARNINGS_PERIODS)[number];

export function isEarningsPeriod(value: string | undefined): value is EarningsPeriod {
  return value === "day" || value === "week" || value === "month";
}
