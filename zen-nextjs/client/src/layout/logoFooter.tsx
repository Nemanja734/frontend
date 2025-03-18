import Link from "next/link";
import Image from "next/image";
import { routes } from "@/config/data/routes";

export default function LogoFooter({ width }: { width: string }) {
  return (
    <Link
      href={routes.home}
      className="relative"
      style={{ height: `calc(0.416346 * ${width}px)`, width: `${width}px` }}
    >
      <Image src="/ZenLogoFooter.svg" fill={true} alt="Zen Logo" />
    </Link>
  );
}