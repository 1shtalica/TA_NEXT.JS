import type { EventListResult, EventPagination, GetEventsParams, HomeEventCard, Event } from "@/types/event";
import { APPROVED_EVENT_CATEGORIES, normalizeEventCategoryList } from "@/constants/event-categories";

const API_URL = process.env.NEXT_PUBLIC_API_URL;
const CLIENT_API_URL = typeof window !== "undefined" ? "/api/proxy" : process.env.NEXT_PUBLIC_API_URL;

export class EventListRequestError extends Error {
  constructor(message: string, public readonly status: number) {
    super(message);
    this.name = "EventListRequestError";
  }
}

const normalizeEventPagination = (
  pagination: Partial<EventPagination> | undefined,
  limit: number
): EventPagination => ({
  limit: pagination?.limit ?? limit,
  has_more: pagination?.has_more ?? false,
  next_cursor: pagination?.next_cursor ?? null,
});

const buildEventListSearchParams = (params: GetEventsParams = {}) => {
  const { limit = 10, cursor, type = "", q = "", search, category = "", province = "", price = "", sort = "" } = params;
  const urlParams = new URLSearchParams({ limit: String(Math.min(Math.max(limit, 1), 100)) });
  if (cursor) urlParams.set("cursor", cursor);
  if (type) urlParams.set("type", type);
  if (search ?? q) urlParams.set("search", search ?? q);
  if (category) urlParams.set("category", category);
  if (province) urlParams.set("province", province);
  if (price) urlParams.set("price", price);
  if (sort) urlParams.set("sort", sort);
  return urlParams;
};

export const EventService = {
  async getEvents(params: GetEventsParams = {}): Promise<EventListResult> {
    const urlParams = buildEventListSearchParams(params);
    const response = await fetch(`${API_URL}/events?${urlParams}`, { cache: "no-store" });
    if (!response.ok) throw new EventListRequestError(`Fetch failed: ${response.status}`, response.status);
    const json = await response.json();
    return { data: json.data ?? [], pagination: normalizeEventPagination(json.pagination, Number(urlParams.get("limit")) || 10) };
  },

  async getEventsClient(params: GetEventsParams = {}): Promise<EventListResult> {
    const urlParams = buildEventListSearchParams(params);
    const response = await fetch(`${CLIENT_API_URL}/events?${urlParams}`);
    if (!response.ok) throw new EventListRequestError(`Fetch failed: ${response.status}`, response.status);
    const json = await response.json();
    return { data: json.data ?? [], pagination: normalizeEventPagination(json.pagination, Number(urlParams.get("limit")) || 10) };
  },

  async getRandomEvents(): Promise<HomeEventCard[]> {
    const res = await fetch(`${API_URL}/events/random`);
    const data = await res.json();
    return data.data || [];
  },

  async getEventBySlug(slug: string): Promise<Event | null> {
    const response = await fetch(`${API_URL}/events/${slug}`, { cache: "no-store" });
    if (!response.ok) return null;
    const json = await response.json();
    return json.data ?? null;
  },

  async getEventCategories(): Promise<string[]> {
    try {
      const res = await fetch(`${CLIENT_API_URL}/categories`);
      const json = await res.json();
      return normalizeEventCategoryList(json.data);
    } catch {
      return [...APPROVED_EVENT_CATEGORIES];
    }
  },
};
