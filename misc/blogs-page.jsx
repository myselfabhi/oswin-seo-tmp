import CommonSec, { CommonBtn, CommonHeading } from "@/Components//CommonSec"
import BlogsList from "@/Components/Others/BlogsList"
import InnerBanner from "@/Components/Others/InnerBanner"
import { getRequestWithRevalidate } from "@/lib/apicall.ts";
const page = async () => {

  const { data: banner = {} } = await getRequestWithRevalidate('/cms/banner/blogs-media');
  const data = {
    subtitle: 'Latest',
    title: 'Blog'
  }
  return (
    <>
      <InnerBanner
        image={`${process.env.NEXT_PUBLIC_IMAGE_URL}${banner?.image}`}
        responsive_image={`${process.env.NEXT_PUBLIC_IMAGE_URL}${banner?.responsive_image}`}
        title={banner?.heading ?? ""}
        subtitle={banner?.description ?? ""}
        isHtml={true}
      />
      <CommonSec secname="blogs-media-page common-spacing-py">
        <div className="inner-container">
          <div className="heading-btn-sec flex flex-wrap gap-4 justify-between items-center">
            <CommonHeading subtitle={data?.subtitle ?? ""} title={data?.title ?? ""} />
          </div>
          <div className="items grid grid-cols-1 gap-6 mt-4 sm:grid-cols-2 lg:grid-cols-3">
            <BlogsList />
          </div>
        </div>
      </CommonSec>
    </>
  )
}
export default page
