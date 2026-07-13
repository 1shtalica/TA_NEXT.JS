import type { Metadata } from "next";
import LandingNavbar from "@/components/landingpage/LandingNavbar";
import Hero from "@/components/landingpage/Hero";
import EventsSuggestion from "@/components/landingpage/EventsSuggestion";
import PopularCategory from "@/components/landingpage/PopularCategory";
import UpcomingEvents from "@/components/landingpage/UpcomingEvents";
import CallToAction from "@/components/landingpage/CallToAction";
import LandingFooter from "@/components/landingpage/LandingFooter";
import GoToTopButton from "@/components/reusable/GoToTopButton";
import { EventService } from "@/services/event-service";
import type { HomeEventCard } from "@/types/event";

export const metadata: Metadata = {
  title: "Kumpul.in — Platform Event & Manajemen Acara Terlengkap",
  description:
    "Temukan, ikuti, dan kelola berbagai acara seru, konser, workshop, dan seminar di sekitarmu dengan Kumpulin.",
  alternates: {
    canonical: "/",
  },
  openGraph: {
    title: "Kumpul.in — Platform Event & Manajemen Acara Terlengkap",
    description:
      "Temukan, ikuti, dan kelola berbagai acara seru, konser, workshop, dan seminar di sekitarmu dengan Kumpulin.",
    url: "/",
    type: "website",
    images: [
      {
        url: `${process.env.NEXT_PUBLIC_APP_URL}/og_image.png`, // Absolute URL
        width: 1200,
        height: 630,
        alt: "Banner Resmi Kumpul.in",
        type: "image/png",
      }
    ],
  },
};

export default async function LandingPage() {
  const siteUrl =process.env.NEXT_PUBLIC_APP_URL;

  let heroEvents: HomeEventCard[] = [];
  try {
    const { data } = await EventService.getEvents({ limit: 3 });
    heroEvents = data;
  } catch (error) {
    console.error("Failed to load hero events:", error);
  }

  return (
    <div className="min-h-screen flex flex-col bg-white">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "WebSite",
            name: "Kumpul.in",
            url: siteUrl,
            potentialAction: {
              "@type": "SearchAction",
              target: `${siteUrl}/events?q={search_term_string}`,
              "query-input": "required name=search_term_string",
            },
          }),
        }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Organization",
            name: "Kumpul.in",
            url: siteUrl,
            description:
              "Platform manajemen acara dan tiket online di Indonesia.",
          }),
        }}
      />
      <LandingNavbar />
      <main>
        <Hero initialHeroEvents={heroEvents} />
        <EventsSuggestion />
        <PopularCategory />
        <UpcomingEvents />
        <CallToAction />
      </main>
      <LandingFooter />
      <GoToTopButton />
    </div>
  );
}
