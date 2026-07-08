"use client";

import { siteConfig } from "@/config/site";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

function formatIdrDigits(value: number): string {
  if (!value) return "";
  return new Intl.NumberFormat(siteConfig.locale, {
    maximumFractionDigits: 0,
  }).format(value);
}

function parseIdrDigits(raw: string): number {
  const digits = raw.replace(/\D/g, "");
  if (!digits) return 0;
  return Number(digits);
}

type CurrencyInputProps = {
  id?: string;
  value: number;
  onValueChange: (value: number) => void;
  placeholder?: string;
  disabled?: boolean;
  className?: string;
  inputClassName?: string;
};

export function CurrencyInput({
  id,
  value,
  onValueChange,
  placeholder = "0",
  disabled,
  className,
  inputClassName,
}: CurrencyInputProps) {
  function handleChange(raw: string) {
    onValueChange(parseIdrDigits(raw));
  }

  return (
    <div className={cn("flex", className)}>
      <span
        className="inline-flex h-10 shrink-0 items-center rounded-l-lg border border-r-0 border-input bg-muted/60 px-3 text-sm font-semibold text-foreground"
        aria-hidden
      >
        Rp
      </span>
      <Input
        id={id}
        type="text"
        inputMode="numeric"
        autoComplete="off"
        placeholder={placeholder}
        value={value ? formatIdrDigits(value) : ""}
        onChange={(e) => handleChange(e.target.value)}
        disabled={disabled}
        className={cn(
          "h-10 rounded-l-none rounded-r-lg text-base font-semibold tabular-nums",
          inputClassName,
        )}
        aria-label="Jumlah dalam Rupiah"
      />
    </div>
  );
}
