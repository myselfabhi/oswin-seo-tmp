import CommonSec from "@/Components/CommonSec";
import InnerBanner from "@/Components/Others/InnerBanner";
import { getRequestWithRevalidate } from "@/lib/apicall.ts";
import ConnectMessagege from "./Components/ConnectMessage";
import DealerSec from "./Components/DealerSec";
import LocationSec from "./Components/LocationSec";
import { DefultMetaData } from "@/lib/DefultSEO.js";

export async function generateMetadata({}, parent) {
  try {
    let baseUrl = `/cms/pages/contact-us`;
    const { data = {} } = await getRequestWithRevalidate(baseUrl);
    const { seo } = data ?? {}

    const previousImages = (await parent)?.openGraph?.images || [];
    const seoData = {
      title: seo.title || DefultMetaData.title,
      description: seo.description || DefultMetaData.description,
      keywords: seo.keywords || DefultMetaData.keywords,
      openGraph: {
        title: seo.title || DefultMetaData.title,
        description: seo.description || DefultMetaData.description,
        type: "website",
        site_name: "oswin ply",
        url: ``,
        images: [
          seo?.og_image ? `${process.env.NEXT_PUBLIC_IMAGE_URL}${seo?.og_image}` : `${DefultMetaData?.og_image}`,
          ...previousImages,
        ]
      },
    };
    return seoData;
  } catch (error) {
    return DefultMetaData
  }
}

const basePath = "/contact-us?"

const itemsPerPage = 8;
const page = async ({ searchParams }) => {

  const { page: PageNumber, } = await searchParams;
  const page = parseInt(PageNumber || "1", 10);
  const { data: ApiData = {} } = await getRequestWithRevalidate('/cms/pages/contact-us');
  const { banner = {}, ...aboutus_data } = ApiData;
  const { data: state = [] } = await getRequestWithRevalidate('/cms/dealer/state');

  return (
    <>
      <InnerBanner
        image={`${process.env.NEXT_PUBLIC_IMAGE_URL}${banner?.image}`}
        responsive_image={`${process.env.NEXT_PUBLIC_IMAGE_URL}${banner?.responsive_image}`}
        title={banner?.heading ?? ""}
        subtitle={banner?.description ?? ""}
        isHtml={true}
      />
      {/* TS-126: supporting copy so the page is not thin on text */}
      <div className="container common-spacing-pt">
        <p className="font-size-16">Have a question about a specific product, grade, or finish? Reach out to the Oswin Ply team below and we will point you to your nearest dealer or answer product questions directly. You can also use the dealer locator to find the closest Oswin Ply stockist for plywood, prelam boards, block boards, and doors across South India.</p>
      </div>
      <div id="Locate Us">
        <CommonSec secname="contact-page dealer-sec common-spacing-py" >
          <div className="inner-container common-spacing-py">
            <DealerSec
              state={state}
              limit={itemsPerPage}
              basePath={basePath}

            />


          </div>
        </CommonSec>

      </div>
      <ConnectMessagege aboutus_data={aboutus_data} />
      <LocationSec mapUrl={aboutus_data?.direction_url ?? ""} />
    </>
  )
}

export default page
