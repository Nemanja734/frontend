import { useOnClickOutside } from "@/lib/useOnClickOutside";
import { useEffect, useRef, useState } from "react";
import FilterButton from "./filterButton";
import ApplyFilter from "./applyFilter";
import InputNumber from "@/ui/inputNumber";

type Props = {
  minPrice: string;
  setMinPrice: (value: string) => void;
  maxPrice: string;
  setMaxPrice: (value: string) => void;
  reset: () => void;
  handleApply: () => void;
};

export default function PriceDropdown({
  minPrice,
  setMinPrice,
  maxPrice,
  setMaxPrice,
  reset,
  handleApply,
}: Props) {
  const [show, setShow] = useState(false);
  const [isActive, setIsActive] = useState(false);

  const ref = useRef(null);
  useOnClickOutside(ref, () => setShow(false));

  useEffect(() => {
    if (!show) handleApply();
  }, [show])

  useEffect(() => {
    if (minPrice.trim() || maxPrice.trim()) setIsActive(true);
    else setIsActive(false);
  }, [minPrice, maxPrice])

  return (
    <div ref={ref} className="relative">
      <FilterButton isActive={isActive} onClick={() => setShow(!show)}>Sortieren</FilterButton>

      {show && (
        <div className="absolute rounded-sm -bottom-2 translate-y-full w-max z-10 bg-background border-2 max-w-[300px]">
          <InputNumber
            value={minPrice}
            defaultPlaceholder="Von"
            onChange={(value) => setMinPrice(value)}
            ariaLabel="Preisuntergrenze"
          />
          <InputNumber
            value={maxPrice}
            defaultPlaceholder="Bis"
            onChange={(value) => setMaxPrice(value)}
            ariaLabel="Preisobergrenze"
          />
          <ApplyFilter handleReset={reset} handleApply={handleApply} />
        </div>
      )}
    </div>
  );
}
