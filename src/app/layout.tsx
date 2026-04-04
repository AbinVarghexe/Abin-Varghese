import type { Metadata } from "next";
import { Poppins } from "next/font/google";
import localFont from "next/font/local";
import "@/styles/globals.css";
import { PersonSchema } from "@/seo/schema";
import { metadata as seoMetadata, viewport } from "@/seo/metadata";
import ClientLayoutWrapper from "@/components/common/ClientLayoutWrapper";

const poppins = Poppins({
  weight: ["300", "400", "500", "600", "700"],
  subsets: ["latin"],
  variable: "--font-poppins",
});

const vina = localFont({
  src: "../../public/fonts/vina.ttf",
  variable: "--font-vina",
  display: "swap",
});

export const metadata: Metadata = seoMetadata;
export { viewport };

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${poppins.variable} ${vina.variable} antialiased select-none`}
      >
        <PersonSchema />
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function (C, A, L) {
                let p = function (a, ar) { a.q.push(ar); };
                let d = C.document;
                C.Cal = C.Cal || function () {
                  let cal = C.Cal;
                  let ar = arguments;
                  if (!cal.loaded) {
                    cal.q = cal.q || [];
                    cal.loaded = true;
                  }
                  if (ar[0] === "init") {
                    const api = function () { p(api, arguments); };
                    const cand = d.createElement("script");
                    cand.src = A;
                    cand.async = true;
                    d.getElementsByTagName("head")[0].appendChild(cand);
                    api.q = api.q || [];
                    return api;
                  }
                  p(cal, ar);
                };
              })(window, "https://app.cal.com/embed/embed.js", "init");
              Cal("init", { origin: "https://app.cal.com" });
              Cal("ui", {"styles":{"branding":{"brandColor":"#0020d7"}},"hideEventTypeDetails":false,"layout":"month_view"});
            `,
          }}
        />
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                const theme = localStorage.getItem("theme");
                if (theme === "dark" || (!theme && window.matchMedia("(prefers-color-scheme: dark)").matches)) {
                  document.documentElement.classList.add("dark");
                }
              })();
            `,
          }}
        />
        <ClientLayoutWrapper>
          {children}
        </ClientLayoutWrapper>
      </body>
    </html>
  );
}
