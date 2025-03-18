import Button from "@/ui/button";
import Text from "@/ui/text";
import TattooStyleTags from "@/ui/tattooStyleTags";

interface Prop {
  firstName: string;
  lastName: string;
  postalCode: string;
  city: string;
  tattooStyle: string[];
  hourlyRate: number;
}

export default function ArtistCardInformation(prop: Prop) {
  const rate = prop.hourlyRate.toFixed(2).replace(".", ",");

  return (
    <div className="flex flex-col gap-2 p-4 pb-8 md:pb-4">
      <div>
        <Text level="xl" customs="font-normal!">
          {prop.firstName} {prop.lastName}
        </Text>
        <Text level="base">
          {prop.postalCode}, {prop.city}
        </Text>
      </div>
      <TattooStyleTags styles={prop.tattooStyle} />
      <Text level="xl" customs="font-normal!">
        {rate} €
      </Text>
      <Button level="stroke-sm" className="w-fit">
        Portfolio anzeigen
      </Button>
    </div>
  );
}
