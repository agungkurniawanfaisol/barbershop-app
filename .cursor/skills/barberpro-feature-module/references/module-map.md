# Module Map

| Route | Roles | Key files |
|-------|-------|-----------|
| `/dashboard` | * | `services/dashboard.service.ts`, `features/dashboard/` |
| `/cashier` | Admin, Manager, Cashier | `stores/pos.store.ts`, `actions/cashier.actions.ts` |
| `/customers` | Admin, Manager, Cashier | `features/customers/customer-manager.tsx` |
| `/employees` | Admin, Manager | `features/employees/employee-manager.tsx` |
| `/services` | Admin, Manager, Cashier | `features/services/service-manager.tsx` |
| `/transactions` | * | `features/transactions/transaction-list.tsx` |
| `/expenses` | Admin, Manager | `features/expenses/expense-manager.tsx` |
| `/reports` | Admin, Manager | `features/reports/report-viewer.tsx`, `utils/export/` |
| `/settings` | Admin, Manager | `features/settings/settings-form.tsx` |
| `/users` | Admin | `features/users/user-manager.tsx` |
| `/audit` | Admin, Manager | `features/audit/audit-log-list.tsx` |

`*` = all roles with dashboard access per `ROLE_ROUTES`.
