"use client";

import { input } from "@/config/styles";
import clsx from "clsx";
import { useState } from "react";

type Props = {
    value?: string,
    defaultPlaceholder: string,
    onChange: (value: string) => void,
    onClick?: () => void,
    ariaLabel: string,
    className?: string,
};

export default function InputNumber({
    value,
    defaultPlaceholder,
    onChange,
    onClick,
    ariaLabel,
    className,
}: Props) {
  const [placeholder, setPlaceholder] = useState(defaultPlaceholder);

  return (
    <input
      type="number"
      placeholder={placeholder}
      value={value}
      onFocus={() => setPlaceholder("")}
      onBlur={() => setPlaceholder(defaultPlaceholder)}
      onChange={(e) => onChange(e.target.value)}
      onClick={onClick}
      aria-label={ariaLabel}
      className={clsx(input, className)}
    />
  );
}
