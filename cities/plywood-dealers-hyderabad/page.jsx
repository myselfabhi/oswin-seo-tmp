import "@/Components/HomeBanner/HomeBanner.scss";
import "@/Components/HomeSection/HomeAboutSec.scss";
import "@/Components/HomeSection/ProductsLists.scss";
import "@/Components/HomeSection/ProductsListsSlide.scss";
import "@/Components/HomeSection/WhereWeExcelSec.scss";
import "@/Components/HomeSection/HelpConnectSec.scss";
import { CONTENT } from "./content";

export const metadata = {
  title: "Plywood Manufacturers in Hyderabad | Oswin Ply",
  description: "Oswin Ply supplies ISI-certified BWP plywood, block board, flush doors and prelam boards to Hyderabad. Enquire for pricing and your nearest stockist.",
  alternates: { canonical: "/plywood-dealers-hyderabad" },
};

const howToLd = {"@context":"https://schema.org","@type":"HowTo","name":"What to check before buying plywood in Hyderabad","step":[{"@type":"HowToStep","position":1,"name":"Choose the grade first","text":"Choose BWP where moisture is a factor, MR where it isn't."},{"@type":"HowToStep","position":2,"name":"Verify the ISI mark","text":"Look for the ISI mark on the board itself, not just the invoice or shop signage."},{"@type":"HowToStep","position":3,"name":"Confirm the core","text":"Ask whether the core is Gurjan/hardwood or a mixed/soft-core alternative, since it changes load-bearing performance."}]};

export default function Page() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(howToLd) }} />
      <main dangerouslySetInnerHTML={{ __html: CONTENT }} />
    </>
  );
}
