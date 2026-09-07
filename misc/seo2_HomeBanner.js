"use client";
import CommonSec, { CommonBtn } from "@/Components/CommonSec";
import CommonSlider from '@/Components/SliderCommon/CommonSlider';
import { gsap } from "gsap";
import Image from "next/image";
import { useEffect, useRef } from "react";
import "./HomeBanner.scss";

const bannerslide = [
    {
        image: '/images/banner-image01.jpg',
        tag: 'Oswin Ply',
        title: 'Built for',
        subtitle: 'Professionals',
        desc: 'The preferred choice for architects & builders',
        link: '/'
    },
    {
        image: '/images/banner-image02.jpg',
        tag: 'Oswin Ply',
        title: 'Built for',
        subtitle: 'Professionals',
        desc: 'The preferred choice for architects & builders',
        link: '/'
    },
    {
        image: '/images/banner-image03.jpg',
        tag: 'Oswin Ply',
        title: 'Built for',
        subtitle: 'Professionals',
        desc: 'The preferred choice for architects & builders',
        link: '/'
    },
]
const HomeBanner = ({ BannerData = [], isHtml = true, isHtmlTitle = true }) => {
    return (
        <section className="homebanner-sec slider">
            <div className="container">
                {/* TS-114: the banner slider (CommonSlider) renders client-side only, so its
                    heading is not in the server HTML crawlers see. This single server-rendered
                    H1 carries the hero heading for SEO; it is visually hidden so it does not
                    duplicate the visible slider title. Exactly one H1 per page. */}
                {BannerData?.[0]?.heading
                    ? <h1 className="visually-hidden-h1" style={{ position: "absolute", width: "1px", height: "1px", padding: 0, margin: "-1px", overflow: "hidden", clip: "rect(0,0,0,0)", whiteSpace: "nowrap", border: 0 }} dangerouslySetInnerHTML={{ __html: BannerData[0].heading }} />
                    : <h1 className="visually-hidden-h1" style={{ position: "absolute", width: "1px", height: "1px", padding: 0, margin: "-1px", overflow: "hidden", clip: "rect(0,0,0,0)", whiteSpace: "nowrap", border: 0 }}>Oswin Ply Plywood, Panel Doors, Block Board and Prelam Boards Manufacturer</h1>}
                <CommonSlider btnpos="no-btns" desktopcount={1} arrow={false}>
                    {BannerData?.map((val, index) => {
                        return (
                            <div className="item relative" key={index}>
                                <Image className="bannerimage desktop" src={`${process.env.NEXT_PUBLIC_IMAGE_URL}${val?.image ?? ""}`} alt={val?.alt ?? "Home banner"} width={1820} height={905} />
                                <Image className="bannerimage mobile" src={`${process.env.NEXT_PUBLIC_IMAGE_URL}${val?.responsive_image ?? ""}`} alt={val?.alt ?? "Home banner"} width={500} height={500} />
                                <div className="inner-container banner-text flex flex-col gap-2">
                                    <div className="tag">{val?.tagline ?? "Oswin Ply"}</div>
                                    {isHtmlTitle ? <div className="title-sec" dangerouslySetInnerHTML={{ __html: val?.heading ?? "" }} /> : <div className="title-sec">
                                        {val?.highlighttext &&
                                            <span>{val?.highlighttext}</span>
                                        }
                                        {val?.heading ?? ""}
                                    </div>}
                                    {isHtml ? <div className="desc hidden sm:block" dangerouslySetInnerHTML={{ __html: val?.description ?? "" }} /> : <div className="desc">{val?.description ?? ""}</div>
                                    }
                                    <div className="links flex mt-4">
                                        <CommonBtn link={val?.link ?? "/"} name={val?.buttonName} target={val?.link_target ?? "_self"} />
                                    </div>
                                </div>
                            </div>
                        )
                    })}
                </CommonSlider>
            </div>
        </section>
    )
}

const features = [
    {
        name: 'Premium plywood',
        icon: '/images/icon/features01.svg'
    },
    {
        name: 'Ideal for Humidity',
        icon: '/images/icon/features01.svg'
    },
    {
        name: 'Eco-friendly Products',
        icon: '/images/icon/features01.svg'
    },
    {
        name: 'Water Resistance',
        icon: '/images/icon/features01.svg'
    },
    {
        name: 'ISI Certified ',
        icon: '/images/icon/features01.svg'
    },
    {
        name: 'ISO Certified ',
        icon: '/images/icon/features01.svg'
    },
    {
        name: 'ARTechnology ',
        icon: '/images/icon/features01.svg'
    },
    {
        name: 'Premium plywood',
        icon: '/images/icon/features01.svg'
    },
    {
        name: 'Ideal for Humidity',
        icon: '/images/icon/features01.svg'
    },
    {
        name: 'Eco-friendly Products',
        icon: '/images/icon/features01.svg'
    },
    {
        name: 'Water Resistance',
        icon: '/images/icon/features01.svg'
    },
    {
        name: 'ISI Certified ',
        icon: '/images/icon/features01.svg'
    },
    {
        name: 'ISO Certified ',
        icon: '/images/icon/features01.svg'
    },
    {
        name: 'ARTechnology ',
        icon: '/images/icon/features01.svg'
    },
]
// const CompanyFeatures = ({ features = [] }) => {
//     if (features.length === 0) {

//         return <></>
//     }
//     return (
//         <CommonSec secname="company-features">
//             <div className="pointer marquee-wrapper">
//                 <div className="marquee">
//                     {features?.map((val, index) => {
//                         return (
//                             <div className="item flex gap-2 flex-wrap items-center" key={index}>
//                                 <div className="icon">
//                                     <Image src={`${process.env.NEXT_PUBLIC_IMAGE_URL}${val?.logo ?? ""}`} width={45} height={45} alt={val?.name ?? ""} />
//                                 </div>
//                                 <div className="text">{val?.name ?? ""}</div>
//                             </div>
//                         )
//                     })}
//                 </div>
//             </div>
//         </CommonSec>
//     )
// }


const CompanyFeatures = ({ features = [] }) => {
    const wrapperRef = useRef(null);
    const trackRef = useRef(null);

    useEffect(() => {
        const track = trackRef.current;

        const items = Array.from(track.children);

        // get exact width of original items
        let originalWidth = 0;
        items.forEach((item) => {
            originalWidth += item.offsetWidth;
        });

        // duplicate once
        items.forEach((item) => {
            track.appendChild(item.cloneNode(true));
        });

        const ctx = gsap.context(() => {
            gsap.fromTo(
                track,
                { x: 0 },
                {
                    x: -originalWidth,
                    duration: 60,
                    ease: "none",
                    repeat: -1,
                }
            );
        }, wrapperRef);

        return () => ctx.revert();
    }, []);
    if (features.length === 0) {

        return <></>
    }
    return (

        <div className="company-feature overflow-hidden" ref={wrapperRef}>
            <div className="container">
                <div className="pointer marquee-wrapper flex overflow-hidden">
                    <div className="inner flex" ref={trackRef}>
                        {features?.map((val, index) => {
                            return (
                                <div className="item flex gap-2 flex-wrap items-center" key={index}>
                                    <div className="icon">
                                        <Image src={`${process.env.NEXT_PUBLIC_IMAGE_URL}${val?.logo ?? ""}`} width={45} height={45} alt={val?.name ?? ""} />
                                    </div>
                                    <div className="text">{val?.name ?? ""}</div>
                                </div>
                            )
                        })}
                    </div>
                </div>
            </div>
        </div>
    );
};
export default HomeBanner
export { CompanyFeatures };
