import InnerBanner from "@/Components/Others/InnerBanner"
import CataloguesSec from "./Components/CataloguesSec"
import { getRequestWithRevalidate } from "@/lib/apicall.ts";
import { DefultMetaData } from "@/lib/DefultSEO.js";

export async function generateMetadata({}, parent) {
  try {
    let baseUrl = `/cms/pages/brochure-catalogues`;
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
const page = async () => {
  const { data: ApiData = {} } = await getRequestWithRevalidate('/cms/pages/brochure-catalogues');
  const { banner = {},catalogues = [] } = ApiData;
  return (
    <>
       <InnerBanner
        image={`${process.env.NEXT_PUBLIC_IMAGE_URL}${banner?.image}`}
        responsive_image={`${process.env.NEXT_PUBLIC_IMAGE_URL}${banner?.responsive_image}`}
        title={banner?.heading ?? ""}
        subtitle={banner?.description ?? ""}
        isHtml={true}
        isHtmlTitle={true}
      />
      <CataloguesSec brouchers={catalogues} />
    </>
  )
}
export default page
