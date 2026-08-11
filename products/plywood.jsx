import { CompanyFeatures } from "@/Components/HomeBanner/HomeBanner"
import HomeAdvantageSec from "@/Components/HomeSection/HomeAdvantageSec"
import HomeBlogSec from "@/Components/HomeSection/HomeBlogSec"
import InnerBanner from "@/Components/Others/InnerBanner"
import ProductInformation from "@/Components/Product/ProductInformation"
import ProductOverview from "@/Components/Product/ProductOverview"
import ProductPage from "@/Components/Product/ProductPage"
import { getRequestWithRevalidate } from "@/lib/apicall.ts";
import { DefultMetaData } from "@/lib/DefultSEO.js";
export async function generateMetadata({ params }, parent) {
  try {
    // const { type = 'Directors', } = await searchParams;
    // const { slug } = await params;
      const { slug } = await params;
    let baseUrl = `/shop/product/product-listing/${slug}`;
    const { data = {} } = await getRequestWithRevalidate(baseUrl);
    const { seo } = data ?? {}


    const previousImages = (await parent)?.openGraph?.images || [];
    const seoData = {
      title: seo.title || DefultMetaData.title,
      description: seo.description || DefultMetaData.description,
      keywords: seo.keywords || DefultMetaData.keywords,
      alternates: { canonical: `https://www.oswinply.com/plywood/${slug}` },
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
const page = async ({ params }) => {

    const category = 'plywood';
    const { slug } = await params;


    const [{ data: ApiData = {} },
        { data: ProductDetails = [] },
    ] = await Promise.all([
        getRequestWithRevalidate(`/shop/product/product-category/${category}`),
        getRequestWithRevalidate(`/shop/product/product-listing/${slug}`),
    ]);
    const { data: ProductTabs = [] } = await getRequestWithRevalidate(`/shop/product/product-listing/list-tab?categorys=${ApiData?._id}`);
    const { banner = {}, about_category = {}, why_our_products = {}, brochure = '', usp_list = [] } = ApiData;
    const data = {
        overviewsec: {
            subtitle: about_category?.tagline,
            title: about_category?.heading,
            summary: about_category?.content,
            productimage: `${process.env.NEXT_PUBLIC_IMAGE_URL}${about_category?.image}`,
            brouchrename: 'Plywood',
             category: category,
            brouchrelinks: `${process.env.NEXT_PUBLIC_IMAGE_URL}${brochure}`
        },
        productrange: {
            subtitle: why_our_products?.tagline,
            title: why_our_products?.title,
            summary: why_our_products?.content,

        }

    }
    const __leaf = String(slug).split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');
    const __breadcrumbLd = {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      "itemListElement": [
        { "@type": "ListItem", "position": 1, "name": "Home", "item": "https://www.oswinply.com/" },
        { "@type": "ListItem", "position": 2, "name": "Plywood", "item": `https://www.oswinply.com/plywood` },
        { "@type": "ListItem", "position": 3, "name": __leaf },
      ],
    };
    return (
        <>
            <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(__breadcrumbLd) }} />
            <InnerBanner
                image={`${process.env.NEXT_PUBLIC_IMAGE_URL}${banner?.image}`}
                responsive_image={`${process.env.NEXT_PUBLIC_IMAGE_URL}${banner?.responsive_image}`}
                title={banner?.heading ?? ""}
                subtitle={banner?.description ?? ""}
                isHtml={true}
                isHtmlTitle={true}
            />
            <CompanyFeatures features={usp_list}  />
            <ProductOverview data={data?.overviewsec} />
            <ProductPage
                slug={slug}
                data={data?.productrange}
                tabs={ProductTabs}
                ProductDetails={ProductDetails}
                category={"plywood"}
            />
            <HomeAdvantageSec />
            <ProductInformation dvalues={{ categorys: ApiData?._id }} />
            <HomeBlogSec />
        </>
    )
}

export default page
