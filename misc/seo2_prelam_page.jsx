import { CompanyFeatures } from "@/Components/HomeBanner/HomeBanner"
import HomeBlogSec from "@/Components/HomeSection/HomeBlogSec"
import WhereWeExcelSec from "@/Components/HomeSection/WhereWeExcelSec"
import InnerBanner from "@/Components/Others/InnerBanner"
import ProductInformation from "@/Components/Product/ProductInformation"
import ProductOverview from "@/Components/Product/ProductOverview"
import { getRequestWithRevalidate } from "@/lib/apicall.ts"
import PrelamLayout from "../Components/PrelamLayout"
import { notFound } from "next/navigation"


import { DefultMetaData } from "@/lib/DefultSEO.js";
import ApplicationsSection from "../../../../Components/Product/ApplicationsSection"
export async function generateMetadata({ params }, parent) {
    try {
        const { slug } = await params;
        let baseUrl = slug.length === 1 ? `/shop/product/product-category/${slug[0]}` : `/shop/product/product-listing/${slug[slug.length-1]}`;
        const { data = {} } = await getRequestWithRevalidate(baseUrl);
        const { seo } = data ?? {}

        // TS-116/117: prelam color/grain pages had no per-item title/description wired,
        // so every variant fell back to the shared default. Build a unique title/meta
        // per color/grain from the slug when the CMS value is missing or is the shared default.
        const leafName = String(slug[slug.length - 1]).replace(/_/g, "-").split("-").map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(" ");
        const isIndex = slug.length === 1;
        const familyLabel = slug[0] === "grains" ? "Wood Grains" : "Solid Colours";
        const fallbackTitle = isIndex
            ? `Prelam Particle Board ${familyLabel} | Oswin Ply`
            : `${leafName} Prelam Particle Board | Oswin Ply`;
        const fallbackDesc = isIndex
            ? `Explore Oswin Ply prelam particle board ${familyLabel.toLowerCase()}. Compare finishes, check specifications, and find your nearest dealer.`
            : `${leafName} prelam particle board from Oswin Ply. Explore the ${leafName} finish, check specifications, and find your nearest dealer.`;
        const sharedTitle = DefultMetaData.title;
        const sharedDesc = DefultMetaData.description;
        const finalTitle = (seo?.title && seo.title !== sharedTitle) ? seo.title : fallbackTitle;
        const finalDesc = (seo?.description && seo.description !== sharedDesc) ? seo.description : fallbackDesc;

        const previousImages = (await parent)?.openGraph?.images || [];
        const seoData = {
            title: finalTitle,
            description: finalDesc,
            keywords: seo.keywords || DefultMetaData.keywords,
            alternates: { canonical: `https://www.oswinply.com/prelam/${Array.isArray(slug) ? slug.join('/') : slug}` },
            // robots: seo.metaRobots || "index,follow",
            openGraph: {
                title: finalTitle,
                description: finalDesc,
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
const page = async ({ params, searchParams }) => {
    const category = 'prelam';
    let { category: categorySub = null } = await searchParams;
    const { slug = [] } = await params;


    const { data: ApiData = {} } = await getRequestWithRevalidate(`/shop/product/product-category/${category}`);


    // const { data: ProductTabs = [] } = await getRequestWithRevalidate(`/shop/product/product-listing/list-tab?categorys=${ApiData?._id}`);

    const { data: ProductCategory = [] } = await getRequestWithRevalidate(`/shop/product/product-category?under=6960e23bc5246efc178b0d2c`);

    const { banner = {}, about_category = {}, why_our_products = {}, brochure = '', usp_list = [] } = ApiData;
    const data = {
        overviewsec: {
            subtitle: about_category?.tagline,
            title: about_category?.heading,
            summary: about_category?.content,
            productimage: `${process.env.NEXT_PUBLIC_IMAGE_URL}${about_category?.image}`,
            brouchrename: 'Prelam',
            category: category,
            brouchrelinks: `${process.env.NEXT_PUBLIC_IMAGE_URL}${brochure}`
        },
        productrange: {
            subtitle: why_our_products?.tagline,
            title: why_our_products?.title,
            summary: why_our_products?.content,

        }

    }
    let selectedProductCategory = ProductCategory?.find((val) => val?.slug === slug[0]) ?? null;
    if (!selectedProductCategory) {
        notFound()
    }

    const { data: ProductList = [] } = await getRequestWithRevalidate(`/shop/product/product-listing?categorys=${selectedProductCategory?._id}&sort_key=code`);

    if (ProductList?.length === 0) {
        notFound()
    }
    const { data: ProductDetails = {} } = slug?.[1] ? await getRequestWithRevalidate(`/shop/product/product-listing/${slug[1] ?? ''}`) : { data: null };

    if (slug?.[1] && !ProductDetails?._id) {
        notFound()
    }
    const applicationsdata = [
        {
            image: '/images/prelam-board-img01.png',
            name: 'Regular Grade A ',
            description: `<p>Engineered for consistent stiffness and dimensional stability, this grade is ideally suited for dry interior applications. </p>`
        },
        {
            image: '/images/prelam-board-img02.png',
            name: 'Moisture Resistant (MR) Grade ',
            description: `<p>Perform reliably across both dry and mildly damp environments, making them suitable for a wide range of interior applications. </p>`
        },
        {
            image: '/images/prelam-board-img03.png',
            name: 'High Moisture Resistance (HMR) Grade',
            description: `<p>Built for different environments, they offer superior stability, high load-bearing capacity, and exceptional durability. </p>`
        },
    ]
    const __leaf = String(Array.isArray(slug) ? slug[slug.length-1] : slug).split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');
    const __breadcrumbLd = {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      "itemListElement": [
        { "@type": "ListItem", "position": 1, "name": "Home", "item": "https://www.oswinply.com/" },
        { "@type": "ListItem", "position": 2, "name": "Prelam", "item": `https://www.oswinply.com/prelam` },
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
            <CompanyFeatures features={usp_list} />
            <ProductOverview data={data?.overviewsec} />
            <ApplicationsSection applications={applicationsdata} />
            <PrelamLayout
                slug={slug}
                data={data?.productrange}
                ProductDetails={ProductDetails}
                category={category}
                subCategory={ProductCategory}
                activeCategory={selectedProductCategory?.slug}
                ProductList={ProductList}

            />
            <WhereWeExcelSec spaccing="pt-4 lg:pt-8" />
            <ProductInformation dvalues={{ categorys: ApiData?._id }} />
            <HomeBlogSec />
        </>
    )
}

export default page
