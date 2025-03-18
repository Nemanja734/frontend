"use client";

import { artists, tattooStyles } from "@/config/mock/artists";
import ArtistCardSwiper from "../artistCardSwiper";
import Heading from "@/ui/heading";
import { useState } from "react";
import FilterButton from "./filters/filterButton";
import SortDropdown from "./filters/sortDropdown";
import TattooStyleDropdown from "./filters/tattooStyleDropdown";
import { sorts } from "@/config/data/filter";
import { Artist } from "@/config/models/artist";
import LocationDropdown from "./filters/locationDropdown";
import { Address, Coordinates } from "@/config/models/geolocation";
import { useCalculateDistance } from "@/lib/useCalculateDistance";
import PriceDropdown from "./filters/priceDropdown";

export default function Wrapper() {
  // array of currently displayed artists
  const [filteredArtists, setFilteredArtists] = useState<Artist[] | undefined>(
    artists
  );

  const [sort, setSort] = useState(sorts);
  const [tattooStyle, setTattooStyle] = useState(tattooStyles);

  const [coordinates, setCoordinates] = useState<Coordinates | null>(null);
  const [radius, setRadius] = useState<number | null>(null);

  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");

  // Handle sort change on click
  const handleSortChange = (index: number) => {
    setSort((prevOptions) =>
      prevOptions.map((option, i) => ({
        ...option,
        isActive: i === index,
      }))
    );
  };

  // Apply sort
  const applySort = (artists: Artist[]) => {
    const activeSort = sort.find((option) => option.isActive === true);

    switch (activeSort!.text) {
      case "Am Beliebtesten":
        // Todo
        return artists;

      case "Neuerscheinungen":
        // Todo
        return artists;

      case "Niedrigster Preis":
        return artists.sort((a, b) => a.hourlyRate - b.hourlyRate);

      case "Höchster Preis":
        return artists.sort((a, b) => b.hourlyRate - a.hourlyRate);

      default:
        return artists;
    }
  };

  // Toggle tattoo style on click
  const handleTattooStyleChange = (style: string) => {
    setTattooStyle((currentStyles) => {
      // Check if style is already selected
      const isSelected = currentStyles.includes(style);

      // Select or unselect the style based on its current value
      let newStyles = isSelected
        ? currentStyles.filter((s) => s !== style)
        : [...currentStyles, style];

      // Return all styles if every style is checked
      if (
        newStyles.length === 0 ||
        currentStyles.length === tattooStyles.length
      ) {
        return currentStyles.length === tattooStyles.length
          ? [style]
          : tattooStyles;
      }

      return newStyles;
    });
  };

  const resetTattooStyle = () => {
    setTattooStyle(tattooStyles);
  };

  // Filter artists based on selected tattoo styles
  const filterByTattooStyle = (artists: Artist[]) => {
    if (tattooStyle.length === tattooStyles.length) {
      return artists; // No filtering needed, return all
    }

    return artists.filter((artist) =>
      artist.tattooStyle.some((style) => tattooStyle.includes(style))
    );
  };

  // Change the coordinates for location filter
  const handleCoordinatesChange = (address: Address) => {
    setCoordinates({ lat: address.lat, lon: address.lon });
  };

  const resetLocation = () => {
    setCoordinates(null);
    setRadius(null);
  };

  // Change the radius for location filter
  const handleRadiusChange = (radius: string) => {
    console.log(parseInt(radius));
    setRadius(parseInt(radius));
  };

  const filterByLocation = (artists: Artist[]) => {
    if (!coordinates || !radius) return artists;

    return artists.filter((artist) => {
      const distance = useCalculateDistance({
        lat1: artist.latitude,
        lon1: artist.longitude,
        lat2: coordinates.lat,
        lon2: coordinates.lon,
      });

      console.log(distance, radius);

      return distance <= radius;
    });
  };

  const resetPrice = () => {
    setMinPrice("");
    setMaxPrice("");
  };

  const filterByPrice = (artists: Artist[]) => {
    if (!minPrice && !maxPrice) return artists;
    console.log(minPrice, maxPrice);

    return artists.filter((artist) => {
      return (
        (minPrice === "" || parseInt(minPrice) <= artist.hourlyRate) &&
        (maxPrice === "" || parseInt(maxPrice) >= artist.hourlyRate)
      );
    });
  };

  // Run every filter criterion to create an updated list of artists
  const applyAllFilter = () => {
    // Create a new fresh array of artists
    let updatedArtists = [...artists];

    // Apply all filters and the sort at last
    updatedArtists = filterByTattooStyle(updatedArtists);
    updatedArtists = filterByLocation(updatedArtists);
    updatedArtists = filterByPrice(updatedArtists);
    updatedArtists = applySort(updatedArtists);

    // Update the displayed list of artists
    setFilteredArtists(updatedArtists);
  };

  // Reset the list of artists to the default list and reset the filters
  const resetAllFilter = () => {
    setFilteredArtists(artists);
    resetTattooStyle();
    resetLocation();
    resetPrice();
    setSort(sorts);
  };

  return (
    <div className="container">
      <Heading level="heading-primary">Unsere Künstler</Heading>

      <div className="heading-primary-mb flex gap-4">
        <SortDropdown
          sort={sort}
          handleSortChange={handleSortChange}
          applySort={applyAllFilter}
        />
        <TattooStyleDropdown
          tattooStyle={tattooStyle}
          handleTattooStyleChange={handleTattooStyleChange}
          applyTattooStyle={applyAllFilter}
          reset={resetTattooStyle}
        />
        <LocationDropdown
          coordinates={coordinates}
          handleCoordinatesChange={handleCoordinatesChange}
          radius={radius}
          handleRadiusChange={handleRadiusChange}
          applyLocationFilter={applyAllFilter}
          reset={resetLocation}
        />
        <PriceDropdown
          minPrice={minPrice}
          setMinPrice={(value) => setMinPrice(value)}
          maxPrice={maxPrice}
          setMaxPrice={(value) => setMaxPrice(value)}
          reset={resetPrice}
          handleApply={applyAllFilter}
        />

        <div className="ml-auto">
          <FilterButton reset onClick={resetAllFilter}></FilterButton>
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {filteredArtists &&
          filteredArtists.map((artist, index) => (
            <ArtistCardSwiper key={index} {...artist} />
          ))}
      </div>
    </div>
  );
}
