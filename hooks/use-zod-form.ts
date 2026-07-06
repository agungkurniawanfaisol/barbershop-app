"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import {
  useForm,
  type FieldValues,
  type Resolver,
  type UseFormProps,
} from "react-hook-form";
import type { z } from "zod";

/**
 * React Hook Form + Zod bridge.
 * Uses type assertion for Zod v4 compatibility with @hookform/resolvers.
 */
export function useZodForm<T extends FieldValues>(
  schema: z.ZodType<T>,
  options?: Omit<UseFormProps<T>, "resolver">,
) {
  return useForm<T>({
    resolver: zodResolver(schema as never) as Resolver<T>,
    mode: "onBlur",
    ...options,
  });
}
