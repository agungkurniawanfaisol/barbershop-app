"use client";

import Link from "next/link";
import { Fragment } from "react";
import { usePathname } from "next/navigation";
import { getNavBreadcrumbs } from "@/constants/navigation";
import { cn } from "@/lib/utils";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";

type AdminBreadcrumbsProps = {
  className?: string;
};

export function AdminBreadcrumbs({ className }: AdminBreadcrumbsProps) {
  const pathname = usePathname();
  const crumbs = getNavBreadcrumbs(pathname);

  return (
    <Breadcrumb className={cn("min-w-0", className)}>
      <BreadcrumbList className="flex-nowrap gap-1 text-xs sm:gap-1.5 sm:text-sm">
        {crumbs.map((crumb, index) => {
          const isLast = index === crumbs.length - 1;
          const Icon = crumb.icon;
          const hideOnMobile =
            index === 0 && crumbs.length > 1
              ? "hidden sm:list-item"
              : index > 0 && !isLast
                ? "hidden md:list-item"
                : undefined;

          return (
            <Fragment key={`${crumb.label}-${index}`}>
              {index > 0 ? (
                <BreadcrumbSeparator className="hidden text-muted-foreground/70 sm:list-item" />
              ) : null}
              <BreadcrumbItem className={hideOnMobile}>
                {isLast || crumb.current || !crumb.href ? (
                  <BreadcrumbPage className="flex max-w-[11rem] items-center gap-1.5 truncate font-medium sm:max-w-none">
                    {Icon ? (
                      <Icon
                        className="size-3.5 shrink-0 text-primary"
                        aria-hidden
                      />
                    ) : null}
                    <span className="truncate">{crumb.label}</span>
                  </BreadcrumbPage>
                ) : (
                  <BreadcrumbLink
                    render={<Link href={crumb.href} />}
                    className="flex max-w-[8rem] items-center gap-1.5 truncate sm:max-w-none"
                  >
                    {Icon ? (
                      <Icon className="size-3.5 shrink-0" aria-hidden />
                    ) : null}
                    <span className="truncate">{crumb.label}</span>
                  </BreadcrumbLink>
                )}
              </BreadcrumbItem>
            </Fragment>
          );
        })}
      </BreadcrumbList>
    </Breadcrumb>
  );
}
