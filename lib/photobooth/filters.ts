export type PhotoboothFilter = {
  id: string;
  name: string;
  css: string;
};

export const photoboothFilters: PhotoboothFilter[] = [
  { id: "original", name: "Original", css: "none" },
  { id: "warm", name: "Warm", css: "brightness(1.05) contrast(1.03) sepia(0.12)" },
  { id: "cool", name: "Cool", css: "brightness(1.03) contrast(1.02) saturate(1.05) hue-rotate(190deg)" },
  { id: "vintage", name: "Vintage", css: "contrast(0.98) sepia(0.25) saturate(0.95)" },
  { id: "bw", name: "Black & White", css: "grayscale(1) contrast(1.05)" },
  { id: "film", name: "Film", css: "brightness(0.98) contrast(1.08) saturate(1.1)" },
  { id: "sepia", name: "Sepia", css: "sepia(0.4) contrast(1.05) saturate(0.9)" },
];
