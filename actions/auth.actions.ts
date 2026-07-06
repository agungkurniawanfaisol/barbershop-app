"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { loginSchema } from "@/schemas/auth.schema";
import { createClient } from "@/lib/supabase/server";
import { authService } from "@/services/auth.service";
import { resolvePostLoginRedirect, resolveRole } from "@/lib/auth/rbac";
import { ROUTES } from "@/constants/routes";
import { failure, type ActionResult } from "@/utils/result";

export async function signInAction(
  _prevState: ActionResult<void> | null,
  formData: FormData,
): Promise<ActionResult<void>> {
  const parsed = loginSchema.safeParse({
    email: formData.get("email"),
    password: formData.get("password"),
  });

  if (!parsed.success) {
    return failure(parsed.error.issues[0]?.message ?? "Invalid input");
  }

  const supabase = await createClient();
  const { data, error } = await supabase.auth.signInWithPassword({
    email: parsed.data.email,
    password: parsed.data.password,
  });

  if (error) {
    return failure(
      error.message === "Invalid login credentials"
        ? "Invalid email or password"
        : error.message,
    );
  }

  if (!data.user) {
    return failure("Authentication failed");
  }

  try {
    await authService.syncUser(data.user);
  } catch {
    return failure("Failed to sync user profile. Please try again.");
  }

  revalidatePath("/", "layout");
  const role = resolveRole(data.user.app_metadata);
  redirect(resolvePostLoginRedirect(formData.get("redirect"), role));
}

export async function signOutAction(): Promise<void> {
  const supabase = await createClient();
  await supabase.auth.signOut();
  revalidatePath("/", "layout");
  redirect(ROUTES.login);
}
