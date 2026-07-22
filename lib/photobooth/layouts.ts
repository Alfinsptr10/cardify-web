export type PhotoboothLayout = {
  id: string;
  name: string;
  description: string;
  photos: number;
  preview: string;
};

export const photoboothLayouts = [
  {
    id: "layout4",
    name: "Layout 4",
    description: "Classic 4-photo strip",
    photos: 4,
    preview: "/layouts/layout4.png",
  },
  {
    id: "layout6",
    name: "Layout 6",
    description: "6-photo collage layout",
    photos: 6,
    preview: "/layouts/layout6.png",
  },
];