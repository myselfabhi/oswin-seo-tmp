// lib/metaCapi.js
// Server-only Meta Conversions API sender (Node `crypto` keeps it off the client
// bundle; only ever imported by server actions). Stays completely dormant until
// META_CAPI_TOKEN is present in the environment, so this file is safe to ship
// before the token exists.
import crypto from "crypto";

const PIXEL_ID = process.env.META_PIXEL_ID || "946888131787016";
const API_VERSION = "v21.0";

const sha256 = (v) => crypto.createHash("sha256").update(String(v)).digest("hex");

// Normalise, THEN hash. Order matters.
const norm = {
  email: (v) => String(v).trim().toLowerCase(),
  name: (v) => String(v).trim().toLowerCase().split(/\s+/)[0].replace(/[^a-z]/g, ""),
  text: (v) => String(v).trim().toLowerCase().replace(/[^a-z0-9]/g, ""),
  zip: (v) => String(v).replace(/\D/g, ""),
};

// India: 10 digits -> prefix 91. No plus sign, digits only.
function normPhone(raw) {
  let d = String(raw).replace(/\D/g, "");
  if (d.length === 10) d = "91" + d;
  if (d.startsWith("091")) d = "91" + d.slice(3);
  return d;
}

// Every hashed field is an array, even with one value. Empty -> undefined (never hash "").
const h = (fn, v) => (v ? [sha256(fn(String(v)))] : undefined);

async function postToMeta(payload) {
  const TOKEN = process.env.META_CAPI_TOKEN;
  const url =
    `https://graph.facebook.com/${API_VERSION}/${PIXEL_ID}/events` +
    `?access_token=${TOKEN}`;
  const res = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  const json = await res.json();
  if (!res.ok) throw new Error(json?.error?.message || "CAPI request failed");
  return json;
}

// Build + send a single Lead event. Fully self-contained and never throws to the caller.
export async function sendLeadToMeta(lead) {
  try {
    if (!process.env.META_CAPI_TOKEN) return; // dormant until token is set
    if (lead.form_name === "career_apply") return; // NEVER send job applications

    const user_data = {
      em: h(norm.email, lead.email),
      ph: lead.phone ? [sha256(normPhone(lead.phone))] : undefined,
      fn: h(norm.name, lead.name),
      ct: h(norm.text, lead.city),
      st: h(norm.text, lead.state),
      zp: h(norm.zip, lead.pincode),
      country: [sha256("in")],
      // these four are NEVER hashed
      client_ip_address: lead.client_ip || undefined,
      client_user_agent: lead.client_user_agent || undefined,
      fbp: lead.fbp || undefined,
      fbc: lead.fbc || undefined,
    };
    // drop empty keys - never send hashes of ''
    Object.keys(user_data).forEach(
      (k) => user_data[k] === undefined && delete user_data[k]
    );

    const payload = {
      data: [
        {
          event_name: "Lead",
          event_time: lead.submitted_at || Math.floor(Date.now() / 1000),
          event_id: lead.event_id,
          event_source_url: lead.page_url,
          action_source: "website",
          user_data,
          custom_data: {
            content_name: lead.form_name || "",
            content_category: (lead.product_category || "").trim(),
          },
        },
      ],
    };
    if (process.env.META_TEST_EVENT_CODE) {
      payload.test_event_code = process.env.META_TEST_EVENT_CODE;
    }

    // 3 attempts with backoff. Meta accepts events up to 7 days old.
    const delays = [0, 1000, 5000];
    let lastErr;
    for (let i = 0; i < delays.length; i++) {
      if (delays[i]) await new Promise((r) => setTimeout(r, delays[i]));
      try {
        const json = await postToMeta(payload);
        console.log("[meta-capi] ok", {
          form_name: lead.form_name,
          event_id: lead.event_id,
          events_received: json?.events_received,
          fbtrace: json?.fbtrace_id,
        });
        return;
      } catch (e) {
        lastErr = e;
      }
    }
    console.error(
      "[meta-capi] failed after retries:",
      lastErr?.message,
      "event_id:",
      lead.event_id
    );
  } catch (err) {
    console.error("[meta-capi] error:", err?.message);
  }
}

// Called from a server action with the request headers. Reads visitor IP + UA
// (only correct here, not on the CMS), then fires the send WITHOUT blocking the
// form response. Never throws.
export function dispatchLead(leadFields, capi, hdrs) {
  try {
    if (!capi) return;
    const xff = (hdrs && hdrs.get && hdrs.get("x-forwarded-for")) || "";
    const client_ip = String(xff).split(",")[0].trim();
    const client_user_agent = (hdrs && hdrs.get && hdrs.get("user-agent")) || "";
    const t = capi.tracking || {};
    void sendLeadToMeta({
      ...leadFields,
      form_name: capi.form_name,
      product_category: capi.product_category || "",
      event_id: t.event_id,
      fbp: t.fbp,
      fbc: t.fbc,
      page_url: t.page_url,
      client_ip,
      client_user_agent,
      submitted_at: Math.floor(Date.now() / 1000),
    }).catch(() => {});
  } catch (e) {
    /* never block the form */
  }
}
