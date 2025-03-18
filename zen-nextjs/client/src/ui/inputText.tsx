"use client"

import { input } from "@/config/styles";
import { useState } from "react";

type Props = {
    defaultPlaceholder: string,
    onChange: (value: string) => void,
    onClick?: () => void,
    ariaLabel: string,
}

export default function InputText({ defaultPlaceholder, onChange, onClick, ariaLabel }: Props) {
    const [placeholder, setPlaceholder] = useState(defaultPlaceholder);

  return (
    <input
      type="text"
      className={input}
      placeholder={placeholder}
      onFocus={() => setPlaceholder("")}
      onBlur={() => setPlaceholder(defaultPlaceholder)}
      onChange={(e) => onChange(e.target.value)}
      onClick={onClick}
      aria-label={ariaLabel}
    />
  );
}
