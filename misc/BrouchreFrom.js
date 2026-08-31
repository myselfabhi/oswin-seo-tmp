"use client";
import { BrouchreAction } from "@/app/actions/EnquiryFromAction";
import { brouchreSchema } from "@/lib/validations/brouchreSchema";
import { Fancybox } from "@fancyapps/ui";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { CommonBtnButton } from "../CommonSec";
import { useBrochure } from "@/lib/context/BrochureContext";

const BrouchreFrom = ({ action = () => { } }) => {
    const { brochure } = useBrochure();
    const fieldLayout = {
        name: "w-full",
        email: "w-full",
        phone: "w-full",
    };

    const {
        register,
        handleSubmit,
        formState: { errors },
        reset,
    } = useForm({
        resolver: zodResolver(brouchreSchema),

    });

    const [responseMsg, setResponseMsg] = useState(null);
    const [isSuccess, setIsSuccess] = useState(false);
    const [loading, setLoading] = useState(false);
    // Both brochures are hosted same-origin on the frontend so blob downloads
    // work reliably (the CMS-hosted PDFs send no CORS header and get blocked).
    const ALL_BROCHURES = [
        { name: "Oswin Ply", url: "/brochures/oswin-ply.pdf" },
        { name: "Oswin Prelam & Block", url: "/brochures/oswin-prelam-block.pdf" },
    ];
    const downloadOne = async (f) => {
        try {
            const response = await fetch(f.url);
            if (!response.ok) throw new Error("bad response " + response.status);
            const blob = await response.blob();
            const blobUrl = window.URL.createObjectURL(blob);
            const link = document.createElement("a");
            link.href = blobUrl;
            link.download = `${f.name} Brochure.pdf`;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            window.URL.revokeObjectURL(blobUrl);
        } catch (error) {
            // fallback: open the PDF directly so it's still accessible
            window.open(f.url, "_blank", "noopener");
        }
    };
    // Give the user BOTH brochures in one go (small stagger so the browser
    // accepts the second download rather than swallowing it).
    const handleDownload = async () => {
        for (let i = 0; i < ALL_BROCHURES.length; i++) {
            await downloadOne(ALL_BROCHURES[i]);
            if (i < ALL_BROCHURES.length - 1) {
                await new Promise((r) => setTimeout(r, 500));
            }
        }
    };
    const onSubmit = async (data) => {
        setLoading(true);
        setResponseMsg(null);
        const result = await BrouchreAction({ ...data, type: brochure.name });
        setIsSuccess(result.success);
        setResponseMsg(result.message);
        if (result.success) {
            action()
            handleDownload()
            reset();
            Fancybox.close();
        }
        setLoading(false);
    };
    useEffect(() => {
        if (responseMsg) {
            const timer = setTimeout(() => {
                setResponseMsg(null);
                setIsSuccess(false);
            }, 3000);

            return () => clearTimeout(timer);
        }
    }, [responseMsg]);


    return (
        <>

            <div className="hidden max-w-xl" id="pdf-form">
                <div className="title font-size-35 color-green">Download Brochure</div>
                {/* ✅ Response Message */}
                {responseMsg && (
                    <div
                        className={`mt-3 p-3 rounded ${isSuccess
                            ? "bg-green-100 text-green-700"
                            : "bg-red-100 text-red-700"
                            }`}
                    >
                        {responseMsg}
                    </div>
                )}

                <form className="mt-4" onSubmit={handleSubmit(onSubmit)}>
                    <div className="common-form-sec flex flex-wrap gap-y-8 justify-between">

                        <div className={`form-sec ${fieldLayout.name} arche-vector`}>
                            <input type="text" placeholder="Your Name*" {...register("name")} />
                            {errors.name && (
                                <span className="absolute -bottom-6 right-2.5 font-size-14 text-red-500 text-sm">{errors.name.message}</span>
                            )}
                        </div>

                        <div className={`form-sec ${fieldLayout.email} arche-vector`}>
                            <input type="email" placeholder="Your Email*" {...register("email")} />
                            {errors.email && (
                                <span className="absolute -bottom-6 right-2.5 font-size-14 text-red-500 text-sm">{errors.email.message}</span>
                            )}
                        </div>

                        <div className={`form-sec ${fieldLayout.phone} arche-vector`}>
                            <input
                                type="text"
                                placeholder="Phone Number*"
                                maxLength={10}
                                inputMode="numeric"
                                {...register("phone")}
                            />
                            {errors.phone && (
                                <span className="absolute -bottom-6 right-2.5 font-size-14 text-red-500 text-sm">{errors.phone.message}</span>
                            )}
                        </div>


                        <div className="form-sec w-full flex">
                            <CommonBtnButton
                                type="submit"
                                name={loading ? "Downloading..." : "Download Now"}
                                disabled={loading}
                            />
                        </div>
                    </div>
                </form>
            </div>
        </>
    );
};
export default BrouchreFrom;

