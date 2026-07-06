import { z } from "zod";

export const reportTypes = [
  "profit-loss",
  "revenue",
  "transactions",
  "expenses",
] as const;

export type ReportType = (typeof reportTypes)[number];

export const reportFilterSchema = z.object({
  type: z.enum(reportTypes).default("profit-loss"),
  from: z.string().optional(),
  to: z.string().optional(),
});

export type ReportFilterInput = z.infer<typeof reportFilterSchema>;
