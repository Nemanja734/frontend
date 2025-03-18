"use client";

import Overlay from "@/layout/overlay";
import Icon from "@/ui/icon";
import { useRef, useState } from "react";
import NavItemsList from "./navItemsList";
import { motion, AnimatePresence } from "motion/react";
import { useOnClickOutside } from "@/lib/useOnClickOutside";

interface Props {
  className: string;
}

export default function NavAside({ className }: Props) {
  const iconSize = 28;

  const [showAside, setShowAside] = useState(false);

  // Ref for closing the menu container on outside click
  const menuRef = useRef<HTMLDivElement>(null);

  useOnClickOutside(menuRef, () => setShowAside(false));

  return (
    <div className={className}>
      <Icon
        name="menu"
        sizeComputed={iconSize}
        className="cursor-pointer"
        onClick={() => setShowAside(!showAside)}
      ></Icon>
      <AnimatePresence mode="wait" initial={false}>
        {showAside && (
          <div>
            <motion.div
              key="overlay"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
            >
              <Overlay />
            </motion.div>

            <motion.div
              key="aside"
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ duration: 0.3 }}
              ref={menuRef}
              className="bg-background z-10 fixed right-0 top-0 w-full h-[100dvh] sm:w-[300px] p-10"
            >
              <Icon
                name="close"
                sizeComputed={iconSize}
                className="ml-auto cursor-pointer"
                onClick={() => setShowAside(false)}
              ></Icon>
              <NavItemsList className="grid gap-9! mt-10" />
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
