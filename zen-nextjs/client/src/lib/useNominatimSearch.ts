import { Address, NominatimData } from "@/config/models/geolocation";
import { useCallback, useEffect, useState } from "react";
import { useDebounce } from "use-debounce";

export const useNominatimSearch = () => {
  const [search, setSearch] = useState("");
  const [debouncedSearch] = useDebounce(search, 500);
  const [searchResults, setSearchResults] = useState<Address[] | null>(null);
  const [loading, setLoading] = useState(false);

  // Extract addresses from nominatim data
  const extractAddress = (data: NominatimData[]) => {
    return data.map((location: NominatimData) => {
      const addr = location.address;

      return {
        country: addr.country || "",
        county: addr.county || "",
        city:
          addr.city ||
          addr.town ||
          addr.village ||
          addr.hamlet ||
          addr.locality ||
          "",
        postalCode: addr.postcode || "",
        street:
          addr.road ||
          addr.pedestrian ||
          addr.footway ||
          addr.path ||
          addr.square ||
          "",
        house_number: addr.house_number || "",
        lat: parseFloat(location.lat),
        lon: parseFloat(location.lon),
      };
    });
  };

  // Search in Nominatim
  const searchRequest = useCallback(async () => {
    if (!debouncedSearch.trim()) return;

    const request = `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(
      debouncedSearch
    )}&countrycodes=DE&addressdetails=1&layer=address&format=json`;

    try {
      const response = await fetch(request, {
        headers: { "User-Agent": "ZenTattooApp (contact@zen-tattoo.de)" },
      });

      const data = await response.json();

      setSearchResults(extractAddress(data));
    } catch (error) {
      console.error("Error fetching location data:", error);
    } finally {
      setLoading(false);
    }
  }, [debouncedSearch]);

  // Run the search every time the debouncedSearch changes
  useEffect(() => {
    if (debouncedSearch.trim()) {
      searchRequest();
    }
  }, [debouncedSearch, searchRequest]);

  // Turn loading to true and reset searchResults when initiating new search
  useEffect(() => {
    setLoading(true);
    setSearchResults([]);

    if (!search.trim()) {
      setLoading(false);
    }
  }, [search]);

  return { search, setSearch, debouncedSearch, searchResults, loading };
};
