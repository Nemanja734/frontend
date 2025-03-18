import Heading from "@/ui/heading";
import FaqItem from "../faqItem";
import Link from "next/link";
import { routes } from "@/config/data/routes";

export default function Faq() {
  return (
    <div className="container">
      <Heading level="heading-primary" className="text-center">
        Häufig gestellte Fragen
      </Heading>
      <div className="grid gap-2 md:gap-3">
        {faqData.map((item, index) => (
          <FaqItem key={index} {...item}></FaqItem>
        ))}
      </div>
    </div>
  );
}

const faqData = [
  {
    question: "Wie wird der Preis für das Tattoo berechnet?",
    answer: (
      <>
        Der endgültige Preis wird nach Abschluss des Tattoos berechnet.
        Gemeinsam mit deinem Tätowierer bestätigst du die tatsächliche Dauer des
        Termins. Anschließend wird die Dauer mit dem Stundenlohn multipliziert
        und der entsprechende Betrag von deinem Konto abgebucht. Falls der
        Termin kürzer als ursprünglich geschätzt ausfällt, zahlst du
        dementsprechend auch weniger.
      </>
    ),
  },
  {
    question: "Wie hoch ist die Anzahlung?",
    answer: (
      <>
        Die Anzahlung beträgt 10 % der geschätzten Kosten, die du bei der
        Konfiguration deines Tattoos angezeigt bekommst.
      </>
    ),
  },
  {
    question: "Wann wird das Geld von meinem Konto abgebucht?",
    answer: (
      <>
        Bei Buchungsabschluss wird nur die Anzahlung eingezogen. Der restliche
        Betrag wird erst nach Abschluss des Termins basierend auf der
        tatsächlichen Dauer des Tattoos abgebucht.
      </>
    ),
  },
  {
    question: "Was passiert, wenn der Termin länger dauert als die Schätzung?",
    answer: (
      <>
        Unsere Schätzungen sind großzügig kalkuliert, sodass es selten vorkommt,
        dass ein Termin länger dauert. Sollte dies dennoch passieren, zahlst du
        maximal den ursprünglich geschätzten Betrag – es gibt keine versteckten
        Mehrkosten.
      </>
    ),
  },
  {
    question:
      "Woher weiß ich, ob das Portfolio des Tätowierers nicht gefälscht ist?",
    answer: (
      <>
        Wir verifizieren jedes eingereichte Portfolio sorgfältig, indem wir es
        mit den Social-Media-Konten des Tätowierers abgleichen. Falls ein
        Tätowierer kein Social Media besitzt oder dies nicht ausreicht, kann er
        seine künstlerischen Fähigkeiten alternativ durch ein Video nachweisen.
        Du kannst dir also sicher sein, dass jeder Tätowierer echt ist und über
        nachgewiesene Erfahrung verfügt.
      </>
    ),
  },
  {
    question: "Kann ich meinen Termin storieren?",
    answer: (
      <>
        Ja, du kannst deinen Termin bis zu 48 Stunden vorher&nbsp;
        <Link href={routes.cancel} className="text-primary link">
          über dieses Formular
        </Link>&nbsp;
        stornieren.
      </>
    ),
  },
];
