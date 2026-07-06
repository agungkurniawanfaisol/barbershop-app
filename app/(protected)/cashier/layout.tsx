export default function CashierLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="-m-2 flex min-h-0 flex-1 flex-col overflow-hidden sm:-m-3 lg:-m-4">
      <div className="flex min-h-0 flex-1 flex-col overflow-hidden p-2 sm:p-3 lg:p-4">
        {children}
      </div>
    </div>
  );
}
