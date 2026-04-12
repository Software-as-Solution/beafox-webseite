"use client";

import { useEffect, useCallback } from "react";
import { usePathname } from "next/navigation";

// Leadfeeder / Dealfront tracker — same snippet as provided by the vendor
const LF_INIT_SCRIPT = `(function(ss,ex){ window.ldfdr=window.ldfdr||function(){(ldfdr._q=ldfdr._q||[]).push([].slice.call(arguments));}; (function(d,s){ fs=d.getElementsByTagName(s)[0]; function ce(src){ var cs=d.createElement(s); cs.src=src; cs.async=1; fs.parentNode.insertBefore(cs,fs); }; ce('https://sc.lfeeder.com/lftracker_v1_'+ss+(ex?'_'+ex:'')+'.js'); })(document,'script'); })('ywVkO4XJ9KW8Z6Bj');`;

function injectLeadfeeder(): void {
  try {
    const consent = JSON.parse(
      localStorage.getItem("cookieConsent") || "{}",
    );
    if (!consent?.preferences?.analytics) return;
  } catch {
    return;
  }

  if (document.getElementById("beafox-leadfeeder-init")) return;

  const script = document.createElement("script");
  script.id = "beafox-leadfeeder-init";
  script.text = LF_INIT_SCRIPT;
  document.head.appendChild(script);
}

export default function LeadfeederAnalytics() {
  const pathname = usePathname();
  const load = useCallback(() => {
    injectLeadfeeder();
  }, []);

  useEffect(() => {
    load();
  }, [load, pathname]);

  return null;
}
