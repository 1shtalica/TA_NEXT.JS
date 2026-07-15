import LandingNavbar from "@/components/landingpage/LandingNavbar";
import Hero from "@/components/landingpage/Hero";
import EventsSuggestion from "@/components/landingpage/EventsSuggestion";
import PopularCategory from "@/components/landingpage/PopularCategory";
import UpComingEvents from "@/components/landingpage/UpComingEvents";
import CallToAction from "@/components/landingpage/CallToAction";
import LandingFooter from "@/components/landingpage/LandingFooter";
import GoToTopButton from "@/components/reusable/GoToTopButton";

export default function LandingPage() {
  return (
    <div className="min-h-screen flex flex-col bg-white">
      <LandingNavbar />
      <main>
        <Hero />
        <EventsSuggestion />
        <PopularCategory />
        <UpComingEvents />
        <CallToAction />
      </main>
      <LandingFooter />
      <GoToTopButton />
    </div>
  );
}
