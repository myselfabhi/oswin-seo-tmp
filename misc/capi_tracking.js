// lib/tracking.js
// Client-side helpers for Meta Conversions API (CAPI) deduplication.
// The event_id created here travels to the server (for the CAPI call) AND is
// pushed to the dataLayer (for the browser Pixel), so Meta counts one lead, not two.

export function getCookie(name) {
  if (typeof document === "undefined") return "";
  const m = document.cookie.match("(^|;)\\s*" + name + "\\s*=\\s*([^;]+)");
  return m ? m.pop() : "";
}

// Unique per submission. The backend sends this same value to Meta.
export function newEventId() {
  return "lead_" + Date.now() + "_" + Math.random().toString(36).slice(2, 11);
}

// _fbc only exists if the visitor arrived with ?fbclid=. If the cookie is
// missing but fbclid is in the URL, build it.
export function getFbc() {
  if (typeof window === "undefined") return "";
  const existing = getCookie("_fbc");
  if (existing) return existing;
  const fbclid = new URLSearchParams(window.location.search).get("fbclid");
  return fbclid ? `fb.1.${Date.now()}.${fbclid}` : "";
}

export function collectTracking() {
  if (typeof window === "undefined") {
    return { event_id: newEventId(), fbp: "", fbc: "", gclid: "", page_url: "" };
  }
  return {
    event_id: newEventId(),
    fbp: getCookie("_fbp"),
    fbc: getFbc(),
    gclid: new URLSearchParams(window.location.search).get("gclid") || "",
    page_url: window.location.href,
  };
}
