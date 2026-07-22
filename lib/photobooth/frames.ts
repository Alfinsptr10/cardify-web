export type PhotoSlot = {
  left: number;
  top: number;
  width: number;
  height: number;
};

export type PhotoboothFrame = {
  id: string;
  name: string;
  category: string;
  rarity: string;

  preview: string;

  layout: "layout4" | "layout6";

  canvasWidth: number;
  canvasHeight: number;

  shape: "rect" | "circle";

  slots: PhotoSlot[];
};

export const photoboothFrames: PhotoboothFrame[] = [
  // ==========================
  // LAYOUT 6
  // ==========================

{
  id: "tangled",
  name: "Tangled",
  category: "Cartoon",
  rarity: "Epic",
  preview: "/frames/tangled.png",
  layout: "layout6",
  canvasWidth: 1181,
  canvasHeight: 1771,
  shape: "circle",
  slots: [
    {
      left: 187,
      top: 180,
      width: 264,
      height: 261,
    },
    {
      left: 757,
      top: 180,
      width: 264,
      height: 261,
    },
    {
      left: 187,
      top: 733,
      width: 264,
      height: 262,
    },
    {
      left: 757,
      top: 728,
      width: 264,
      height: 261,
    },
    {
      left: 199,
      top: 1296,
      width: 264,
      height: 261,
    },
    {
      left: 757,
      top: 1296,
      width: 264,
      height: 261,
    },
  ],
},
  {
    id: "toy-story",
    name: "Toy Story",
    category: "Cartoon",
    rarity: "Epic",

    preview: "/frames/toy-story.png",

    layout: "layout6",

    canvasWidth: 1181,
    canvasHeight: 1772,

    shape: "rect",

    slots: [
      { left: 90, top: 140, width: 420, height: 250 },
      { left: 670, top: 140, width: 420, height: 250 },

      { left: 90, top: 630, width: 420, height: 250 },
      { left: 670, top: 630, width: 420, height: 250 },

      { left: 90, top: 1120, width: 420, height: 250 },
      { left: 670, top: 1120, width: 420, height: 250 },
    ],
  },

  {
    id: "spideman",
    name: "Spiderman",
    category: "Cartoon",
    rarity: "Rare",

    preview: "/frames/spiderman.png",

    layout: "layout6",

    canvasWidth: 1181,
    canvasHeight: 1772,

    shape: "rect",

    slots: [
      { left: 120, top: 130, width: 410, height: 280 },
      { left: 650, top: 130, width: 410, height: 280 },

      { left: 120, top: 620, width: 410, height: 280 },
      { left: 650, top: 620, width: 410, height: 280 },

      { left: 120, top: 1110, width: 410, height: 280 },
      { left: 650, top: 1110, width: 410, height: 280 },
    ],
  },

  {
    id: "film",
    name: "Film",
    category: "Film",
    rarity: "Epic",
 
    preview: "/frames/film.png",
 
    layout: "layout6",
 
    canvasWidth: 1181,
    canvasHeight: 1772,
 
    shape: "rect",
 
    slots: [
      { left: 80, top: 52, width: 428, height: 503 },
      { left: 670, top: 52, width: 428, height: 503 },
 
      { left: 81, top: 608, width: 427, height: 508 },
      { left: 670, top: 608, width: 428, height: 508 },
 
      { left: 81, top: 1169, width: 427, height: 509 },
      { left: 670, top: 1174, width: 428, height: 502 },
    ],
  },

  {
    id: "music",
    name: "Hindia-1",
    category: "Music",
    rarity: "Epic",

    preview: "/frames/hindia-1.png",

    layout: "layout6",

    canvasWidth: 1181,
    canvasHeight: 1772,

    shape: "rect",

    slots: [
      { left: 105, top: 120, width: 420, height: 260 },
      { left: 655, top: 120, width: 420, height: 260 },

      { left: 105, top: 630, width: 420, height: 260 },
      { left: 655, top: 630, width: 420, height: 260 },

      { left: 105, top: 1140, width: 420, height: 260 },
      { left: 655, top: 1140, width: 420, height: 260 },
    ],
  },

  // ==========================
  // LAYOUT 4
  // ==========================

  {
    id: "retro-1",
    name: "Retro 1",
    category: "Retro",
    rarity: "Epic",

    preview: "/frames/retro-1.png",

    layout: "layout4",

    canvasWidth: 1181,
    canvasHeight: 1772,

    shape: "rect",

    slots: [
      {
        left: 107,
        top: 372,
        width: 455,
        height: 474,
      },
      {
        left: 618,
        top: 372,
        width: 456,
        height: 474,
      },
      {
        left: 107,
        top: 910,
        width: 455,
        height: 474,
      },
      {
        left: 618,
        top: 910,
        width: 456,
        height: 474,
      },
    ],
  },
];