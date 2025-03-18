import Image from "next/image";
import Heading from "@/ui/heading";
import Text from "@/ui/text";
import Button from "@/ui/button";
import { routes } from "@/config/data/routes";

export default function HowItWorksSection() {
  return (
    <div className="container md:pb-0! grid md:grid-cols-2 md:content-center place-items-center md:gap-10">
      <div className="relative aspect-square md:aspect-auto md:h-[480px] w-full rounded-md mb-8 md:mb-0 md:order-2">
        <Image
          src="/how-it-works.png"
          fill
          alt="Picture of tattoo artist at an appointment"
          className="object-cover rounded-2xl"
        />
      </div>

      <div className="lg:ml-10">
        <Heading level="heading-primary">
          So funktioniert Zen für Tätowierer
        </Heading>
        <div className="heading-primary-mb">
          <Text level="text-base" customs="mb-1.5">
            Ein*e Kund*in durchstöbert die Zen App und bucht einen Termin bei
            dir. Dabei gibt er den Stil, die Größe und das Motiv des gewünschten
            Tattoos an. Sobald du den Termin bestätigst, ist dein Part erledigt
            und der Kunde erhält die genaue Adresse deines Studios.
          </Text>
          <Text level="text-base">
            Am Tag des Termins besucht der Kunde dein Studio. Nach Abschluss des
            Tattoos fehlt nur noch die Bestätigung. Trage dazu die Start- und
            Endzeit in deinem Zen-Profil ein, um die genaue Dauer des Termins zu
            dokumentieren. Abschließend kannst du den Kunden freundlich um eine
            Rezension auf Zen bitten.
          </Text>
        </div>
        <Button
          href={routes.signup}
          level="primary-lg"
          className="w-[fit-content] m-auto"
        >
          Jetzt Registrieren
        </Button>
      </div>
    </div>
  );
}