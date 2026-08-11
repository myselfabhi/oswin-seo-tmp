import SharPost from "@/Components/Others/SharPost";
import { formatDate } from "@/lib/helper";
import Image from "next/image";
import "./BlogDetail.scss";
import LatestBlogs from "./LatestBlogs";


const ImageBlock = ({ images }) => {
    if (!images?.length) return null;

    if (images.length === 1) {
        return (
            <div className="image-sec my-4">
                <Image
                    src={`${process.env.NEXT_PUBLIC_IMAGE_URL}${images[0]}`}
                    alt=""
                    width={1042}
                    height={426}
                    className="w-full full"
                />
            </div>
        );
    }

    return (
        <div className="image-sec flex flex-wrap gap-8 my-4">
            {images.map((img, i) => (
                <Image
                    key={i}
                    src={`${process.env.NEXT_PUBLIC_IMAGE_URL}${img}`}
                    alt=""
                    width={496}
                    height={593}
                    className="w-full"
                />
            ))}
        </div>
    );
};
export const BlogSection = ({ section }) => {
    const { description, images = [], show_image } = section;
    return (
        <section className="blog-section">
            {/* Images on top */}
            {show_image === "top" && <ImageBlock images={images} />}
            {show_image === "left" && <ImageBlock images={images} />}
            {show_image === "right" && <ImageBlock images={images} />}

            {/* Content */}
            <div className="summary-sec mt-4 lg:mt-8" dangerouslySetInnerHTML={{ __html: description }} />

            {/* Images at bottom */}
            {show_image === "bottom" && <ImageBlock images={images} />}
        </section>
    );
};
const BlogDetail = async ({ apiData = {} }) => {
    const __pub = apiData?.date ? new Date(apiData.date) : null;
    const __mod = apiData?.updatedAt ? new Date(apiData.updatedAt) : null;
    const __showUpdated = __pub && __mod && __mod.toISOString().slice(0,10) !== __pub.toISOString().slice(0,10);
    return (
        <div className="inner-container flex flex-wrap justify-between items-start">
            <div className="left">
                <div className="blogheading font-size-40 font-light">{apiData?.name ?? ""}</div>
                <div className="time-year-sec flex flex-wrap gap-3 mt-4">
                    <div className="time flex gap-2 items-center">
                        <div className="icon">
                            <Image src="/images/icon/icon-callander.svg" width={20} height={20} alt="" />
                        </div>
                        <div className="text font-size-14">{formatDate(apiData?.date) ?? ""}</div>
                    </div>
                    {__showUpdated && (
                      <div className="time flex gap-2 items-center" style={{ opacity: 0.7 }}>
                        <div className="text font-size-14">Last updated: {formatDate(apiData?.updatedAt)}</div>
                      </div>
                    )}
                    <SharPost url={`/blogs/${apiData.slug}}`}/>
                </div>
                <div className="blog-wrapper">
                    {apiData?.content.map((section) => (
                        <BlogSection key={section._id} section={section} />
                    ))}
                </div>
            </div>
            <div className="right">
                <div className="title font-size-40 color-green">Latest Blogs</div>
                <LatestBlogs _id_ne={apiData?._id} />
            </div>
        </div>
    )
}
export default BlogDetail
