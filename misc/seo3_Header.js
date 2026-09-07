"use client"
import BrouchreFrom from "@/Components/Others/BrouchreFrom"
import EnquiryFrom from "@/Components/Others/EnquiryFrom"
import FancyBoxElement from "@/Components/Others/FancyBox"
import Image from "next/image"
import Link from "next/link"
import { useState } from "react"
import "./Header.scss"
import SearchInput from "./SearchInput"
function Header() {
    const [maintabid, setmaintabid] = useState(false)
    const [tabid, settabid] = useState(null)
    const data = [
        {
            name: 'About Us',
            links: null,
            dropdown: [
                {
                    name: 'About Us',
                    link: '/about-us'
                },
                {
                    name: 'Our Team',
                    link: '/our-team'
                },
                {
                    name: 'Manufacturing Facilities',
                    link: '/manufacturing-facility'
                }
            ]

        },
        {
            name: 'Products',
            link: null,
            dropdown: [
                {
                    name: 'Plywood',
                    link: '/plywood/oswin-ply-club'
                },
                {
                    name: 'Doors',
                    link: '/doors/oswin-flush-door'
                },
                {
                    name: 'Prelam Particle Board',
                    link: '/prelam/solids'
                },
                {
                    name: 'Block-Board',
                    link: '/block-board/oswin-block-board'
                }
            ]
        },
        {
            name: 'Media Insights',
            link: null,
            dropdown: [
                {
                    name: 'Blogs',
                    link: '/blogs'
                },
                {
                    name: 'News & Media',
                    link: '/blogs'
                }
            ]
        },
        {
            name: 'Locate Us',
            link: '/contact-us',
            dropdown: null
        },
        {
            name: 'Career',
            link: '/career',
            dropdown: null
        },
    ]


    return (
        <>
            <header className="header">
                <div className="mobile-menubar flex justify-between items-start sm:hidden">
                    <Link className="item" href="https://api.whatsapp.com/send/?phone=+919566290005&text&type=phone_number&app_absent=0">
                        <Image src="/images/icon/mobile-whatsapp.svg" width={36} height={36} alt="" />
                        <span>WhatsApp</span>
                    </Link>
                    <FancyBoxElement btnstyle="item" popupid="pdf-form">
                        <Image src="/images/icon/download-brouchre.svg" width={36} height={36} alt="" />
                        <span>Download Brochure</span>
                    </FancyBoxElement>
                    <FancyBoxElement btnstyle="item" popupid="enq-form">
                        <Image src="/images/icon/aside-enq.svg" width={36} height={36} alt="" />
                        <span>Enquire Now</span>
                    </FancyBoxElement>
                    <Link className="item" href="/contact-us">
                        <Image src="/images/icon/dealer.svg" width={36} height={36} alt="" />
                        <span>Locate Us</span>
                    </Link>
                </div>
                <aside className="enq-whatsapp flex flex-col gap-1">
                    <FancyBoxElement btnstyle="item" popupid="enq-form">
                        <Image src="/images/icon/aside-enq.svg" width={30} height={30} alt="" />
                    </FancyBoxElement>
                    <Link className="item" href="https://api.whatsapp.com/send/?phone=+919566290005&text&type=phone_number&app_absent=0">
                        <Image src="/images/icon/mobile-whatsapp.svg" width={30} height={30} alt="" />
                    </Link>
                    <FancyBoxElement btnstyle="item" popupid="pdf-form">
                        <Image src="/images/icon/download-brouchre.svg" width={30} height={30} alt="" />
                    </FancyBoxElement>
                </aside>
                <div className="container">
                    <div className="inner-container flex flex-wrap justify-between items-center">
                        <div className="logo">
                            <Link href="/">
                                <Image src="/images/logo.png" width={333} height={85} unoptimized={true} alt="" />
                            </Link>
                        </div>
                        <div className="nav-sec flex justify-end items-center gap-4">
                            <ul className={`navbar flex ${maintabid === true ? 'show' : ''}`}>
                                {/* <button type="button" className="close sm:hidden" onClick={() => { setmaintabid(false), settabid(null) }}>X</button> */}
                                {data?.map((val, index) => {
                                    return (
                                        [val?.dropdown === null
                                            ?
                                            <li key={index}>
                                                <Link href={val?.link ?? ""} onClick={() => { setmaintabid(false) }}>{val?.name ?? ""}</Link>
                                            </li>
                                            :
                                            <li className={`dropdown ${tabid === index ? 'show' : ''}`} key={index} onClick={() => { tabid === index ? settabid(null) : settabid(index) }}>
                                                <Link href={'javascript:void(0)'}>{val?.name ?? ""}</Link>
                                                <ul className="sub-dropdown">
                                                    {val?.dropdown?.map((val, index) => {
                                                        return (
                                                            <li key={index}>
                                                                <Link href={val?.link ?? ""} onClick={() => { setmaintabid(false) }}>{val?.name ?? ""}</Link>
                                                            </li>
                                                        )
                                                    })}
                                                </ul>

                                            </li>
                                        ]
                                    )
                                })}
                            </ul>
                            <div className="search-enqbtn flex gap-4">
                                <SearchInput />
                                <FancyBoxElement btnstyle="enqbtn hidden justify-center items-center lg:flex" popupid="enq-form">
                                    Enquire Now
                                </FancyBoxElement>

                            </div>
                            <div className={`nav-toggle flex flex-col ${maintabid === true ? 'show' : ''} lg:hidden`} onClick={() => { setmaintabid(!maintabid) }}>
                                <span>&nbsp;</span>
                                <span>&nbsp;</span>
                                <span>&nbsp;</span>
                            </div>
                        </div>
                    </div>
                </div>
            </header>
            <div className="hidden max-w-xl" id="enq-form">
                <div className="title font-size-35 color-green">Enquire Now</div>
                <EnquiryFrom action={() => { }} />
            </div>
            <BrouchreFrom
                action={() => { }}
            />

        </>
    )
}
export default Header
