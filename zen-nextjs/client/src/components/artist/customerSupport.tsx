import Image from "next/image";
import Heading from "@/ui/heading";
import Text from "@/ui/text";
import Button from "@/ui/button";
import { routes } from "@/config/data/routes";

export default function CustomerSupportSection() {
  return (
    <div className="container grid md:grid-cols-2 md:content-center place-items-center md:gap-10">
      <div className="relative aspect-square md:aspect-auto md:h-[480px] w-full rounded-md mb-8 md:mb-0">
        <Image
          src="/customer-support.png"
          fill={true}
          alt="Picture of tattoo artist at an appointment"
          className="object-cover rounded-2xl"
        />
      </div>
      <div className="lg:mr-10 grid">
        <Heading
          level="heading-primary"
          className="max-w-[280px] md:max-w-[500px]"
        >
          Erstklassiger Kundensupport für deinen Erfolg
        </Heading>
        <Text level="text-base" customs="heading-primary-mb">
          Unser 24/7-Kundensupport antwortet innerhalb weniger Minuten in deiner
          Landessprache. Falls du Fragen hast oder dich über unser Angebot
          erkundigen möchtest, kannst du uns einfach kontaktieren. Wir sind für
          dich und deine Kund*innen da, bis auch wirklich der letzte Punkt des
          Tages gestochen wurde.
        </Text>
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