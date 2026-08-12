import CommonSec from "@/Components/CommonSec"
import BlogDetail from "./Components/BlogDetail";
import { getRequestWithRevalidate } from "@/lib/apicall.ts";
import { DefultMetaData } from "@/lib/DefultSEO.js";

const SITE = "https://www.oswinply.com";
const IMG = process.env.NEXT_PUBLIC_IMAGE_URL || "https://cms.oswinply.com";

// A /blogs/[slug] can be a regular blog or one of the former "News & Media"
// items (now merged under Blogs). Try the blog collection first, then fall
// back to news-media so both render at /blogs/[slug].
async function getPost(slug) {
  const blog = (await getRequestWithRevalidate(`/cms/blog/${slug}`)) ?? {};
  if (blog?.data?._id) return blog.data;
  const news = (await getRequestWithRevalidate(`/cms/news-media/${slug}`)) ?? {};
  return news?.data ?? {};
}

export async function generateMetadata({ params }) {
  try {
    const { slug } = await params;
    const data = await getPost(slug);
    const seo = data?.seo ?? {};
    const url = `${SITE}/blogs/${slug}`;
    const title = seo.title || data?.name || DefultMetaData.title;
    const description = seo.description || DefultMetaData.description;
    const image = data?.thumbnail_image ? `${IMG}${data.thumbnail_image}` : DefultMetaData.og_image;
    return {
      title,
      description,
      keywords: seo.keywords || DefultMetaData.keywords,
      alternates: { canonical: url },
      openGraph: {
        title,
        description,
        url,
        type: "article",
        siteName: "Oswin Ply",
        images: [image],
      },
    };
  } catch (e) {
    return DefultMetaData;
  }
}

const Page = async ({ params }) => {
  const { slug } = await params;
  const blogListing = await getPost(slug);

  const url = `${SITE}/blogs/${slug}`;
  const image = blogListing?.thumbnail_image
    ? `${IMG}${blogListing.thumbnail_image}`
    : `${SITE}/images/logo.png`;
  const published = blogListing?.date || blogListing?.createdAt;
  const modified = blogListing?.updatedAt || published;

  const blogPostingLd = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    "mainEntityOfPage": { "@type": "WebPage", "@id": url },
    "headline": blogListing?.name ?? "",
    "image": image ? [image] : undefined,
    "datePublished": published,
    "dateModified": modified,
    "author": { "@type": "Organization", "name": "Oswin Ply", "@id": `${SITE}/#organization` },
    "publisher": { "@id": `${SITE}/#organization` },
    "url": url,
  };

  const breadcrumbLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": [
      { "@type": "ListItem", "position": 1, "name": "Home", "item": `${SITE}/` },
      { "@type": "ListItem", "position": 2, "name": "Blogs", "item": `${SITE}/blogs` },
      { "@type": "ListItem", "position": 3, "name": blogListing?.name ?? "" },
    ],
  };

  return (
    <CommonSec secname="blog-detail-page common-spacing-py nobanner-add">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(blogPostingLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbLd) }} />
      <BlogDetail apiData={blogListing} />
    </CommonSec>
  )
}
export default Page;
