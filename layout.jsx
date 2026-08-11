import "./globals.css";
import "./Main.scss"
import Header from "@/Components/HeaderFooter/Header"
import Footer from "@/Components/HeaderFooter/Footer"
import { BrochureProvider } from "@/lib/context/BrochureContext";

export const metadata = {
  metadataBase: new URL("https://www.oswinply.com"),
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <link href="https://fonts.googleapis.com/css2?family=Roboto:ital,wght@0,100..900;1,100..900&display=swap" rel="stylesheet" />
        <script type="application/ld+json" dangerouslySetInnerHTML={{__html: JSON.stringify({
          "@context": "https://schema.org",
          "@graph": [
            {
              "@type": "Organization",
              "@id": "https://www.oswinply.com/#organization",
              "name": "Oswin Ply",
              "url": "https://www.oswinply.com/",
              "description": "Oswin Ply offers premium plywood, particle boards, flush doors and wood panels for interiors and construction. Trusted quality for architects and designers.",
              "logo": {
                "@type": "ImageObject",
                "@id": "https://www.oswinply.com/#logo",
                "url": "https://www.oswinply.com/images/logo.png"
              },
              "image": { "@id": "https://www.oswinply.com/#logo" },
              "sameAs": [
                "https://www.facebook.com/oswinply/",
                "https://x.com/oswinplywood",
                "https://www.linkedin.com/company/oswinply/?originalSubdomain=in",
                "https://www.instagram.com/oswinply/"
              ],
              "contactPoint": {
                "@type": "ContactPoint",
                "telephone": "+91 44 2669 0023",
                "contactType": "Customer Care",
                "areaServed": "India",
                "availableLanguage": "English"
              },
              "address": {
                "@type": "PostalAddress",
                "streetAddress": "183/1, Sydenhams Road, Apparao Garden, Choolai, Chennai - 600 112, Tamil Nadu, India",
                "addressLocality": "Chennai",
                "addressRegion": "Tamil Nadu",
                "postalCode": "600 112",
                "addressCountry": "IN"
              }
            },
            {
              "@type": "WebSite",
              "@id": "https://www.oswinply.com/#website",
              "url": "https://www.oswinply.com/",
              "name": "Oswin Ply",
              "inLanguage": "en",
              "publisher": { "@id": "https://www.oswinply.com/#organization" }
            },
            {
              "@type": "Brand",
              "@id": "https://www.oswinply.com/#brand",
              "name": "Oswin Ply",
              "url": "https://www.oswinply.com/",
              "logo": "https://www.oswinply.com/images/logo.png"
            }
          ]
        })}} />
        <script
          id="gtm-script"
          strategy="afterInteractive"
          dangerouslySetInnerHTML={{
            __html: `
              (function(w,d,s,l,i){w[l]=w[l]||[];
              w[l].push({'gtm.start': new Date().getTime(),event:'gtm.js'});
              var f=d.getElementsByTagName(s)[0],
              j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';
              j.async=true;
              j.src='https://www.googletagmanager.com/gtm.js?id='+i+dl;
              f.parentNode.insertBefore(j,f);
              })(window,document,'script','dataLayer','GTM-K4CZBCHS');
            `,
          }}
        />
      </head>
      <body>
        <noscript>
          <iframe
            src="https://www.googletagmanager.com/ns.html?id=GTM-K4CZBCHS"
            height="0"
            width="0"
            style={{ display: "none", visibility: "hidden" }}
          />
        </noscript>
        <BrochureProvider>
          <Header />
          {children}
          <Footer />
        </BrochureProvider>
      </body>
    </html>
  );
}
