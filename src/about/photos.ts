import type { StaticImageData } from "next/image";
import gallery from "./photos/gallery.jpg";
import istiqlal from "./photos/istiqlal.jpg";
import turntable from "./photos/turntable.jpg";

export type Photo = {
  src: StaticImageData;
  alt: string;
  /** Printed on the stamp, top left. */
  title: string;
  /** Printed on the stamp, bottom right (month/year of the Instagram post). */
  date: string;
  /** object-position for the portrait crop inside the stamp. */
  focus?: string;
};

/** Stamps on the About page, back to front. Square crops from Instagram (@aarsaat). */
export const photos: Photo[] = [
  { src: gallery, alt: "Looking at framed prints in a small gallery", title: "Gallery", date: "12/2023", focus: "60% 50%" },
  { src: turntable, alt: "A turntable, notebooks and an orange mushroom lamp on a shelf", title: "Desk", date: "12/2024" },
  { src: istiqlal, alt: "Rizki in front of the Istiqlal mosque in Jakarta", title: "Istiqlal", date: "12/2023", focus: "50% 35%" },
];
