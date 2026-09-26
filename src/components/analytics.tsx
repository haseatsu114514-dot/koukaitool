import Script from "next/script";
import { GA_ID } from "@/lib/analytics";

/** Loads Google Analytics only when NEXT_PUBLIC_GA_ID is set at build time. Disclosed on the privacy page. */
export function Analytics() {
  if (!GA_ID) return null;
  return <>
    <Script src={`https://www.googletagmanager.com/gtag/js?id=${GA_ID}`} />
    <Script id="ga-init">{`window.dataLayer=window.dataLayer||[];window.gtag=function(){dataLayer.push(arguments);};gtag("js",new Date());gtag("config","${GA_ID}");`}</Script>
  </>;
}
