import type { Metadata } from "next";
import { LoginForm } from "./login-form";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { APP_NAME } from "@/constants/routes";

export const metadata: Metadata = {
  title: "Sign In",
};

type LoginPageProps = {
  searchParams: Promise<{ redirect?: string }>;
};

export default async function LoginPage({ searchParams }: LoginPageProps) {
  const { redirect } = await searchParams;

  return (
    <Card className="w-full border-border/80 shadow-xl shadow-primary/5">
      <CardHeader className="space-y-1 pb-1 text-center">
        <CardTitle className="font-display text-2xl font-semibold tracking-tight">
          Selamat datang kembali
        </CardTitle>
        <CardDescription>Masuk ke akun {APP_NAME} staff Anda</CardDescription>
      </CardHeader>
      <CardContent className="pt-4">
        <LoginForm redirect={redirect} />
      </CardContent>
    </Card>
  );
}
