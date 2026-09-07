import Image from "next/image"
import "../HomeBanner/HomeBanner.scss"
const InnerBanner = ({ image, responsive_image, highlighttext, title, subtitle, isHtml = false, isHtmlTitle = false }) => {
  return (
    <section className="homebanner-sec">
      <div className="container relative">
        <Image className="bannerimage desktop" src={image ?? ""} width={1818} height={649} alt="" />
       {responsive_image && <Image className="bannerimage mobile" src={responsive_image ?? ""} width={500} height={500} alt="" />}
        <div className="inner-container banner-text flex flex-col gap-2">
          {isHtmlTitle ? <h1 className="title-sec" dangerouslySetInnerHTML={{ __html: title ?? "" }} /> : <h1 className="title-sec">
            {highlighttext &&
              <span>{highlighttext}</span>
            }
            {title ?? ""}
          </h1>}
          {isHtml ? <div className="desc" dangerouslySetInnerHTML={{ __html: subtitle ?? "" }} /> : <div className="desc">{subtitle ?? ""}</div>
          }

        </div>
      </div>
    </section>
  )
}
export default InnerBanner
