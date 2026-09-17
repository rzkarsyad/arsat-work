import { Home } from "@/components/home";
import { JsonLd } from "@/components/json-ld";
import { homeJsonLd } from "@/lib/jsonld";

export default function Page() {
  return (
    <>
      <JsonLd data={homeJsonLd} />
      <Home />
    </>
  );
}
