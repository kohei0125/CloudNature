"use client";

import Script from "next/script";
import { IS_PRODUCTION } from "@/lib/site";

const CLARITY_ID = process.env.NEXT_PUBLIC_CLARITY_ID;

export default function ClarityAnalytics() {
  if (!CLARITY_ID || !IS_PRODUCTION) return null;

  return (
    <Script id="clarity-init" strategy="afterInteractive">
      {`
        (function(c,l,a,r,i,t,y){
            c[a]=c[a]||function(){(c[a].q=c[a].q||[]).push(arguments)};
            t=l.createElement(r);t.async=1;t.src="https://www.clarity.ms/tag/"+i;
            y=l.getElementsByTagName(r)[0];y.parentNode.insertBefore(t,y);
        })(window, document, "clarity", "script", "${CLARITY_ID}");
      `}
    </Script>
  );
}
