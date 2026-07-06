"use client";

import Link from "next/link";
import { Scissors } from "lucide-react";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { APP_NAME } from "@/constants/routes";
import { ROUTES } from "@/constants/routes";

export default function HomePage() {
  return (
    <main className="flex min-h-dvh flex-col items-center justify-center bg-background px-4">
      <div className="mx-auto flex w-full max-w-lg flex-col items-center gap-8 text-center">
        <div className="flex size-16 items-center justify-center rounded-2xl bg-primary text-primary-foreground shadow-md">
          <Scissors className="size-8" aria-hidden />
        </div>

        <div className="space-y-2">
          <h1 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
            {APP_NAME}
          </h1>
          <p className="text-muted-foreground">
            Enterprise barbershop management and point-of-sale system
          </p>
        </div>

        <Card className="w-full text-left">
          <CardHeader>
            <CardTitle>Get Started</CardTitle>
            <CardDescription>
              Sign in to access your dashboard, POS, and management tools.
            </CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col gap-3 sm:flex-row">
            <Link
              href={ROUTES.login}
              className={cn(buttonVariants({ size: "lg" }), "flex-1")}
            >
              Sign In
            </Link>
            <Link
              href={ROUTES.dashboard}
              className={cn(
                buttonVariants({ variant: "outline", size: "lg" }),
                "flex-1",
              )}
            >
              Dashboard
            </Link>
          </CardContent>
        </Card>
      </div>
    </main>
  );
}
