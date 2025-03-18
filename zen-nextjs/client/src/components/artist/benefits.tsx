import Heading from "@/ui/heading";
import BenefitsCard from "./benefitsCard";
import Text from "@/ui/text";

export default function BenefitsSection() {
  return (
    <div className="text-center bg-primary-tint">
      <div className="container">
        <Heading level="heading-primary">
          Warum mit Zen zusammenarbeiten?
        </Heading>
        <div className="grid gap-3 lg:grid-cols-3">
          {benefits.map((benefit, index) => (
            <BenefitsCard
              key={index}
              color={benefit.color}
              image={benefit.image}
            >
              <Heading level="subheading-primary" className="mb-3">
                {benefit.title}
              </Heading>
              <Text level="text-base">{benefit.text}</Text>
            </BenefitsCard>
          ))}
        </div>
      </div>
    </div>
  );
}

const benefits = [
  {
    title: "Wachse mit Zen",
    text: "Nehme am aktiven Kundenstamm von Zen teil und steigere dadurch die Anzahl deiner Kundenanfragen als selbstständiger Tätowierer. Je besser deine Kunst ist, desto mehr Kundenanfragen erhältst du. Indem du Anfragen abschließt, erhältst du persönliche Bewertungen und baust dir so eine Reputation auf.",
    image: "/benefits-growth.png",
    color: "bg-[#edf6ca]",
  },
  {
    title: "Genieße mehr Flexibilität",
    text: "Mit Zen entscheidest du selbst, an welchen Tagen du arbeitest und wann dein Arbeitstag beginnt. Auch deinen Urlaub kannst du frei planen, ohne unsere Bestätigung. Wenn dir das Motiv eines Kunden nicht gefällt, kannst du es einfach ablehnen.",
    image: "/benefits-flexibility.png",
    color: "bg-[#f6e1b6]",
  },
  {
    title: "Erhöhe deine Sichtbarkeit",
    text: "Präsentiere deine Arbeit einem breiten Publikum, ohne auf sozialen Medien oder persönlichen Netzwerken angewiesen zu sein. Zen übernimmt Buchungen, Terminverwaltung und Abrechnung für dich, sodass du dich voll und ganz auf deine Kunst konzentrieren kannst.",
    image: "/benefits-visibility.png",
    color: "bg-[#f9d4d2]",
  },
];
