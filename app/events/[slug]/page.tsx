import { notFound } from "next/navigation";
import { Suspense } from "react";
import EventDetailHeader from "@/components/eventdetail/EventDetailHeader";
import EventDetailContent from "@/components/eventdetail/EventDetailContent";
import { EventService } from "@/services/event-service";
import type { Metadata } from "next";

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const event = await EventService.getEventBySlug(slug).catch(() => null);
  if (!event) return {
    title: "404 - Kumpulin",
    description: "Event tidak ditemukan",
    openGraph: {
      title: "404 - Kumpulin",
      description: "",
      type: "website",
    }
  };

  return {
    title: `${event.title} - Kumpulin`,
    description: `Ikuti acara ${event.title} sekarang juga di Kumpulin.`,
    alternates: {
      canonical: `/events/${slug}`,
    },
    openGraph: {
      title: event.title,
      description: `Dapatkan Tiket ${event.title} sekarang juga di 🎊Kumpulin!`,
      images: [event.images?.find(i => i.is_primary)?.image_url || event.images?.[0]?.image_url || ""].filter(url => url !== ""),
      type: "website",
    }
  };
}

async function ServerEventDetail({ slug }: { slug: string }) {
  const event = await EventService.getEventBySlug(slug).catch(() => null);
  if (!event) {
    return notFound();
  }

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Event",
            "name": event.title,
            "startDate": event.event_start_date,
            "location": {
              "@type": "Place",
              "name": event.is_online ? "Online" : (event.address?.city || "TBA"),
            },
            "organizer": {
              "@type": "Organization",
              "name": event.organizer?.name || "Kumpulin"
            }
          })
        }}
      />
      <EventDetailContent event={event} />
    </>
  );
}

export default async function EventDetail({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;

  return (
    <>
      <EventDetailHeader />
      <main className="min-h-screen bg-[#f9fafb]">
        <Suspense fallback={
          <div className="min-h-screen flex flex-col items-center justify-center bg-[#f9fafb]">
            <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-primary/20 border-r-4 border-primary"></div>
          </div>
        }>
          <ServerEventDetail slug={slug} />
        </Suspense>
      </main>
    </>
  );
}
