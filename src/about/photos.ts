import type { StaticImageData } from "next/image";
import gallery from "./photos/gallery.jpg";
import istiqlal from "./photos/istiqlal.jpg";
import turntable from "./photos/turntable.jpg";

export type Photo = { src: StaticImageData; alt: string };

/** Prints on the About page, back to front. Square crops from Instagram (@aarsaat). */
export const photos: Photo[] = [
  { src: gallery, alt: "Looking at framed prints in a small gallery" },
  { src: turntable, alt: "A turntable, notebooks and an orange mushroom lamp on a shelf" },
  { src: istiqlal, alt: "Rizki in front of the Istiqlal mosque in Jakarta" },
];
