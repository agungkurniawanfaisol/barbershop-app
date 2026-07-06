/** Client-safe expense category enum — mirrors Prisma ExpenseCategory */
export const ExpenseCategory = {
  RENT: "RENT",
  UTILITIES: "UTILITIES",
  SUPPLIES: "SUPPLIES",
  SALARY: "SALARY",
  MARKETING: "MARKETING",
  MAINTENANCE: "MAINTENANCE",
  OTHER: "OTHER",
} as const;

export type ExpenseCategory =
  (typeof ExpenseCategory)[keyof typeof ExpenseCategory];

export const EXPENSE_CATEGORY_LABELS: Record<ExpenseCategory, string> = {
  [ExpenseCategory.RENT]: "Rent",
  [ExpenseCategory.UTILITIES]: "Utilities",
  [ExpenseCategory.SUPPLIES]: "Supplies",
  [ExpenseCategory.SALARY]: "Salary",
  [ExpenseCategory.MARKETING]: "Marketing",
  [ExpenseCategory.MAINTENANCE]: "Maintenance",
  [ExpenseCategory.OTHER]: "Other",
};

export const EXPENSE_CATEGORY_OPTIONS = Object.entries(
  EXPENSE_CATEGORY_LABELS,
).map(([value, label]) => ({ value, label }));
