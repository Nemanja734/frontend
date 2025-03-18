"use client";

import { useRef, useState } from "react";
import SearchLocationResults from "./searchLocationResults";
import InputText from "@/ui/inputText";
import { useOnClickOutside } from "@/lib/useOnClickOutside";
import { useNominatimSearch } from "@/lib/useNominatimSearch";
import { Address } from "@/config/models/geolocation";

type Props = {
  handleClick: (address: Address) => void,
};

export default function SearchLocation({ handleClick }: Props) {
  const { search, debouncedSearch, setSearch, searchResults, loading } =
    useNominatimSearch();
  const [showSearchResults, setShowSearchResults] = useState(false);
  const searchResultsRef = useRef<HTMLDivElement | null>(null);

  useOnClickOutside(searchResultsRef, () => setShowSearchResults(false));

  // We always return an Address here
  const returnData = (index: number) => {
    setShowSearchResults(false);
    handleClick(searchResults![index])
  }

  const handleKeyDown = (event: React.KeyboardEvent<HTMLDivElement>) => {
    if (event.key === "Enter" && showSearchResults) {
      returnData(0);
    }
  }
  
  return (
    <div className="absolute left-1/2 -translate-x-1/2 lg:translate-0 lg:static lg:mr-auto w-fit md:w-70">
      <div
        ref={searchResultsRef}
        className="relative"
        onKeyDown={handleKeyDown}
      >
        <InputText
          defaultPlaceholder="Suche nach Standort"
          onChange={(value) => setSearch(value)}
          onClick={() => setShowSearchResults(true)}
          ariaLabel="Standort suchen"
        />
        <SearchLocationResults
          search={search}
          debouncedSearch={debouncedSearch}
          searchResults={searchResults}
          showSearchResults={showSearchResults}
          loading={loading}
          handleClick={(index: number) => returnData(index)}
        />
      </div>
    </div>
  );
}
