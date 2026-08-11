import HomeBanner, { CompanyFeatures } from "@/Components/HomeBanner/HomeBanner"
import HomeAboutSec from "@/Components/HomeSection/HomeAboutSec"
import ProductsLists from "@/Components/HomeSection/ProductsLists-slide"
import HomeAdvantageSec, { MakesDiffrent } from "@/Components/HomeSection/HomeAdvantageSec"
import HomeTestimonialsSec from "@/Components/HomeSection/HomeTestimonialsSec"
import HomeBlogSec from "@/Components/HomeSection/HomeBlogSec"
import WhereWeExcelSec from "@/Components/HomeSection/WhereWeExcelSec"
import { HelpConnectLinkSec } from "@/Components/HomeSection/HelpConnectSec"
import { getRequestWithRevalidate } from "@/lib/apicall.ts";
import { DefultMetaData } from "@/lib/DefultSEO.js";
export async function generateMetadata({}, parent) {
  try {
    // const { type = 'Directors', } = await searchParams;
    // const { slug } = await params;
    let baseUrl = `/cms/pages/home-page`;
    const { data = {} } = await getRequestWithRevalidate(baseUrl);
    const { seo } = data ?? {}


    const previousImages = (await parent)?.openGraph?.images || [];
    const seoData = {
      title: seo.title || DefultMetaData.title,
      description: seo.description || DefultMetaData.description,
      keywords: seo.keywords || DefultMetaData.keywords,
      alternates: { canonical: "https://www.oswinply.com/" },
      // robots: seo.metaRobots || "index,follow",
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
  const [{ data: ApiData = {} },
    { data: features = [] },
  ] = await Promise.all([
    getRequestWithRevalidate("/cms/pages/home-page"),
    getRequestWithRevalidate("/shop/product/product-features/home-page"),
  ]);
  const { banner = [], about_us = {}, key_statistics = [], product_category = {}, usp_list = [] } = ApiData;

  const makesdiffrentdata = features.map((item) => {
    return {
      icon: `${process.env.NEXT_PUBLIC_IMAGE_URL}${item?.logo}`,
      title: item?.heading,
      desc: item?.description
    }
  })

  return (
    <>
      <HomeBanner BannerData={banner} />
      <CompanyFeatures features={usp_list} />
      <HomeAboutSec key_statistics={key_statistics} about_us={about_us} />
      <ProductsLists product_category={product_category} />
      <MakesDiffrent theme="common-overlay pb-6" data={makesdiffrentdata} />
      <HomeAdvantageSec theme="common-overlay" />
      <HomeTestimonialsSec />
      <HomeBlogSec />
      <WhereWeExcelSec />
      <HelpConnectLinkSec secstyle="home" />
    </>
  );
}
export default page
