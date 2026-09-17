import { aboutDescription } from "./metadata";
import { site } from "./site";

/**
 * With nothing declaring it, Google infers the name it prints above a result
 * and kept using "Craft by Arsat", the pre-rebrand name. `WebSite` on the home
 * page is the documented way to state it outright; `alternateName` is the short
 * form Google may fall back to when the full one reads too long for a SERP.
 *
 * Both pages describe the same person, so the node carries a stable `@id` and
 * the About page points at it rather than declaring a second Rizki.
 */
const personId = `${site.url}/#rizki`;

const person = {
  "@type": "Person",
  "@id": personId,
  name: site.author,
  url: `${site.url}/about`,
  /** The avatar photo, which also serves as the site icon. */
  image: `${site.url}/icon.png`,
  jobTitle: site.role,
  description: aboutDescription,
  address: { "@type": "PostalAddress", addressCountry: site.location },
  sameAs: [site.links.x, site.links.linkedin, site.links.contra, site.links.instagram],
};

export const homeJsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "WebSite",
      "@id": `${site.url}/#website`,
      url: `${site.url}/`,
      name: site.name,
      alternateName: site.brand,
      description: site.description,
      inLanguage: "en",
      publisher: { "@id": personId },
    },
    person,
  ],
};

export const aboutJsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "ProfilePage",
      "@id": `${site.url}/about#page`,
      url: `${site.url}/about`,
      name: "About",
      mainEntity: { "@id": personId },
    },
    person,
  ],
};
