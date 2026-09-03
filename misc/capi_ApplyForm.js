"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { jobFormSchema } from "@/lib/validations/jobFormSchema";
import { CommonBtnButton } from "@/Components/CommonSec";
import Image from "next/image";
import { JobFormAction } from "@/app/actions/Jobs";
import { useRouter } from "next/navigation"
const ApplyForm = ({ jobData = {} }) => {
    const router = useRouter();
    const [filename, setFilename] = useState(
        "Click to upload or drag and drop"
    );
    const [serverError, setServerError] = useState("");

    const {
        register,
        handleSubmit,
        setValue,
        reset,
        formState: { errors, isSubmitting },
    } = useForm({
        resolver: zodResolver(jobFormSchema),
    });

    const onSubmit = async (data) => {
        try {
            setServerError("");
            const formData = new FormData();

            formData.append("name", data.name);
            formData.append("email", data.email);
            formData.append("phone", data.phone);
            formData.append("work", data.work || "");
            formData.append("file", data.file);
            formData.append("job", jobData._id);

            // 🔥 Static fields
            formData.append("filesField", JSON.stringify(["file"]));
            formData.append("objectField", JSON.stringify([]));
            const result = await JobFormAction(formData);

            if (!result.success) {
                setServerError(result.message || "Submission failed");
            } else {
                // Career applications push to the dataLayer for analytics, but are
                // NEVER sent to Meta (no CAPI, no event_id). Advertout's GTM Lead
                // tag must exclude form_name "career_apply".
                if (typeof window !== "undefined") {
                    window.dataLayer = window.dataLayer || [];
                    window.dataLayer.push({
                        event: "lead_submit",
                        form_name: "career_apply",
                        form_location: "career_page",
                        user_data: {
                            email: data.email || "",
                            phone_number: data.phone || "",
                        },
                    });
                }
                router.push("/thank-you");
                reset();
            }
        } catch (error) {
            console.error("Error submitting form:", error);
            setServerError("Submission failed");
        }
    };

    return (
        <>
            <div className="title font-size-35 color-green">
                Apply Now
            </div>

            <form onSubmit={handleSubmit(onSubmit)} className="mt-4" key={jobData?._id}>
                <div className="common-form-sec flex flex-wrap gap-y-8 justify-between">

                    {/* Name */}
                    <div className="form-sec arche-vector">
                        <input
                            type="text"
                            placeholder="Your Name*"
                            {...register("name")}
                        />
                        {errors.name && <span className="absolute -bottom-6 right-2.5 font-size-14 text-red-500 text-sm">{errors.name.message}</span>}
                    </div>

                    {/* Email */}
                    <div className="form-sec arche-vector">
                        <input
                            type="email"
                            placeholder="Your Email*"
                            {...register("email")}
                        />
                        {errors.email && <span className="absolute -bottom-6 right-2.5 font-size-14 text-red-500 text-sm">{errors.email.message}</span>}
                    </div>

                    {/* Phone */}
                    <div className="form-sec arche-vector">
                        <input
                            type="text"
                            placeholder="Phone Number*"
                            {...register("phone")}
                        />
                        {errors.phone && <span className="absolute -bottom-6 right-2.5 font-size-14 text-red-500 text-sm">{errors.phone.message}</span>}
                    </div>

                    {/* Work */}
                    <div className="form-sec arche-vector links">
                        <input
                            type="url"
                            placeholder="Add Your Work"
                            {...register("work")}
                        />
                    </div>

                    {/* File */}
                    <div className="form-sec file w-full arche-vector">
                        <input
                            type="file"
                            accept=".pdf,.doc,.docx"
                            {...register("file")}
                            onChange={(e) => {
                                const file = e.target.files[0];
                                setValue("file", file);
                                setFilename(file?.name || "Click to upload");
                            }}
                        />

                        <div className="file-sec flex flex-col justify-center items-center">
                            <Image
                                src="/images/icon/uploadfile-shadow.svg"
                                width={80}
                                height={80}
                                alt=""
                            />
                            <div className="text">
                                <div>{filename}</div>
                                <div>PDF, DOC, DOCX (max 5MB)</div>
                            </div>
                        </div>

                        {errors.file && <span className="absolute -bottom-6 right-2.5 font-size-14 text-red-500 text-sm">{errors.file.message}</span>}
                        {errors.job && <span className="absolute -bottom-6 right-2.5 font-size-14 text-red-500 text-sm">{errors.job.message}</span>}
                        {serverError && <span className="absolute -bottom-6 right-2.5 font-size-14 text-red-500 text-sm">{serverError}</span>}
                    </div>
                    {/* Submit */}
                    <div className="form-sec w-full flex">
                        <CommonBtnButton
                            type="submit"
                            name={isSubmitting ? "Submitting..." : "Submit"}
                        />
                    </div>


                </div>
            </form>
        </>
    );
};

export default ApplyForm;
