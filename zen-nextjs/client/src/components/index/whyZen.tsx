import WhyZenCard from "./whyZenCard";

export default function WhyZen() {
  return (
    <div className="bg-tint">
      <div className="container grid gap-5 md:grid-cols-3">
    {cards.map((card, index) => (
        <WhyZenCard key={index} icon={card.icon} title={card.title} text={card.text} />
    ))}
  </div>
    </div>
  );
}

const cards = [
  {
    icon: "calendar",
    title: "Einfache Terminabwicklung",
    text: "Der Prozess für die Terminabwicklung ist kinderleicht: Gib einfach die Größe, den Tattoostil und das Datum ein - und das war’s! Bezahlt wird erst nach dem Termin.",
  },
  {
    icon: "verified",
    title: "Handverlesene Tätowierer",
    text: "Die Identität und Portfolios unserer Künstler werden sorgfältig unter die Lupe genommen. Du kannst dir also der Integrität jedes einzelnen Künstlers zu 100% sicher sein.",
  },
  {
    icon: "businessTime",
    title: "Exakte Preisberechnung",
    text: "Anders als bei herkömmlichen Tattoostudios bezahlst du bei Zen erst nach dem Termin. So verhindern wir, dass du nicht versehentlich zu viel zahlst, falls der Termin mal kürzer gedauert hat als geplant.",
  },
];
