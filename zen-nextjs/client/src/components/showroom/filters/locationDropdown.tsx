import { useEffect, useRef, useState } from "react";
import FilterButton from "./filterButton";
import { Address, Coordinates } from "@/config/models/geolocation";
import ApplyFilter from "./applyFilter";
import SearchLocation from "@/components/searchLocation";
import { useOnClickOutside } from "@/lib/useOnClickOutside";

type Props = {
  coordinates: Coordinates | null,
  handleCoordinatesChange: (address: Address) => void,
  radius: number | null,
  handleRadiusChange: (radius: string) => void,
  applyLocationFilter: () => void,
  reset: () => void,
};

export default function LocationDropdown({
  coordinates,
  handleCoordinatesChange,
  radius,
  handleRadiusChange,
  applyLocationFilter,
  reset,
}: Props) {
  const [show, setShow] = useState(false);
  const [isActive, setIsActive] = useState(false);
  const ref = useRef(null);

  useOnClickOutside(ref, () => setShow(false));

  const toggleLocation = () => {
    setShow((prev) => !prev);
  };

  const handleApply = () => {
    setShow(false);
    applyLocationFilter();
  };

  useEffect(() => {
    if (coordinates) setIsActive(true);
    else setIsActive(false);
  }, [coordinates]);

  return (
    <div ref={ref} className="relative">
      <FilterButton isActive={isActive} onClick={() => toggleLocation()}>
        Sortieren
      </FilterButton>

      {show && (
        <div className="absolute rounded-sm -bottom-2 translate-y-full w-max z-10 bg-background border-2">
          <div className="p-4 grid gap-4">
            <SearchLocation
              handleClick={(address: Address) =>
                handleCoordinatesChange(address)
              }
            />

            <select defaultValue={radius ? radius : ""} onChange={e => handleRadiusChange(e.target.value)}>
              <option value={""} disabled>
                Umkreis (km)
              </option>
              <option value={10}>10 km</option>
              <option value={20}>20 km</option>
              <option value={50}>50 km</option>
              <option value={100}>100 km</option>
              <option value={150}>150 km</option>
              <option value={200}>200 km</option>
              <option value={250}>250 km</option>
              <option value={300}>300 km</option>
              <option value={400}>400 km</option>
            </select>
          </div>

          <ApplyFilter handleReset={reset} handleApply={handleApply} />
        </div>
      )}
    </div>
  );
}
