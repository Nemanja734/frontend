import Contact from "@/components/artist/contact";
import Nav, { NavType } from "@/layout/nav";
import Footer from "@/layout/footer";
import BenefitsSection from "@/components/artist/benefits"
import HeroSection from "@/components/artist/hero";
import HowItWorksSection from "@/components/artist/howItWorks";
import NextStepsSection from "@/components/artist/nextSteps";
import CustomerSupportSection from "@/components/artist/customerSupport";
import FaqSection from "@/components/artist/faq";

export default function Artist() {
  return (
    <>
      <Nav navType={NavType.Artist} />
      <HeroSection />
      <BenefitsSection />
      <HowItWorksSection />
      <CustomerSupportSection />
      <NextStepsSection />
      <FaqSection />
      <Contact />
      <Footer />
    </>
  );
}
