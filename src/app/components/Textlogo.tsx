"use client";

import Link from "next/link";
import type { ComponentProps } from "react";
import { cn } from "@/lib/utils";

interface TextLogoProps extends ComponentProps<"span"> {
  sxText?: string;
}

export function TextLogo({ className, sxText, ...restProps }: TextLogoProps) {
  return (
    <span
      className={cn(
        "flex w-fit items-center justify-center font-bold text-app-text-dark-500",
        className,
      )}
      {...restProps}
    >
      <div>
        <Link className="text-2xl font-semibold text-primary-900" href="/">
          <span className="text-4xl text-primary">C</span>ompareX
        </Link>
      </div>
    </span>
  );
}
