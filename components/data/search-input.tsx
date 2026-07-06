"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { Search } from "lucide-react";
import { useCallback, useState, useTransition } from "react";
import { Input } from "@/components/ui/input";

type SearchInputProps = {
  placeholder?: string;
  paramKey?: string;
};

export function SearchInput({
  placeholder = "Search…",
  paramKey = "search",
}: SearchInputProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();
  const [value, setValue] = useState(searchParams.get(paramKey) ?? "");

  const handleSearch = useCallback(
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

  return (
    <div className="relative w-full min-w-0">
      <Search
        className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground"
        aria-hidden
      />
      <Input
        placeholder={placeholder}
        value={value}
        onChange={(e) => {
          setValue(e.target.value);
          handleSearch(e.target.value);
        }}
        className="pl-9"
        aria-label={placeholder}
        disabled={isPending}
      />
    </div>
  );
}
