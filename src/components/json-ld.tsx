/**
 * Structured data as a plain <script>, the way Next recommends: it is data, not
 * code to load. `<` is escaped because JSON.stringify does not sanitise strings
 * that could close the tag early.
 */
export function JsonLd({ data }: { data: object }) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data).replace(/</g, "\\u003c") }}
    />
  );
}
