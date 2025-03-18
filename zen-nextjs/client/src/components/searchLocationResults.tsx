import { Address } from "@/config/models/geolocation";
import Icon from "@/ui/icon";
import Text from "@/ui/text";

type Props = {
  search: string;
  debouncedSearch: string;
  searchResults: Address[] | null;
  showSearchResults: boolean;
  loading: boolean;
  handleClick: (index: number) => void;
};

export default function SearchLocationResults({
  search,
  debouncedSearch,
  searchResults,
  showSearchResults,
  loading,
  handleClick,
}: Props) {
  return (
    <div className="absolute w-full bg-background">
      {search && showSearchResults && (
        <>
          {searchResults &&
            searchResults.map((location, index) => (
              <div
                key={index}
                className="flex items-center cursor-pointer hover:bg-tint"
                onClick={() => handleClick(index)}
              >
                <Icon name="location" size="base" className="ml-2" />
                <div className="p-2 w-full whitespace-nowrap overflow-hidden">
                  {location.street && (
                    <div>
                      <Text
                        level="sm bold"
                        customs="text-ellipsis overflow-hidden"
                      >
                        {location.street} {location.house_number}
                      </Text>
                      <Text level="sm" customs="text-ellipsis overflow-hidden">
                        {location.postalCode} {location.city},{" "}
                        {location.country}
                      </Text>
                    </div>
                  )}
                  {!location.street && location.city && (
                    <div>
                      <Text
                        level="sm bold"
                        customs="text-ellipsis overflow-hidden"
                      >
                        {location.city}
                      </Text>
                      <Text level="sm" customs="text-ellipsis overflow-hidden">
                        {location.postalCode
                          ? location.postalCode
                          : location.county}
                        {location.postalCode || location.county ? ", " : ""}
                        {location.country}
                      </Text>
                    </div>
                  )}
                  {!location.street && !location.city && (
                    <div>
                      <Text
                        level="sm bold"
                        customs="text-ellipsis overflow-hidden"
                      >
                        {location.county}
                      </Text>
                      <Text level="sm" customs="text-ellipsis overflow-hidden">
                        {location.country}
                      </Text>
                    </div>
                  )}
                </div>
              </div>
            ))}

          {searchResults?.length == 0 && debouncedSearch && !loading && (
            <div className="p-2 w-full">
              <Text level="sm">Keine Ergebnisse gefunden</Text>
            </div>
          )}

          {searchResults?.length == 0 && search && loading && (
            <div className="p-2 w-full">
              <Text level="sm">Loading</Text>
            </div>
          )}
        </>
      )}
    </div>
  );
}
