"use client";

import { useState } from "react";
import { formatIdPhone, stripToLocalDigits } from "@/lib/phone";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

type PhoneInputProps = {
  id: string;
  name: string;
  defaultValue?: string;
  placeholder?: string;
  required?: boolean;
  disabled?: boolean;
  className?: string;
};

export function PhoneInput({
  id,
  name,
  defaultValue = "",
  placeholder = "8123456789",
  required,
  disabled,
  className,
}: PhoneInputProps) {
  const [localDigits, setLocalDigits] = useState(() =>
    stripToLocalDigits(defaultValue),
  );

  function handleChange(value: string) {
    const digits = value.replace(/\D/g, "");
    const normalized = digits.startsWith("0") ? digits.slice(1) : digits;
    setLocalDigits(normalized);
  }

  const fullPhone = formatIdPhone(localDigits);

  return (
    <div className={cn("flex", className)}>
      <span
        className="inline-flex h-9 shrink-0 items-center rounded-l-xl border border-r-0 border-input bg-muted/50 px-2.5 text-xs font-semibold text-foreground tabular-nums"
        aria-hidden
      >
        +62
      </span>
      <Input
        id={id}
        type="tel"
        inputMode="numeric"
        autoComplete="tel-national"
        placeholder={placeholder}
        value={localDigits}
        onChange={(e) => handleChange(e.target.value)}
        required={required}
        disabled={disabled}
        className="h-9 rounded-l-none rounded-r-xl"
        aria-describedby={`${id}-prefix`}
      />
      <span id={`${id}-prefix`} className="sr-only">
        Nomor telepon Indonesia, awalan +62
      </span>
      <input type="hidden" name={name} value={fullPhone} />
    </div>
  );
}
