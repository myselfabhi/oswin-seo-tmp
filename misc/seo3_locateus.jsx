import InnerBanner from "@/Components/Others/InnerBanner"
import DealerSec from "../contact-us/Components/OldDealerSec"
import StoreAround from "./Components/StoreAround"

export async function generateMetadata() {
  const title = "Find an Oswin Ply Dealer Near You";
  const description = "Locate your nearest Oswin Ply dealer for plywood, prelam boards, and doors across South India.";
  return {
    title,
    description,
    alternates: { canonical: "https://www.oswinply.com/locate-us" },
    openGraph: { title, description, type: "website", site_name: "oswin ply" },
  };
}

const page = () => {
  return (
    <>
        <InnerBanner image="/images/about-banner.jpg" responsive_image="/images/about-banner.jpg" title="Locate Us" subtitle="Visit the Locations Behind Oswin’s Quality Products" />
        <StoreAround/>
        <DealerSec/>
    </>
  )
}

export default page
