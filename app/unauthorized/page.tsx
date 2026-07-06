import Link from "next/link";
import { ShieldX } from "lucide-react";
import { buttonVariants } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { ROUTES } from "@/constants/routes";
import { cn } from "@/lib/utils";

export const metadata = {
  title: "Unauthorized",
};

export default function UnauthorizedPage() {
  return (
    <main className="flex min-h-dvh items-center justify-center bg-background px-4">
      <Card className="w-full max-w-md text-center">
        <CardHeader>
          <div className="mx-auto mb-2 flex size-12 items-center justify-center rounded-xl bg-destructive/10 text-destructive">
            <ShieldX className="size-6" aria-hidden />
          </div>
          <CardTitle className="text-2xl">Access denied</CardTitle>
          <CardDescription>
            You do not have permission to view this page. Contact your
            administrator if you believe this is a mistake.
          </CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col gap-3 sm:flex-row sm:justify-center">
          <Link
            href={ROUTES.dashboard}
            className={cn(buttonVariants({ variant: "outline" }))}
          >
            Go to Dashboard
          </Link>
          <Link href={ROUTES.home} className={cn(buttonVariants())}>
            Back to Home
          </Link>
        </CardContent>
      </Card>
    </main>
  );
}
