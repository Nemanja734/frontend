"use client";

import clsx from "clsx";
import Link from "next/link";

interface Props {
  level: string;
  className?: string;
  href?: string;
  onClick?: () => void;
  type?: "submit" | "reset" | "button" | undefined; // Used for forms
  children: React.ReactNode;
  disabled?: boolean;
}

export default function Button({
  level,
  className,
  href,
  onClick,
  type = "button",
  children,
  disabled = false,
}: Props) {
  const standard = "cursor-pointer flex justify-center align-center";

  const styles: Record<string, string> = {
    "primary-lg":
      "bg-primary px-10 h-[48px] items-center rounded-sm text-background font-semibold shadow-lg shadow-primary/50",
    "primary-sm":
      "bg-primary px-5 py-2 rounded-sm text-background font-semibold shadow-sm shadow-primary/50",

    "stroke-lg":
      "bg-background px-8 h-[48px] items-center rounded-sm text-foreground border-2",
    "stroke-sm":
      "bg-background px-4 h-[42px] items-center rounded-sm text-foreground border-2",

    "black-lg":
    "bg-foreground px-8 h-[48px] items-center rounded-sm text-white border-2 border-black",

    "transparent-sm":
      "bg-tone-transparent px-5 py-2 rounded-full text-white font-bold",
  };

  if (href) {
    return (
      <Link href={href} className={clsx(standard, styles[level], className)}>
        {children}
      </Link>
    );
  } else {
    return (
      <button
        onClick={onClick}
        type={type}
        className={clsx(standard, styles[level], className)}
        disabled={disabled}
      >
        {children}
      </button>
    );
  }
}
