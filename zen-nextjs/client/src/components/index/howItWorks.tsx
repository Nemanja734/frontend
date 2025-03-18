import Heading from "@/ui/heading";
import HowItWorksItem from "./howItWorksItem";
import Button from "@/ui/button";

export default function HowItWorks() {
  return (
    <div className="container">
      <Heading level="heading-primary" className="text-center">
        4 Schritte zum Traumtattoo
      </Heading>
      <div className="grid gap-2 heading-primary-mb md:grid-cols-2 xl:grid-cols-4">
        {items.map((item, index) => (
          <HowItWorksItem key={index} {...item} index={index} />
        ))}
      </div>
      <Button level="primary-lg" className="w-full sm:w-fit sm:mx-auto">
        Entdecke Tätowierer
      </Button>
    </div>
  );
}

const items = [
  {
    icon: "customize",
    title: "Wunschtattoo konfigurieren",
    text: (
      <>
        Nachdem du deinen Traumkünstler bei Zen gefunden hast, kannst du mit der
        Tattookonfiguration beginnen. Gib dabei den Tattoostil und die Größe
        deines Wunschtattoos an. Unser System berechnet anhand deinen Angaben
        eine erste Schätzung für die Dauer des Termins.
      </>
    ),
  },
  {
    icon: "calendar",
    title: "Den Tag des Termins bestimmen",
    text: (
      <>
        Bestimme den Tag des Termins und schließe deine Buchung ab. Bezahlt wird
        bei uns erst nach dem Termin. Nun heißt es abwarten. Sobald der
        Tätowierer deine Buchung bestätigt hat, ist dein Termin in trockenen
        Tüchern und du bekommst von uns eine Benachrichtigung per Email.
      </>
    ),
  },
  {
    icon: "phoenix",
    title: "Das Tattoo stechen lassen",
    text: (
      <>
        Es ist endlich soweit! Begebe dich am Tag deines Termins zur Adresse des
        Künstlers und lass dir dein neues Tattoo stechen. Die genaue Adresse
        bekommst du von uns, sobald der Tätowierer den Termin bestätigt hat.
      </>
    ),
  },
  {
    icon: "like",
    title: "Bezahlung und Rezension",
    text: (
      <>
        Nachdem dein Tattoo fertig ist, trägt der Tätowierer mit dir die
        tatsächliche Dauer des Termins in das System ein.&nbsp;
        <span className="font-semibold">
          Erst dann wird das Geld von deinem Konto abgebucht.
        </span>
        &nbsp;Lasse zum Abschluss noch eine Rezension auf Zen da, um den
        Künstler bei seiner Arbeit zu unterstützen.
      </>
    ),
  },
];
