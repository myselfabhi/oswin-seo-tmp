import CommonDescSec from "@/Components/Others/CommonDescSec"
import InnerBanner from "@/Components/Others/InnerBanner";
import { getRequestWithRevalidate } from "@/lib/apicall.ts";

export async function generateMetadata() {
  const title = "Privacy Policy | Oswin Ply";
  const description = "Read Oswin Ply's privacy policy covering how we collect, use, and protect your information.";
  return {
    title,
    description,
    alternates: { canonical: "https://www.oswinply.com/privacy-policy" },
    openGraph: { title, description, type: "website", site_name: "oswin ply" },
  };
}

const Page = async () => {
  const { data: ApiData = {} } = await getRequestWithRevalidate('/cms/policies/privacy-policy');
  const { banner = {} } = ApiData;

  return (
    <>
      <InnerBanner
        image={`${process.env.NEXT_PUBLIC_IMAGE_URL}${banner?.image}`}
        responsive_image={`${process.env.NEXT_PUBLIC_IMAGE_URL}${banner?.responsive_image}`}
        title={banner?.heading ?? ""}
        subtitle={banner?.description ?? ""}
        isHtml={true}
      />  <CommonDescSec summary={ApiData.content} />
    </>
  )
}
export default Page
