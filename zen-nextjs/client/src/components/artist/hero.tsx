import Heading from "@/ui/heading";
import Text from "@/ui/text";
import Button from "@/ui/button";
import { routes } from "@/config/data/routes";

export default function HeroSection() {
  return (
    <div className="container grid gap-6 text-center">
      <Heading level="title-secondary" className="max-w-[1100px] m-auto">
        Mehr Kund*innen erreichen & dein Business mit Zen erweitern
      </Heading>

      <Text level="base">
        Werde Zen-Partner, um unabhängig von Studios zu arbeiten und mehr Gewinn
        aus deiner Kunst zu erzielen.
      </Text>

      <Button
        href={routes.signup}
        level="primary-lg"
        className="w-[fit-content] m-auto"
      >
        Jetzt Registrieren
      </Button>
    </div>
  );
}