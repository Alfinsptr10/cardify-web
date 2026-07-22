export type PhotoboothLayout = {
  id: string;
  name: string;
  photos: number;
  preview: string;
};

export const photoboothLayouts = [
  {
    id: "layout4",
    name: "Layout 4",
    photos: 4,
    preview: "/layouts/layout4.png"
  },
  {
    id: "layout6",
    name: "Layout 6",
    photos: 6,
    preview: "/layouts/layout6.png"
  },
];