import { routes } from "./routes";

export const navItems = [
  {
    text: "Start",
    type: "link",
    link: routes.home,
    mobile: true,
  },
  {
    text: "Für Künstler",
    type: "link",
    link: routes.artist,
  },
  {
    text: "Entdecken",
    type: "link",
    link: routes.showroom,
  },
  {
    text: "Blog",
    type: "link",
    link: routes.blog,
  },
  {
    text: "Anmelden",
    type: "link",
    link: routes.signin,
  },
  {
    text: "Registrieren",
    type: "button",
    link: routes.signup,
  },
];
