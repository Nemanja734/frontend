import Wrapper from "@/components/showroom/wrapper";
import Footer from "@/layout/footer";
import Nav, { NavType } from "@/layout/nav";

export default function Showroom() {
    return (
        <>
            <Nav navType={NavType.Main} />
            <Wrapper />
            <Footer />
        </>
    );
}