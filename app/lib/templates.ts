/**
 * Registry terpusat untuk seluruh template Cardify.
 * Dipakai oleh /templates dan homepage — siap dikembangkan untuk
 * fitur kategori occasion dan photobox di masa depan.
 * TIDAK mengubah logic editor yang sudah ada.
 */

export type TemplateFormat = "web-story" | "card-image";

export type TemplateOccasion =
  | "birthday"
  | "wedding"
  | "anniversary"
  | "graduation"
  | "thank-you"
  | "general";

export interface OccasionInfo {
  id: TemplateOccasion;
  label: string;
  /** warna aksen khusus occasion — dipakai untuk badge/kartu kategori */
  accent: string;
}

export const OCCASIONS: OccasionInfo[] = [
  { id: "birthday", label: "Birthday", accent: "#FB7185" },
  { id: "wedding", label: "Wedding", accent: "#F472B6" },
  { id: "anniversary", label: "Anniversary", accent: "#9F1239" },
  { id: "graduation", label: "Graduation", accent: "#4338CA" },
  { id: "thank-you", label: "Thank You", accent: "#059669" },
];

export interface TemplateMeta {
  id: string;
  href: string;
  title: string;
  description: string;
  image: string;
  tag: string;
  format: TemplateFormat;
  occasions: TemplateOccasion[];
  color: string;
}

export const TEMPLATES: TemplateMeta[] = [
  {
    id: "retro-gameboy",
    href: "/templates/retro-gameboy",
    title: "Retro 8-Bit",
    description: "Nostalgic console aesthetic for gamers.",
    image: "/retro-gameboy.png",
    tag: "Best Seller",
    format: "card-image",
    occasions: ["birthday", "general"],
    color: "bg-purple-100 text-purple-600",
  },
  {
    id: "web-story",
    href: "/web-story",
    title: "Our Story",
    description: "Interactive story with music and animations.",
    image: "/field.jpeg",
    tag: "New",
    format: "web-story",
    occasions: ["anniversary", "wedding", "general"],
    color: "bg-sky-100 text-sky-600",
  },
  {
    id: "minimalist",
    href: "/templates/minimalist",
    title: "Modern Minimalist",
    description: "Clean typography focused design.",
    image: "/minimalist.png",
    tag: "Popular",
    format: "card-image",
    occasions: ["wedding", "graduation", "general"],
    color: "bg-stone-100 text-stone-600",
  },
  {
    id: "postcard",
    href: "/templates/postcard",
    title: "Classic Postcard",
    description: "Warm vintage greeting style.",
    image: "/postcard.png",
    tag: "Classic",
    format: "card-image",
    occasions: ["thank-you", "general"],
    color: "bg-amber-100 text-amber-600",
  },
  {
    id: "newspaper",
    href: "/templates/newspaper",
    title: "Vintage Press",
    description: "Headline news aesthetic.",
    image: "/newspaper.png",
    tag: "Unique",
    format: "card-image",
    occasions: ["birthday", "graduation", "general"],
    color: "bg-slate-100 text-slate-600",
  },
  {
    id: "photobooth",
    href: "/photobooth",
    title: "Photobooth Studio",
    description: "Live photo capture with custom frames, tones, and text.",
    image: "/template/camera.png",
    tag: "Interactive",
    format: "card-image",
    occasions: ["general"],
    color: "bg-amber-100 text-amber-600",
  },
  {
    id: "gameboy-journey",
    href: "/gameboy-app",
    title: "Gameboy Journey",
    description: "Relive the adventure with pixel art and chiptune music.",
    image: "/gameboy-story.jpg",
    tag: "Featured",
    format: "web-story",
    occasions: ["birthday", "general"],
    color: "bg-green-100 text-green-600",
  },
  {
    id: "scrapbook",
    href: "/scrapbook",
    title: "Scrapbook Memories",
    description: "A nostalgic scrapbook with interactive elements.",
    image: "/scrapbook-story.jpg",
    tag: "Creative",
    format: "web-story",
    occasions: ["anniversary", "general"],
    color: "bg-pink-100 text-pink-600",
  },
];

export function getTemplatesByFormat(format?: TemplateFormat | "all"): TemplateMeta[] {
  if (!format || format === "all") return TEMPLATES;
  return TEMPLATES.filter((t) => t.format === format);
}

export function getTemplatesByOccasion(occasion?: TemplateOccasion): TemplateMeta[] {
  if (!occasion) return TEMPLATES;
  return TEMPLATES.filter((t) => t.occasions.includes(occasion));
}

export function getTemplateById(id: string): TemplateMeta | undefined {
  return TEMPLATES.find((t) => t.id === id);
}