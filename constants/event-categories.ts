export const APPROVED_EVENT_CATEGORIES = [
  "Pendidikan",
  "Bisnis",
  "Teknologi",
  "Hiburan",
  "Olahraga",
  "Komunitas",
  "Budaya",
  "Keagamaan",
  "Kesehatan",
  "Lifestyle",
  "Sosial",
  "Seni",
  "Kuliner",
  "Pariwisata",
  "Gaming",
  "Keluarga",
  "Festival",
  "Workshop",
  "Seminar",
  "Pameran",
  "lainnya",
] as const;

export const normalizeEventCategoryList = (payload: unknown): string[] => {
  const items = Array.isArray(payload) ? payload : [];
  const normalized = items
    .map((item) => {
      if (typeof item === "string") return item.trim();
      if (item && typeof item === "object" && "name" in item) {
        const name = (item as { name?: unknown }).name;
        return typeof name === "string" ? name.trim() : "";
      }
      return "";
    })
    .filter((name) => name.length > 0);

  return normalized.length > 0 ? [...new Set(normalized)] : [...APPROVED_EVENT_CATEGORIES];
};
