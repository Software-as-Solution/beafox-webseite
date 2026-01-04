'use client';

import { Suspense, useEffect, useState } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { Check, Copy, Loader2 } from 'lucide-react';

export const dynamic = 'force-dynamic';

export default function ReferralPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-[70vh] flex items-center justify-center px-6">
          <div className="text-center">
            <div className="mx-auto mb-6 w-12 h-12 rounded-full border-4 border-primaryOrange/20 border-t-primaryOrange animate-spin" />
            <h1 className="text-2xl md:text-3xl font-bold text-darkerGray">
              BeAFox wird geöffnet...
            </h1>
            <p className="text-lightGray mt-2">Bitte einen Moment gedulden.</p>
          </div>
        </div>
      }
    >
      <ReferralPageInner />
    </Suspense>
  );
}

function ReferralPageInner() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const ref = searchParams.get('ref');
  const [copied, setCopied] = useState(false);
  const [redirected, setRedirected] = useState(false);

  useEffect(() => {
    if (!ref) {
      router.replace('/');
      return;
    }

    // Try to open app first (Deep Link)
    const appDeepLink = `beafox://invite?ref=${encodeURIComponent(ref)}`;
    const link = document.createElement('a');
    link.href = appDeepLink;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    // Fallback to stores after delay
    const timer = window.setTimeout(() => {
      if (redirected) return;
      setRedirected(true);

      const userAgent =
        navigator.userAgent || navigator.vendor || (window as any).opera;
      const isIOS = /iPad|iPhone|iPod/.test(userAgent) && !(window as any).MSStream;
      const isAndroid = /android/i.test(userAgent);

      if (isAndroid) {
        // Include Play Install Referrer param
        window.location.href = `https://play.google.com/store/apps/details?id=com.tapelea.beafox&referrer=ref%3D${encodeURIComponent(
          ref
        )}`;
      } else if (isIOS) {
        window.location.href = `https://apps.apple.com/app/id6746110612`;
      }
      // Desktop: stay on page to allow copy; no redirect to home
    }, 2000);

    return () => {
      window.clearTimeout(timer);
    };
  }, [ref, router, redirected]);

  const copyCode = async () => {
    if (!ref) return;
    try {
      await navigator.clipboard.writeText(ref);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2000);
    } catch {
      // Fallback for older browsers
      const textArea = document.createElement('textarea');
      textArea.value = ref;
      document.body.appendChild(textArea);
      textArea.select();
      document.execCommand('copy');
      document.body.removeChild(textArea);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2000);
    }
  };

  if (!ref) return null;

  return (
    <div className="bg-gradient-to-br from-primaryOrange/10 via-primaryWhite to-primaryOrange/5 py-12 md:py-20">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-2xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 bg-primaryOrange/10 px-4 py-2 rounded-full mb-6 border border-primaryOrange/20">
            <Loader2 className="w-4 h-4 text-primaryOrange animate-spin" />
            <span className="text-primaryOrange font-semibold text-sm">
              BeAFox wird geöffnet...
            </span>
          </div>
          <h1 className="text-3xl md:text-5xl font-bold text-darkerGray mb-3">
            Einladung erkannt
          </h1>
          <p className="text-darkerGray/80 max-w-xl mx-auto">
            Falls die App sich nicht automatisch öffnet, nutze deinen Code
            unten. Du wirst in Kürze weitergeleitet.
          </p>
        </div>

        <div className="max-w-xl mx-auto mt-10">
          <div className="bg-white/80 backdrop-blur border border-gray-200 rounded-2xl shadow-sm p-6 md:p-8">
            <p className="text-sm text-lightGray">Dein Referral-Code</p>
            <div className="mt-3 flex items-center justify-between gap-3">
              <div className="flex-1">
                <div className="w-full text-center font-mono text-3xl md:text-4xl font-bold tracking-widest text-primaryOrange select-all break-all">
                  {ref}
                </div>
              </div>
              <button
                onClick={copyCode}
                className={`inline-flex items-center gap-2 px-4 py-2 rounded-lg border transition-colors ${
                  copied
                    ? 'bg-green-50 text-green-700 border-green-200'
                    : 'bg-primaryOrange text-primaryWhite border-primaryOrange hover:bg-primaryOrange/90'
                }`}
                aria-live="polite"
              >
                {copied ? (
                  <>
                    <Check className="w-4 h-4" />
                    Kopiert
                  </>
                ) : (
                  <>
                    <Copy className="w-4 h-4" />
                    Code kopieren
                  </>
                )}
              </button>
            </div>
            <p className="mt-4 text-sm text-lightGray">
              Kopiere diesen Code. Er wird beim ersten Start automatisch erkannt
              (Android via Install Referrer, iOS via Zwischenablage).
            </p>
          </div>

          <div className="text-center text-sm text-lightGray mt-6">
            Du wirst automatisch zum passenden App Store weitergeleitet.
          </div>
        </div>
      </div>
    </div>
  );
}
 
