import { navItems } from "@/config/data/navItems";
import clsx from "clsx";
import NavItems from "./navItems";

interface Props {
  className: string;
}

export default function NavItemsList({ className }: Props) {
  // className sets the breakpoint for when the navlinks should be visible
  return (
    <div className={clsx("gap-header", className)}>
      {navItems.map((item, index) => (
        <div key={index} className={clsx(item.mobile && "lg:hidden")}>
          <NavItems
            text={item.text}
            type={item.type}
            link={item.link}
          />
        </div>
      ))}
    </div>
  );
}
