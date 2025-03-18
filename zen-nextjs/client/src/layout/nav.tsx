import LogoMain from "./logoMain";
import NavItemsList from "./navItemsList";
import NavAside from "./navAside";
import CrossLocationSearch from "@/components/crossLocationSearch";

export enum NavType {
  Main = "landingPage",
  Artist = "artist",
}

export default function Nav({ navType }: { navType: NavType }) {

  return (
    <div className="sticky top-0 bg-background z-100">
      <div className="container flex gap-header justify-between items-center py-3! md:py-5!">
        <LogoMain />
        {navType === NavType.Main && (
          <CrossLocationSearch />
        )}
        {/* Mobile */}
        <NavAside className="lg:hidden" />
        {/* Desktop */}
        <NavItemsList className="hidden lg:flex items-center" />
      </div>
    </div>
  );
}



// function getNavContent() {
//   switch (navType) {
//     case NavType.Main:
//       return (
//         <>
//           <LogoMain />
//           <SearchLocation handleClick={(address: Address) => handleSearch(address)} />
//           {/* Mobile */}
//           <NavAside className="lg:hidden" />
//           {/* Desktop */}
//           <NavItemsList className="hidden lg:flex items-center" />
//         </>
//       );

//     case NavType.Artist:
//       return (
//         <>
//           <LogoMain />
//           {/* Mobile */}
//           <NavAside className="lg:hidden" />
//           {/* Tablet */}
//           <NavItemsList className="hidden lg:flex items-center" />
//         </>
//       );
//   }
// }
