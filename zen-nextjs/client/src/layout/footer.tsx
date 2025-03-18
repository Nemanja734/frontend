import Image from "next/image";
import DdStatic from "../ui/ddStatic";
import Heading from "../ui/heading";
import LogoFooter from "./logoFooter";
import Text from "../ui/text";
import { routes } from "@/config/data/routes";
import Link from "next/link";

export default function Footer() {
  return (
    <div className="bg-foreground text-background">
      <div className="container grid grid-cols-1 gap-y-12 md:gap-y-20 md:gap-x-14 xl:gap-x-24">
        <div className="grid gap-4">
          <LogoFooter width="180" />

          <Heading level={"heading-primary"} className="mb-0!">
            Mehr als nur ein Tattoostudio.
          </Heading>

          <div className="grid grid-flow-col justify-start gap-3">
            {paymentIcons.map((icon, index) => (
              <Image
                key={index}
                src={icon.src}
                alt={icon.alt}
                height={40}
                width={60}
              />
            ))}
          </div>
        </div>

        <nav
          aria-label="Footer Navigation"
          className="grid gap-5 items-start md:flex md:justify-between lg:col-start-2 lg:justify-end lg:gap-10 xl:gap-20"
        >
          {navigation.map((section, index) => (
            <div key={index}>
              {/* Mobile */}
              <div className="md:hidden">
                <DdStatic
                  ddButtonWidth="w-40"
                  ddButtonText={section.heading}
                  ddItems={section.links}
                ></DdStatic>
              </div>
              {/* Tablet and Desktop */}
              <div className="hidden md:block">
                <ul className="grid gap-2">
                  <li aria-label="Navigation Section">
                    <Text level="base" customs="font-bold">
                      {section.heading}
                    </Text>
                  </li>

                  <li className="grid gap-2">
                    {section.links.map((item, index) => (
                      <Link key={index} href={item.href} className="w-fit">
                        {item.text}
                      </Link>
                    ))}
                  </li>
                </ul>
              </div>
            </div>
          ))}
        </nav>

        <div className="md:grid-cols-2 lg:col-span-2 w-full grid gap-2 lg:flex lg:gap-8">
          {legal.map((item, index) => (
            <Link
              key={index}
              href={item.href}
              className="w-fit hover:underline underline-offset-4 col-1"
            >
              <Text level="base" customs="text-tone font-bold">
                {item.text}
              </Text>
            </Link>
          ))}
          <Text level="base" customs="text-tone md:ml-auto">
            &#169; Zen Tattoo 2025
          </Text>
        </div>
      </div>
    </div>
  );
}

const paymentIcons = [
  {
    src: "/payment-options/MasterCard.svg",
    alt: "Master Card",
  },
  {
    src: "/payment-options/Visa.svg",
    alt: "Visa",
  },
  {
    src: "/payment-options/Klarna.svg",
    alt: "Klarna",
  },
  {
    src: "/payment-options/Stripe.svg",
    alt: "Stripe",
  },
];

const navigation = [
  {
    heading: "Partnerschaften",
    links: [
      {
        text: "Für Tätowierer",
        href: routes.artist,
      },
      {
        text: "Für Tattoostudios",
        href: routes.comingSoon,
      },
      {
        text: "Affiliate Marketing",
        href: routes.comingSoon,
      },
    ],
  },
  {
    heading: "Unternehmen",
    links: [
      {
        text: "Über uns",
        href: routes.comingSoon,
      },
      {
        text: "Unsere Philosophie",
        href: routes.comingSoon,
      },
      {
        text: "Karriere",
        href: routes.comingSoon,
      },
    ],
  },
  {
    heading: "Hilfreiche Links",
    links: [
      {
        text: "Neues zu Zen",
        href: routes.comingSoon,
      },
      {
        text: "Blog",
        href: routes.comingSoon,
      },
      {
        text: "Häufig gestellte Fragen",
        href: routes.comingSoon,
      },
      {
        text: "Kundenservice",
        href: routes.comingSoon,
      },
      {
        text: "Kontakt",
        href: routes.comingSoon,
      },
    ],
  },
];

const legal = [
  {
    text: "Allgemeine Geschäftsbedingungen",
    href: routes.terms,
  },
  {
    text: "Datenschutz",
    href: routes.privacy,
  },
  {
    text: "Impressum",
    href: routes.imprint,
  },
];
