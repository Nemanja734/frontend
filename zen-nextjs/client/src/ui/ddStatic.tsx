"use client";

import Text from "./text";
import Icon from "./icon";
import { motion } from "motion/react";
import { useState } from "react";
import clsx from "clsx";
import Link from "next/link";

type Link = {
  text: string;
  href: string;
};

type Props = {
  ddButtonWidth: string;
  ddButtonText: string;
  ddItems: Link[];
};

export default function DdStatic({
  ddButtonWidth,
  ddButtonText,
  ddItems,
}: Props) {
  const [isOpen, setIsOpen] = useState(false);

  const toggleDropdown = () => {
    setIsOpen((prev) => !prev);
  };

  return (
    <ul className="overflow-hidden">
      <li
        aria-label="Navigation Section"
        className={clsx("flex justify-between cursor-pointer", ddButtonWidth)}
        onClick={toggleDropdown}
      >
        <Text level="base" customs="font-bold">
          {ddButtonText}
        </Text>
        <motion.div
          animate={{ rotate: isOpen ? "180deg" : 0 }}
          transition={{ duration: 0.3 }}
          className="w-fit"
        >
          <Icon name="chevDown" color="background" size="sm"></Icon>
        </motion.div>
      </li>

      <motion.li
        initial={false}
        animate={{ height: isOpen ? "auto" : 0, opacity: isOpen ? 1 : 0 }}
        transition={{ duration: 0.3 }}
        className="overflow-hidden"
      >
        <div className="grid gap-2 pt-2">
          {ddItems.map((item, index) => (
            <Link key={index} href={item.href} className="w-fit">
              {item.text}
            </Link>
          ))}
        </div>
      </motion.li>
    </ul>
  );
}
