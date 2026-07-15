import type { Metadata } from "next";
import LandingNavbar from "@/components/landingpage/LandingNavbar";
import SearchBar from "@/components/explore/SearchBar";
import FilterBar from "@/components/explore/FilterBar";
import InfiniteEventList from "@/components/explore/InfiniteEventList";
import { INDONESIA_REGIONS } from "@/constants/regions";
import { EventService } from "@/services/event-service";
import type { HomeEventCard } from "@/types/event";
import { Suspense } from "react";
import GoToTopButton from "@/components/reusable/GoToTopButton";
import { EventCardSkeletonList } from "@/components/reusable/EventCard";
import { SITE_URL } from "@/lib/site";

type SearchParams = Promise<{ [key: string]: string | string[] | undefined }>;

export const metadata: Metadata = {
  title: "Cari Event - Kumpulin",
  description: "Temukan berbagai acara seru, konser, workshop, dan seminar di sekitarmu.",
  alternates: {
    canonical: "/events",
  },
  openGraph: {
    title: "Cari Event - Kumpulin",
    description: "Temukan berbagai acara seru, konser, workshop, dan seminar di sekitarmu.",
    url: "/events",
    type: "website",
    images: [
      {
        url: "/og_image.png",
        width: 1200,
        height: 630,
        alt: "Banner Resmi Kumpul.in",
        type: "image/png",
      }
    ],
  },
};

const getProvinceFilter = (value: string) => {
  if (!value || value === "online") return "";
  return (
    INDONESIA_REGIONS.find((province) => province.id === value)?.name ?? value
  );
};

export default async function ExplorePage(props: {
  searchParams: SearchParams;
}) {
  const searchParams = await props.searchParams;

  const query = typeof searchParams.q === "string" ? searchParams.q : "";
  const typeFilter =
    typeof searchParams.type === "string" ? searchParams.type : "";
  const categoryFilter =
    typeof searchParams.category === "string" ? searchParams.category : "";
  const rawProvinceFilter =
    typeof searchParams.province === "string"
      ? searchParams.province
      : typeof searchParams.location === "string"
        ? searchParams.location
        : "";
  const provinceFilter = getProvinceFilter(rawProvinceFilter);
  const priceFilter =
    typeof searchParams.price === "string" ? searchParams.price : "";
  const sortOption =
    typeof searchParams.sort === "string" ? searchParams.sort : "";

  const LIMIT = 12;

async function ServerEventList({
  query,
  typeFilter,
  categoryFilter,
  provinceFilter,
  priceFilter,
  sortOption,
  limit,
}: {
  query: string;
  typeFilter: string;
  categoryFilter: string;
  provinceFilter: string;
  priceFilter: string;
  sortOption: string;
  limit: number;
}) {
  let initialEvents: HomeEventCard[] = [];
  let initialHasMore = false;
  let initialNextCursor: string | null = null;
  let error: string | null = null;

  try {
    const response = await EventService.getEvents({
      limit,
      type: typeFilter,
      q: query,
      category: categoryFilter,
      province: provinceFilter,
      price: priceFilter,
      sort: sortOption,
    });
    initialEvents = response.data;
    initialHasMore = response.pagination.has_more;
    initialNextCursor = response.pagination.next_cursor;
  } catch (err) {
    console.error("Failed to fetch events:", err);
    error = "Gagal memuat event. Silakan coba lagi nanti.";
  }

  if (error) {
    return (
      <>
        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
          <p className="text-danger text-sm">{error}</p>
        </div>
        <InfiniteEventList
          initialEvents={[]}
          initialHasMore={false}
          initialNextCursor={null}
          searchQuery={query}
          typeFilter={typeFilter}
          categoryFilter={categoryFilter}
          provinceFilter={provinceFilter}
          priceFilter={priceFilter}
          sortOption={sortOption}
          limit={limit}
        />
      </>
    );
  }

  return (
    <>

      <InfiniteEventList
        initialEvents={initialEvents}
        initialHasMore={initialHasMore}
        initialNextCursor={initialNextCursor}
        searchQuery={query}
        typeFilter={typeFilter}
        categoryFilter={categoryFilter}
        provinceFilter={provinceFilter}
        priceFilter={priceFilter}
        sortOption={sortOption}
        limit={limit}
      />
    </>
  );
}

  const siteUrl = SITE_URL;

  return (
    <div className="relative min-h-screen flex flex-col overflow-hidden bg-[#f9fafb]">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "CollectionPage",
            name: "Cari Event - Kumpulin",
            description: "Temukan berbagai acara seru, konser, workshop, dan seminar di sekitarmu.",
            url: `${siteUrl}/events`,
          }),
        }}
      />
      <div className="pointer-events-none absolute inset-0 z-0" aria-hidden="true">
        <div
          className="absolute inset-0"
          style={{
            backgroundImage:
              "radial-gradient(circle, #94a3b8 1px, transparent 1px)",
            backgroundSize: "28px 28px",
            opacity: 0.3,
          }}
        />
        <svg className="absolute inset-0 h-full w-full" xmlns="http://www.w3.org/2000/svg">
          <circle cx="85%" cy="18%" r="220" fill="#002cee" fillOpacity="0.032" />
          <circle cx="12%" cy="75%" r="140" fill="#6366f1" fillOpacity="0.028" />
        </svg>
      </div>

      <LandingNavbar />
      <main className="relative z-10 container mx-auto w-full max-w-7xl grow px-4 pb-20 md:px-8 lg:px-12">
          <Suspense fallback={<div className="w-full h-32" />}>
          <SearchBar />
          </Suspense>
        <div className="mb-8 relative z-20">
          <Suspense fallback={<div className="w-full h-16" />}>
            <FilterBar />
          </Suspense>
        </div>

        {query && (
          <div className="mb-6 text-muted text-sm md:text-base">
            Hasil pencarian untuk <strong>&quot;{query}&quot;</strong>
          </div>
        )}

        <Suspense fallback={<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3"><EventCardSkeletonList count={12} /></div>}>
          <ServerEventList
            query={query}
            typeFilter={typeFilter}
            categoryFilter={categoryFilter}
            provinceFilter={provinceFilter}
            priceFilter={priceFilter}
            sortOption={sortOption}
            limit={LIMIT}
          />
        </Suspense>
      </main>
      <GoToTopButton />
    </div>
  );
}
