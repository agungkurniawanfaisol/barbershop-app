"use client";

import { useEffect } from "react";
import { AlertTriangle, RotateCcw } from "lucide-react";
import { Button } from "@/components/ui/button";

type ProtectedErrorProps = {
  error: Error & { digest?: string };
  reset: () => void;
};

export default function ProtectedError({ error, reset }: ProtectedErrorProps) {
  useEffect(() => {
    console.error("Protected route error:", error);
  }, [error]);

  return (
    <div className="flex min-h-[50vh] flex-col items-center justify-center px-4 text-center">
      <div className="app-card flex max-w-md flex-col items-center gap-4 p-8">
        <div className="flex size-12 items-center justify-center rounded-xl bg-destructive/10 text-destructive">
          <AlertTriangle className="size-6" aria-hidden />
        </div>
        <div className="space-y-2">
          <h2 className="text-lg font-semibold tracking-tight">
            Gagal memuat halaman
          </h2>
          <p className="text-sm text-muted-foreground">
            Terjadi kesalahan server. Coba muat ulang halaman ini.
          </p>
          {error.digest ? (
            <p className="font-mono text-xs text-muted-foreground">
              Digest: {error.digest}
            </p>
          ) : null}
        </div>
        <Button onClick={reset} className="min-h-9">
          <RotateCcw className="size-4" aria-hidden />
          Muat ulang
        </Button>
      </div>
    </div>
  );
}
