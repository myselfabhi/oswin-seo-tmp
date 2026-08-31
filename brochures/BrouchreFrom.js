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
    // CMS-hosted PDFs send no CORS header, so a cross-origin fetch() is blocked.
    // Prefer a same-origin copy on the frontend; fall back to opening the file.
    const FRONTEND_BROCHURES = {
        "1782118641710_owswin_ply__Brochure.pdf": "/brochures/oswin-ply.pdf",
        "1782118641728_Oswinply_-_Prelam_and_block.pdf": "/brochures/oswin-prelam-block.pdf",
    };
    const handleDownload = async () => {
        let url = brochure?.url || "";
        try {
            const fname = decodeURIComponent((url.split("/").pop() || ""));
            if (FRONTEND_BROCHURES[fname]) url = FRONTEND_BROCHURES[fname];
        } catch (e) { /* keep original url */ }
        try {
            const response = await fetch(url);
            if (!response.ok) throw new Error("bad response " + response.status);
            const blob = await response.blob();
            const blobUrl = window.URL.createObjectURL(blob);
            const link = document.createElement("a");
            link.href = blobUrl;
            link.download = `${brochure.name} Brochure.pdf`;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            window.URL.revokeObjectURL(blobUrl);
        } catch (error) {
            // cross-origin / CORS fallback: open the PDF directly so it's still accessible
            window.open(url || brochure.url, "_blank", "noopener");
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

