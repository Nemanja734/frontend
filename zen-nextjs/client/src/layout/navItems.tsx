"use client"

import { usePathname } from "next/navigation";
import Button from "@/ui/button";
import Link from "next/link";
import clsx from "clsx";

interface Props {
    text: string,
    type: string,
    link: string
}

export default function NavItems({text, type, link}: Props) {
    const pathname = usePathname();
    const isActive = pathname === link;

  return(
    <div>
    {type == "link" ? (
      <Link href={link} className={clsx("hover:text-primary", (isActive && "text-primary underline underline-offset-2"))}>
        {text}
      </Link>
    ) : (
      <Button
        href={link}
        level="primary-sm"
        className="w-full text-center"
      >
        {text}
      </Button>
    )}
  </div>
  )
}
