import { HelpConnectLinkSec } from "@/Components/HomeSection/HelpConnectSec";
import InnerBanner from "@/Components/Others/InnerBanner";
import FaqSection from "./Components/FaqSection";
import { getRequestWithRevalidate } from "@/lib/apicall.ts";

// TS-119: give /faq and each ?category= variant its own title + meta description.
export async function generateMetadata({ searchParams }) {
  const { category = "" } = await searchParams;
  const map = {
    "warranty-support": ["Warranty & Support FAQs | Oswin Ply", "Warranty and support questions answered for Oswin Ply plywood, boards, and doors."],
    "product-queries": ["Product FAQs | Oswin Ply", "Common product questions about Oswin Ply plywood, prelam boards, and doors."],
    "installation-maintenance": ["Installation & Maintenance FAQs | Oswin Ply", "Installation and maintenance guidance for Oswin Ply plywood, boards, and doors."],
    "general-queries": ["General FAQs | Oswin Ply", "General questions about Oswin Ply, our products, and how to reach us."],
  };
  const [title, description] = map[category] || ["Frequently Asked Questions | Oswin Ply", "Answers to common questions about Oswin Ply products, warranty, installation, and support."];
  const canonical = category ? `https://www.oswinply.com/faq?category=${category}` : "https://www.oswinply.com/faq";
  return {
    title,
    description,
    alternates: { canonical },
    openGraph: { title, description, type: "website", site_name: "oswin ply" },
  };
}

const Page = async ({ searchParams }) => {
  const { category = '' } = await searchParams;

  const [{ data: banner = {} },
    { data: categories = [] },
  ] = await Promise.all([
    getRequestWithRevalidate("/cms/banner/faq"),
    getRequestWithRevalidate("/cms/faq-categories"),
  ]);


  const selectedCategory = category ? categories.find((c) => c.slug === category) : categories[0];
  const { data: faqs = [] } =
    await getRequestWithRevalidate(
      `/cms/faqs?categorys=${selectedCategory._id}`
    );



  return (
    <>
      <InnerBanner
        image={`${process.env.NEXT_PUBLIC_IMAGE_URL}${banner?.image}`}
        responsive_image={`${process.env.NEXT_PUBLIC_IMAGE_URL}${banner?.responsive_image}`}
        title={banner?.heading ?? ""}
        subtitle={banner?.description ?? ""}
        isHtml={true}
      />

      <FaqSection
        categories={categories}
        faqs={faqs}
        activeCategory={selectedCategory}
      />

      <HelpConnectLinkSec />
    </>
  );
};

export default Page;
