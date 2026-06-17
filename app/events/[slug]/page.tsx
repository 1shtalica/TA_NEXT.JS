import { notFound } from "next/navigation";
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
  };
  return {
    title: `${event.title} - Kumpulin`,
    description: `Ikuti acara ${event.title} oleh ${event.organizer.name}.`,
    alternates: {
      canonical: `/events/${slug}`,
    },
    openGraph: {
      title: event.title,
      description: `Dapatkan Tiket ${event.title} sekarang juga di 🎊Kumpulin!`,
      images: [event.images?.find(i => i.is_primary)?.image_url || ""],
      type: "website",
    }
  };
}

export default async function EventDetail({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;

  const event = await EventService.getEventBySlug(slug).catch(() => null);

  if (!event) {
    return notFound();
  }

  return (
    <>
      <EventDetailHeader />
      <main className="min-h-screen bg-[#f9fafb]">
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
      </main>
    </>
  );
}
