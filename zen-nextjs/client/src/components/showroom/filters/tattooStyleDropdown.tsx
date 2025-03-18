import ApplyFilter from "./applyFilter";
import { useEffect, useRef, useState } from "react";
import { tattooStyles } from "@/config/mock/artists";
import FilterButton from "./filterButton";
import clsx from "clsx";
import Icon from "@/ui/icon";
import { useOnClickOutside } from "@/lib/useOnClickOutside";
import { dropdownOption } from "@/config/styles";

interface Props {
  tattooStyle: string[];
  handleTattooStyleChange: (style: string) => void;
  reset: () => void;
  applyTattooStyle: () => void;
}

export default function TattooStyleDropdown({
  tattooStyle,
  handleTattooStyleChange,
  reset,
  applyTattooStyle,
}: Props) {
  const [show, setShow] = useState(false);
  const [isActive, setIsActive] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  // Toggle dropdown
  const toggleSort = () => {
    setShow((prev) => !prev);
  };

  // Event listener for click outside
  useOnClickOutside(ref, () => {
    if (show) {
      setShow(false);
    }
  });

  // Run the filter everytime the dropdown toggles
  useEffect(() => {
    if (!show) handleApply();
  }, [show]);

  // Stop showing the sort and utilize the callback function
  const handleApply = () => {
    setShow(false);
    applyTattooStyle();
  };

  // Helper function to check if any style is selected in the first place
  const styleSelected = () => {
    return !(tattooStyle.length === tattooStyles.length);
  };

  // Change the button style if the filter is active
  useEffect(() => {
    if (styleSelected()) setIsActive(true);
    else setIsActive(false);
  }, [tattooStyle]);

  return (
    <div ref={ref} className="relative">
      <FilterButton isActive={isActive} onClick={toggleSort}>Tattoostil</FilterButton>

      {show && (
        <ul className="absolute rounded-sm -bottom-2 translate-y-full w-max z-10 bg-background border-2">
          <div className="h-[420px] overflow-y-scroll">

          {tattooStyles.map((option, index) => (
            <li
              key={index}
              onClick={() => handleTattooStyleChange(option)}
              className={clsx(
                dropdownOption,
                "p-4 hover:bg-tint cursor-pointer border-tone flex justify-between items-center [&:not(:nth-last-child(-n+1))]:border-b",
                tattooStyle.includes(option) && styleSelected() && "font-bold"
              )}
            >
              {option}
              {tattooStyle.includes(option) && styleSelected() && (
                <Icon name="checkCircle" size="base" />
              )}
            </li>
          ))}
          </div>

          <ApplyFilter handleReset={reset} handleApply={handleApply} />
        </ul>
      )}
    </div>
  );
}
