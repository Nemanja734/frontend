import { routes } from "@/config/data/routes";
import Button from "@/ui/button";
import Heading from "@/ui/heading";
import Text from "@/ui/text";
import Image from "next/image";

export default function Bento() {
  return (
    <div className="container grid grid-rows-3 md:grid-rows-[1.4fr_1fr] md:grid-cols-2 h-[1200px] md:h-[800px] lg:h-[1000px] gap-4">
      <div className="relative grid place-items-center text-center p-8 gap-8 md:col-span-2">
        <Image
          src="/home_bento-3.jpg"
          alt="Tattoo artist at an appointment"
          fill
          className="object-cover rounded-lg -z-10"
        />
        <Heading level="subheading-primary" className="text-white self-end">
          Für Künstler*innen
        </Heading>
        <Heading level="heading-primary" className="text-white mb-0! max-w-[800px]">
          80% weniger Gebühren für die ersten 20 Anmeldungen
        </Heading>
        <Button
          level="transparent-sm"
          className="self-start"
          href={routes.artist}
        >
          Jetzt loslegen
        </Button>
      </div>

      <div className="relative flex flex-col p-8">
        <Image
          src="/home_bento-2.jpg"
          alt="Man with colored full body tattoo"
          fill
          className="object-cover rounded-lg -z-10"
        />
        <Heading level="subheading-primary" className="text-white mb-3">
          Tattoostile im Überblick
        </Heading>
        <Text level="base" customs="font-bold text-white mb-auto">
          Es gibt verschiedenste Tattoostile, die jeweils unterschiedliche
          Merkmale haben.
        </Text>
        <Button
          level="transparent-sm"
          className="self-start"
          href={routes.blog_tattooStyles}
        >
          Mehr erfahren
        </Button>
      </div>

      <div className="relative flex flex-col p-8">
        <Image
          src="/home_bento-1.jpg"
          alt="Close up image of tattoo needle in action"
          fill
          className="object-cover rounded-lg -z-10"
        />
        <Heading level="subheading-primary" className="text-white mb-3">
          Aftercare nach dem Tattoo
        </Heading>
        <Text level="base" customs="font-bold text-white mb-auto">
          Wenn es darum geht, das Tattoo nach dem Termin vor Schmutz und
          Trockenheit zu bewahren.
        </Text>
        <Button
          level="transparent-sm"
          className="self-start"
          href={routes.blog_aftercare}
        >
          Mehr erfahren
        </Button>
      </div>
    </div>
  );
}
