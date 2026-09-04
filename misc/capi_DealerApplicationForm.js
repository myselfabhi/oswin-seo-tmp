"use client";
import { BecomeDealerAction } from "@/app/actions/BecomeDealerAction";
import { GetProductCategories } from "@/app/actions/Product.js";
import { BecomeDealerSechema } from "@/lib/validations/BecomeDealerSechema";
import { zodResolver } from "@hookform/resolvers/zod";
import { useCallback, useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { CommonBtnButton } from "../CommonSec";
import { useRouter } from "next/navigation"
import { indianStatesAndUTs } from "@/config/state.db.js"
import { collectTracking } from "@/lib/tracking";

const DealerApplicationForm = ({ fieldCss = {}, action = () => { }, dvalues = {} }) => {

    const fieldLayout = {
        name: "w-full",
        firm_name: "w-full",
        email: "w-full",
        phone: "w-full",
        pincode: "",
        categorys: "",
        state: "",
        city: "",
        message: "w-full",
        ...fieldCss,
    };

    const {
        register,
        handleSubmit,
        formState: { errors },
        reset,
        setValue,
    } = useForm({
        resolver: zodResolver(BecomeDealerSechema),
    });
    const router = useRouter();

    const [categories, setCategories] = useState([]);
    const [responseMsg, setResponseMsg] = useState(null);
    const [isSuccess, setIsSuccess] = useState(false);
    const [loading, setLoading] = useState(false);

    const fetchCategories = useCallback(async () => {
        try {
            const data = await GetProductCategories();
            return data;
        } catch (error) {
            console.error("Error fetching categories:", error);
            return null;
        }
    }, []);

    useEffect(() => {
        const load = async () => {
            const data = await fetchCategories();
            if (data) setCategories(data);
        };
        load();
    }, [fetchCategories]);

    const onSubmit = async (data) => {
        setLoading(true);
        setResponseMsg(null);

        const tracking = collectTracking();
        const form_name = "become_a_dealer";
        const form_location = "popup";
        // category <select> stores a Mongo ObjectId as its value; send the visible label
        // (trimmed - some CMS category names carry a trailing space that would fragment reporting)
        const product_category = (categories.find(c => String(c._id) === String(data.categorys))?.name || "").trim();

        const result = await BecomeDealerAction({ ...data, _capi: { tracking, form_name, form_location, product_category } });

        setLoading(false);
        setIsSuccess(result.success);
        setResponseMsg(result.message);

        if (result.success) {
            if (typeof window !== "undefined") {
                window.dataLayer = window.dataLayer || [];
                window.dataLayer.push({
                    event: "lead_submit",
                    event_id: tracking.event_id,
                    form_name,
                    form_location,
                    product_category,
                    lead_state: data.state || "",
                    lead_city: data.city || "",
                    user_data: {
                        email: data.email || "",
                        phone_number: data.phone || "",
                    },
                });
            }
            action()
            router.push("/thank-you");
            reset();
        }
    };
    useEffect(() => {
        if (dvalues?.categorys && categories.length > 0) {
            setValue("categorys", String(dvalues.categorys));
        }
    }, [dvalues?.categorys, categories, setValue]);

    return (
        <>
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
                        <input type="text" placeholder="Your Name*" maxLength={50} {...register("name")} />
                        {errors.name && (
                            <span className="absolute -bottom-6 right-2.5 font-size-14 text-red-500 text-sm">{errors.name.message}</span>
                        )}
                    </div>

                    <div className={`form-sec ${fieldLayout.firm_name} arche-vector`}>
                        <input type="text" placeholder="Firm Name*" {...register("firm_name")} />
                        {errors.firm_name && (
                            <span className="absolute -bottom-6 right-2.5 font-size-14 text-red-500 text-sm">{errors.firm_name.message}</span>
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


                    <div className={`form-sec ${fieldLayout.categorys} arche-vector`}>
                        <select {...register("categorys")}>
                            <option value="">Product Interest*</option>
                            {categories.map((category) => (
                                <option key={category._id} value={category._id}>
                                    {category.name}
                                </option>
                            ))}
                        </select>
                        {errors.categorys && (
                            <span className="absolute -bottom-6 right-2.5 font-size-14 text-red-500 text-sm">
                                {errors.categorys.message}
                            </span>
                        )}
                    </div>

                    <div className={`form-sec ${fieldLayout.state} arche-vector`}>
                        <select {...register("state")}>
                            <option value="">Select State*</option>
                            {
                                indianStatesAndUTs.map((state) => (
                                    <option key={state} value={state}>{state}</option>
                                ))
                            }
                        </select>
                        {errors.state && (
                            <span className="absolute -bottom-6 right-2.5 font-size-14 text-red-500 text-sm">{errors.state.message}</span>
                        )}
                    </div>

                    <div className={`form-sec ${fieldLayout.city} arche-vector`}>
                        <input type="text" placeholder="Your City*" {...register("city")} />
                        {errors.city && (
                            <span className="absolute -bottom-6 right-2.5 font-size-14 text-red-500 text-sm">{errors.city.message}</span>
                        )}
                    </div>

                    <div className={`form-sec ${fieldLayout.pincode} arche-vector`}>
                        <input
                            type="text"
                            placeholder="Pin Code*"
                            maxLength={6}
                            inputMode="numeric"
                            {...register("pincode")}
                        />
                        {errors.pincode && (
                            <span className="absolute -bottom-6 right-2.5 font-size-14 text-red-500 text-sm">{errors.pincode.message}</span>
                        )}
                    </div>
                    <div className={`form-sec ${fieldLayout.message} arche-vector`}>
                        <textarea rows={5} placeholder="Enter Your Message*" {...register("message")} />
                        {errors.message && (
                            <span className="absolute -bottom-6 right-2.5 font-size-14 text-red-500 text-sm">
                                {errors.message.message}
                            </span>
                        )}
                    </div>

                    <div className="form-sec w-full flex">
                        <CommonBtnButton
                            type="submit"
                            name={loading ? "Sending..." : "Submit Application"}
                            disabled={loading}
                        />
                    </div>
                </div>
            </form>
        </>
    );
};

export default DealerApplicationForm;
