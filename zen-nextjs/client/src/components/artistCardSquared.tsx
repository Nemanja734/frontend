import Image from "next/image";
import ArtistTileInformation from "./artistCardInformation";

interface ArtistTileProp {
  portfolio: string[];
  firstName: string;
  lastName: string;
  postalCode: string;
  city: string;
  tattooStyle: string[];
  hourlyRate: number;
}

export default function ArtistCardSquared(prop: ArtistTileProp) {
  return (
    <div className="bg-background flex flex-col border-1 rounded-sm overflow-hidden h-full">
      <div className="grid grid-cols-2 gap-2 h-130">
        {prop.portfolio.slice(0, 4).map((image, index) => (
          <div key={index} className="relative h-full w-full">
            <Image
              src={image}
              fill
              alt={`Tattoo image ${index + 1}`}
              className="object-cover"
            />
          </div>
        ))}
      </div>

      <ArtistTileInformation {...prop} />
    </div>
  );
}
