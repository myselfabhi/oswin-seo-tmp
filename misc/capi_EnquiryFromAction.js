"use server";
import { postRequest } from "@/lib/apicall";
import { headers } from "next/headers";
import { dispatchLead } from "@/lib/metaCapi";

export async function EnquiryFromAction(formData) {
    try {
        const { _capi, ...leadFields } = formData || {};
        const response = await postRequest("/leads/connect-with-us", leadFields);
        if (response?.success === false) {
            return {
                success: false,
                message: response.message,
            }
        }
        if (_capi) {
            const hdrs = await headers();
            dispatchLead(leadFields, _capi, hdrs); // fire-and-forget, never blocks
        }
        return {
            success: true,
            message: response.message,
        }
    } catch (error) {
        return {
            success: false,
            message: "Something went wrong",

        };
    }

}
export async function BrouchreAction(formData) {
    try {
        const { _capi, ...leadFields } = formData || {};
        const response = await postRequest("/leads/brochure-leads", leadFields);
        if (response?.success === false) {
            return {
                success: false,
                message: response.message,
            }
        }
        if (_capi) {
            const hdrs = await headers();
            dispatchLead(leadFields, _capi, hdrs); // fire-and-forget, never blocks
        }
        return {
            success: true,
            message: response.message,
        }
    } catch (error) {
        return {
            success: false,
            message: "Something went wrong",

        };
    }

}
