# My Earnings (`/my-earnings`)

**Audience:** BARBER role only  
**Purpose:** Personal haircut count and commission (day / week / month)

## Layout

- Period tabs: Hari | Minggu | Bulan (`?period=week|month`)
- Summary cards: Jumlah potong, Komisi saya, Rate komisi
- Transaction list: number, date, customer, net layanan, commission

## Data rules

- Only transactions where `barberId` matches linked `Employee.userId`
- Commission from snapshot (`barberCommissionAmount`) when present
- Barber does **not** see shop totals or other barbers' data

## Tokens

- Primary `#2563EB`, accent `#059669` for commission amounts
- Mobile: card list; desktop: table via `ResponsiveTable`
