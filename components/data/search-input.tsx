"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { Search, X } from "lucide-react";
import { useCallback, useEffect, useState, useTransition } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

type SearchInputProps = {
  placeholder?: string;
  paramKey?: string;
  debounceMs?: number;
  className?: string;
};

export function SearchInput({
  placeholder = "Search…",
  paramKey = "search",
  debounceMs = 300,
  className,
}: SearchInputProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();
  const initial = searchParams.get(paramKey) ?? "";
  const [value, setValue] = useState(initial);

  useEffect(() => {
    setValue(initial);
  }, [initial]);

  const pushSearch = useCallback(
    (term: string) => {
      const params = new URLSearchParams(searchParams.toString());
      if (term) {
        params.set(paramKey, term);
      } else {
        params.delete(paramKey);
      }
      params.delete("page");

      startTransition(() => {
        router.push(`?${params.toString()}`);
      });
    },
    [router, searchParams, paramKey],
  );

  useEffect(() => {
    if (value === initial) return;

    const timer = window.setTimeout(() => {
      pushSearch(value);
    }, debounceMs);

    return () => window.clearTimeout(timer);
  }, [value, initial, debounceMs, pushSearch]);

  function clearSearch() {
    setValue("");
    pushSearch("");
  }

  return (
    <div className={cn("relative w-full min-w-0", className)}>
      <Search
        className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground"
        aria-hidden
      />
      <Input
        placeholder={placeholder}
        value={value}
        onChange={(e) => setValue(e.target.value)}
        className="pr-9 pl-9"
        aria-label={placeholder}
        disabled={isPending}
      />
      {value ? (
        <Button
          type="button"
          variant="ghost"
          size="icon-sm"
          className="absolute top-1/2 right-1 size-8 -translate-y-1/2 text-muted-foreground"
          onClick={clearSearch}
          aria-label="Clear search"
        >
          <X className="size-3.5" aria-hidden />
        </Button>
      ) : null}
    </div>
  );
}
