import "./BlogsList.scss"
import Image from "next/image"
import { CommonBtn, RoundBtn } from "../CommonSec";
import { getRequestWithRevalidate } from "@/lib/apicall.ts";
const BlogsList = async () => {
    // Blogs page now shows a single, unified list: regular blogs plus the
    // items that used to live under "News & Media". Both collections share the
    // same shape and both render under /blogs/[slug].
    const [{ data: blogListing = [] }, { data: newsListing = [] }] = await Promise.all([
        getRequestWithRevalidate('/cms/blog'),
        getRequestWithRevalidate('/cms/news-media'),
    ]);

    // Show newest first (sort by date, descending). Copy so we don't mutate the
    // fetched arrays; unparseable dates fall back to epoch.
    const sortedBlogs = [...(blogListing ?? []), ...(newsListing ?? [])].sort(
        (a, b) => new Date(b?.date ?? 0) - new Date(a?.date ?? 0)
    );

    return (
        [
            sortedBlogs?.map((val, index) => {
                return (
                    <div className="blog-list" key={val._id}>
                        <div className="image">
                            <Image src={`${process.env.NEXT_PUBLIC_IMAGE_URL}${val?.thumbnail_image ?? ""}`} width={530} height={330} alt={val?.name ?? "Oswin Ply blog"} />
                        </div>
                        <div className="detail">
                            <div className="title-links flex flex-wrap justify-between">

                                <div className="title  font-medium">
                                    <div className="date">{val?.date ?? ""}</div>
                                    <div className="titles mt-1">{val?.name ?? ""}</div>
                                </div>
                                <RoundBtn theme="small green hidden md:flex" link={`/blogs/${val?.slug ?? ""}`} name="More" />
                                <CommonBtn theme="small green ml-4 flex md:hidden" link={`/blogs/${val?.slug ?? ""}`} name="More" />
                            </div>
                        </div>
                    </div>
                )
            })
        ]
    )
}
export default BlogsList
