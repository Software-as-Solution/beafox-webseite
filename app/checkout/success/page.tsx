"use client";

import { useEffect, useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { CheckCircle, Download, ArrowRight, Loader2, Smartphone, LogIn, Sparkles, CheckCircle2 } from "lucide-react";
import Button from "@/components/Button";
import client from "@/lib/api-client";

function CheckoutSuccessContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isVerifying, setIsVerifying] = useState(true);
  const [isVerified, setIsVerified] = useState(false);

  useEffect(() => {
    const verifyPayment = async () => {
      try {
        // Check if user is logged in
        const token = localStorage.getItem("auth_token");
        if (!token) {
          router.push("/registrierung");
          return;
        }

        // Verify subscription status - use correct endpoint
        const response = await client.get("/stripe/subscription/status");
        
        if (response.data.subscription?.isActive) {
          setIsVerified(true);
          setIsVerifying(false);
        } else {
          // Payment might still be processing (webhook might need a moment)
          // Retry a few times with increasing delays
          let retryCount = 0;
          const maxRetries = 5;
          
          const retryCheck = async () => {
            try {
              const retryResponse = await client.get("/stripe/subscription/status");
              if (retryResponse.data.subscription?.isActive) {
                setIsVerified(true);
                setIsVerifying(false);
              } else if (retryCount < maxRetries) {
                retryCount++;
                setTimeout(retryCheck, 2000 * retryCount); // Increasing delay: 2s, 4s, 6s, 8s, 10s
              } else {
                // After max retries, show pending state
                setIsVerified(false);
                setIsVerifying(false);
              }
            } catch (err) {
              console.error("Error retrying payment verification:", err);
              if (retryCount < maxRetries) {
                retryCount++;
                setTimeout(retryCheck, 2000 * retryCount);
              } else {
                setIsVerified(false);
                setIsVerifying(false);
              }
            }
          };
          
          // Start retry after initial delay
          setTimeout(retryCheck, 2000);
        }
      } catch (error: any) {
        console.error("Error verifying payment:", error);
        // If it's a 404 or other error, payment might still be processing
        // Show pending state instead of error - webhook will update user later
        setIsVerified(false);
        setIsVerifying(false);
      }
    };

    verifyPayment();
  }, [router]);

  if (isVerifying) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-primaryOrange/5 via-primaryWhite to-primaryOrange/5 flex items-center justify-center pt-24">
        <div className="text-center">
          <div className="w-20 h-20 border-4 border-primaryOrange border-t-transparent rounded-full animate-spin mx-auto mb-6"></div>
          <h2 className="text-2xl font-bold text-darkerGray mb-2">Zahlung wird überprüft...</h2>
          <p className="text-lightGray">Bitte warte einen Moment</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-primaryOrange/5 via-primaryWhite to-primaryOrange/5 py-12 px-4 sm:px-6 lg:px-8 pt-24">
      <div className="max-w-4xl mx-auto">
        {isVerified ? (
          <>
            {/* Success Header */}
            <div className="text-center mb-8 mt-6">
              <div className="inline-flex items-center justify-center w-24 h-24 bg-gradient-to-br from-green-400 to-green-600 rounded-full shadow-lg mb-6 animate-bounce">
                <CheckCircle className="w-14 h-14 text-white" strokeWidth={2.5} />
              </div>
              <h1 className="text-4xl md:text-5xl font-bold text-darkerGray mb-4">
                Zahlung erfolgreich! 🎉
              </h1>
              <p className="text-xl text-lightGray max-w-2xl mx-auto">
                Herzlichen Glückwunsch! <br /> Du hast jetzt Zugang zu <span className="font-semibold text-primaryOrange">BeAFox Unlimited</span>.
              </p>
            </div>

            {/* Steps Section - Highlighted */}
            <div className="bg-white rounded-3xl shadow-xl p-8 md:p-10 mb-8 border-2 border-primaryOrange/20">
              <div className="flex items-center gap-3 mb-8">
                <h2 className="text-2xl md:text-3xl font-bold text-darkerGray">
                  So geht's weiter:
                </h2>
              </div>
              
              <div className="space-y-6">
                {/* Step 1 */}
                <div className="flex items-start gap-6 p-6 bg-gradient-to-r from-primaryOrange/10 to-primaryOrange/5 rounded-2xl border-2 border-primaryOrange/30 hover:shadow-lg transition-all">
                  <div className="flex-shrink-0 w-16 h-16 bg-primaryOrange rounded-full flex items-center justify-center shadow-lg">
                    <span className="text-2xl font-bold text-white">1</span>
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <Smartphone className="w-6 h-6 text-primaryOrange" />
                      <h3 className="text-xl font-bold text-darkerGray">
                        App herunterladen
                      </h3>
                    </div>
                    <p className="text-lightGray text-lg">
                      Lade die BeAFox App auf dein Smartphone herunter.
                    </p>
                    <div className="flex flex-col sm:flex-row gap-4 mt-4">
                      <a
                        href="https://apps.apple.com/de/app/beafox/id6746110612"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-block transform hover:scale-105 transition-transform"
                      >
                        <img
                          src="/assets/Apple.png"
                          alt="Download on the App Store"
                          className="h-14 w-auto hover:opacity-90 transition-opacity scale-150 relative bottom-[1px]"
                        />
                      </a>
                      <a
                        href="https://play.google.com/store/apps/details?id=com.tapelea.beafox&pcampaignid=web_share"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-block transform hover:scale-105 transition-transform"
                      >
                        <img
                          src="/assets/Android.png"
                          alt="GET IT ON Google Play"
                          className="h-14 w-auto hover:opacity-90 transition-opacity scale-105"
                        />
                      </a>
                    </div>
                  </div>
                </div>

                {/* Step 2 */}
                <div className="flex items-start gap-6 p-6 bg-gradient-to-r from-primaryOrange/10 to-primaryOrange/5 rounded-2xl border-2 border-primaryOrange/30 hover:shadow-lg transition-all">
                  <div className="flex-shrink-0 w-16 h-16 bg-primaryOrange rounded-full flex items-center justify-center shadow-lg">
                    <span className="text-2xl font-bold text-white">2</span>
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <LogIn className="w-6 h-6 text-primaryOrange" />
                      <h3 className="text-xl font-bold text-darkerGray">
                        Anmelden
                      </h3>
                    </div>
                    <p className="text-lightGray text-lg">
                      Melde dich mit deinen Login-Daten an, die du gerade erstellt hast.
                    </p>
                  </div>
                </div>

                {/* Step 3 */}
                <div className="flex items-start gap-6 p-6 bg-gradient-to-r from-primaryOrange/10 to-primaryOrange/5 rounded-2xl border-2 border-primaryOrange/30 hover:shadow-lg transition-all">
                  <div className="flex-shrink-0 w-16 h-16 bg-primaryOrange rounded-full flex items-center justify-center shadow-lg">
                    <span className="text-2xl font-bold text-white">3</span>
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <Sparkles className="w-6 h-6 text-primaryOrange" />
                      <h3 className="text-xl font-bold text-darkerGray">
                        Premium genießen
                      </h3>
                    </div>
                    <p className="text-lightGray text-lg">
                      Genieße alle Premium-Funktionen von BeAFox Unlimited!
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Info Box */}
            <div className="bg-white rounded-2xl shadow-lg p-6 md:p-8 border border-gray-200">
              <div className="flex items-start gap-4">
                <CheckCircle2 className="w-6 h-6 text-green-600 flex-shrink-0 mt-1" />
                <div>
                  <p className="text-lightGray mb-4">
                    <span className="font-semibold text-darkerGray">Dein Account ist aktiviert!</span> Du kannst diese Seite jetzt schließen und dich jederzeit in der App anmelden.
                  </p>
                  <Link href="/">
                    <Button variant="outline" className="!px-6 !py-3">
                      Zur Startseite
                    </Button>
                  </Link>
                </div>
              </div>
            </div>
          </>
        ) : (
          <>
            <div className="bg-white rounded-3xl shadow-xl p-8 md:p-12 text-center border-2 border-yellow-200">
              <div className="w-24 h-24 bg-gradient-to-br from-yellow-400 to-yellow-600 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg">
                <CheckCircle className="w-14 h-14 text-white" strokeWidth={2.5} />
              </div>

              <h1 className="text-3xl md:text-4xl font-bold text-darkerGray mb-4">
                Zahlung wird verarbeitet
              </h1>

              <p className="text-lg text-lightGray mb-8 max-w-2xl mx-auto">
                Deine Zahlung wurde erfolgreich übermittelt. Die Aktivierung kann einige Minuten dauern. Du erhältst eine E-Mail, sobald dein Account aktiviert ist.
              </p>

              <div className="bg-yellow-50 rounded-xl p-6 mb-8 border border-yellow-200">
                <p className="text-lightGray">
                  <span className="font-semibold text-darkerGray">Fragen?</span> Kontaktiere uns unter{" "}
                  <a
                    href="mailto:info@beafox.app"
                    className="text-primaryOrange hover:underline font-medium"
                  >
                    info@beafox.app
                  </a>
                </p>
              </div>

              <Link href="/">
                <Button variant="outline" className="!px-6 !py-3">
                  Zur Startseite
                </Button>
              </Link>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

export default function CheckoutSuccessPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-gradient-to-b from-gray-50 to-primaryWhite flex items-center justify-center pt-24">
          <Loader2 className="w-8 h-8 animate-spin text-primaryOrange" />
        </div>
      }
    >
      <CheckoutSuccessContent />
    </Suspense>
  );
}
