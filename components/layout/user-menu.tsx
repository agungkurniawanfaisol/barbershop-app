"use client";

import { LogOut } from "lucide-react";
import { signOutAction } from "@/actions/auth.actions";
import { ROLE_LABELS, UserRole } from "@/constants/roles";
import type { SessionUser } from "@/types/auth";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

type UserMenuProps = {
  user: SessionUser;
};

function getInitials(name: string): string {
  return name
    .split(" ")
    .map((part) => part[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
}

export function UserMenu({ user }: UserMenuProps) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        className="flex min-h-9 min-w-11 items-center justify-center gap-2 rounded-lg px-2 py-1.5 outline-none focus-visible:ring-2 focus-visible:ring-ring"
        aria-label="Open user menu"
      >
        <Avatar className="size-8">
          {user.avatarUrl ? (
            <AvatarImage src={user.avatarUrl} alt={user.fullName} />
          ) : null}
          <AvatarFallback>{getInitials(user.fullName)}</AvatarFallback>
        </Avatar>
        <div className="hidden text-left sm:block">
          <p className="text-sm font-medium leading-none">{user.fullName}</p>
          <p className="text-xs text-muted-foreground">
            {ROLE_LABELS[user.role as UserRole]}
          </p>
        </div>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56">
        <DropdownMenuLabel>
          <div className="flex flex-col gap-1">
            <span>{user.fullName}</span>
            <span className="text-xs font-normal text-muted-foreground">
              {user.email}
            </span>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem variant="destructive" className="p-0">
          <form action={signOutAction} className="w-full">
            <button
              type="submit"
              className="flex min-h-9 w-full cursor-pointer items-center gap-2 px-3"
            >
              <LogOut className="size-4" aria-hidden />
              Sign out
            </button>
          </form>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
