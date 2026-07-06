import { formatDateTime } from "@/lib/format";
import type { AuditLogDto } from "@/services/audit.service";
import { DataTableCard } from "@/components/data/data-table-card";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

const ACTION_VARIANTS: Record<
  string,
  "default" | "secondary" | "destructive" | "outline"
> = {
  CREATE: "default",
  UPDATE: "secondary",
  DELETE: "destructive",
  INVITE: "outline",
};

type AuditLogListProps = {
  logs: AuditLogDto[];
};

function formatJson(value: unknown): string {
  if (value == null) return "—";
  try {
    const text = JSON.stringify(value);
    return text.length > 80 ? `${text.slice(0, 80)}…` : text;
  } catch {
    return String(value);
  }
}

export function AuditLogList({ logs }: AuditLogListProps) {
  return (
    <DataTableCard>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="pl-4 sm:pl-6">Waktu</TableHead>
            <TableHead>Pengguna</TableHead>
            <TableHead>Aksi</TableHead>
            <TableHead className="hidden md:table-cell">Entitas</TableHead>
            <TableHead className="hidden lg:table-cell">Detail</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {logs.map((log) => (
            <TableRow key={log.id}>
              <TableCell className="whitespace-nowrap pl-4 text-xs sm:pl-6 sm:text-sm">
                {formatDateTime(log.createdAt)}
              </TableCell>
              <TableCell>
                <div className="min-w-0 max-w-[8rem] sm:max-w-none">
                  <p className="truncate text-sm font-medium">
                    {log.userName ?? "System"}
                  </p>
                  {log.userEmail && (
                    <p className="truncate text-xs text-muted-foreground">
                      {log.userEmail}
                    </p>
                  )}
                </div>
              </TableCell>
              <TableCell>
                <Badge variant={ACTION_VARIANTS[log.action] ?? "secondary"}>
                  {log.action}
                </Badge>
              </TableCell>
              <TableCell className="hidden md:table-cell">
                <span className="font-mono text-xs">
                  {log.entity}
                  {log.entityId ? ` · ${log.entityId.slice(0, 8)}` : ""}
                </span>
              </TableCell>
              <TableCell className="hidden max-w-xs truncate text-xs text-muted-foreground lg:table-cell">
                {formatJson(log.newValue ?? log.oldValue)}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </DataTableCard>
  );
}
