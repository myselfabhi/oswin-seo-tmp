import CommonDescSec from "@/Components/Others/CommonDescSec"
import InnerBanner from "@/Components/Others/InnerBanner";
import { getRequestWithRevalidate } from "@/lib/apicall.ts";

export async function generateMetadata() {
  const title = "Disclaimer | Oswin Ply";
  const description = "Legal disclaimer for the information published on the Oswin Ply website.";
  return {
    title,
    description,
    alternates: { canonical: "https://www.oswinply.com/disclaimer" },
    openGraph: { title, description, type: "website", site_name: "oswin ply" },
  };
}

const page = async () => {
  const { data: ApiData = {} } = await getRequestWithRevalidate('/cms/policies/disclaimer');
  const { banner = {} } = ApiData;

  return (
    <>
      <InnerBanner
        image={`${process.env.NEXT_PUBLIC_IMAGE_URL}${banner?.image}`}
        responsive_image={`${process.env.NEXT_PUBLIC_IMAGE_URL}${banner?.responsive_image}`}
        title={banner?.heading ?? ""}
        subtitle={banner?.description ?? ""}
        isHtml={true}
      />
      <CommonDescSec summary={ApiData.content} />
    </>
  )
}
export default page
