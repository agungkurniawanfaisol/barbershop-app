"use client";

import { useActionState } from "react";
import { Loader2 } from "lucide-react";
import { signInAction } from "@/actions/auth.actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

type LoginFormProps = {
  redirect?: string;
};

export function LoginForm({ redirect }: LoginFormProps) {
  const [state, formAction, isPending] = useActionState(signInAction, null);

  return (
    <form action={formAction} className="space-y-3.5">
      {redirect ? (
        <input type="hidden" name="redirect" value={redirect} />
      ) : null}
      <div className="space-y-2">
        <Label htmlFor="email">Email</Label>
        <Input
          id="email"
          name="email"
          type="email"
          placeholder="nama@barbershop.com"
          autoComplete="email"
          required
          disabled={isPending}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="password">Password</Label>
        <Input
          id="password"
          name="password"
          type="password"
          placeholder="••••••••"
          autoComplete="current-password"
          required
          disabled={isPending}
        />
      </div>

      {state && !state.success && (
        <p className="text-sm text-destructive" role="alert">
          {state.error}
        </p>
      )}

      <Button
        type="submit"
        className="landing-shine h-11 w-full bg-accent hover:bg-accent/90"
        disabled={isPending}
      >
        {isPending ? (
          <>
            <Loader2 className="size-4 animate-spin" aria-hidden />
            Signing in…
          </>
        ) : (
          "Masuk"
        )}
      </Button>
    </form>
  );
}
