"use client";

import { useEffect, useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { CheckCircle, Download, ArrowRight, Loader2, Smartphone, LogIn, Sparkles, CheckCircle2 } from "lucide-react";
import Button from "@/components/Button";
import client from "@/lib/api-client";
import { useTranslations } from "next-intl";

function CheckoutSuccessContent() {
  const t = useTranslations("checkoutSuccess");
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
      <div className="min-h-screen bg-gradient-to-br from-primaryOrange/5 via-primaryWhite to-primaryOrange/5 flex items-center justify-center pt-20 sm:pt-24 px-4">
        <div className="text-center">
          <div className="w-16 h-16 sm:w-20 sm:h-20 border-4 border-primaryOrange border-t-transparent rounded-full animate-spin mx-auto mb-4 sm:mb-6"></div>
          <h2 className="text-xl sm:text-2xl font-bold text-darkerGray mb-2">{t("verifying.title")}</h2>
          <p className="text-sm sm:text-base text-lightGray">{t("verifying.subtitle")}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-primaryOrange/5 via-primaryWhite to-primaryOrange/5 px-4 sm:px-6 lg:px-8 pt-28 pb-10">
      <div className="max-w-4xl mx-auto">
        {isVerified ? (
          <>
            {/* Success Header */}
            <div className="text-center mb-6 sm:mb-8 mt-2 sm:mt-6 px-2">
              <div className="inline-flex items-center justify-center w-20 h-20 sm:w-24 sm:h-24 bg-gradient-to-br from-green-400 to-green-600 rounded-full shadow-lg mb-4 sm:mb-6 animate-bounce">
                <CheckCircle className="w-12 h-12 sm:w-14 sm:h-14 text-white" strokeWidth={2.5} />
              </div>
              <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-darkerGray mb-3 sm:mb-4 leading-tight">
                {t("success.title")}
              </h1>
              <p className="text-base sm:text-lg md:text-xl text-lightGray max-w-2xl mx-auto leading-relaxed">
                {t("success.subtitle.pre")} <br /> {t("success.subtitle.post")}{" "}
                <span className="font-semibold text-primaryOrange">BeAFox Unlimited</span>.
              </p>
            </div>

            {/* Steps Section - Highlighted */}
            <div className="bg-white rounded-2xl sm:rounded-3xl shadow-xl p-5 sm:p-8 md:p-10 mb-6 sm:mb-8 border-2 border-primaryOrange/20">
              <div className="flex items-center gap-3 mb-6 sm:mb-8">
                <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-darkerGray">
                  {t("steps.title")}
                </h2>
              </div>
              
              <div className="space-y-4 sm:space-y-6">
                {/* Step 1 */}
                <div className="flex items-start gap-3 sm:gap-6 p-4 sm:p-6 bg-gradient-to-r from-primaryOrange/10 to-primaryOrange/5 rounded-xl sm:rounded-2xl border-2 border-primaryOrange/30 hover:shadow-lg transition-all">
                  <div className="flex-shrink-0 w-12 h-12 sm:w-16 sm:h-16 bg-primaryOrange rounded-full flex items-center justify-center shadow-lg">
                    <span className="text-xl sm:text-2xl font-bold text-white">1</span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 sm:gap-3 mb-2">
                      <Smartphone className="w-5 h-5 sm:w-6 sm:h-6 text-primaryOrange flex-shrink-0" />
                      <h3 className="text-lg sm:text-xl font-bold text-darkerGray">
                        {t("steps.step1.title")}
                      </h3>
                    </div>
                    <p className="text-sm sm:text-base md:text-lg text-lightGray leading-relaxed">
                      {t("steps.step1.text")}
                    </p>
                    <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 mt-3 sm:mt-4">
                      <a
                        href="https://apps.apple.com/de/app/beafox/id6746110612"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-block transform hover:scale-105 transition-transform"
                      >
                        <img
                          src="/assets/Apple.png"
                          alt="Download on the App Store"
                          className="h-12 sm:h-14 w-auto hover:opacity-90 transition-opacity scale-150 relative bottom-[1px] left-[9.5%] sm:left-0"
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
                          className="h-12 sm:h-14 w-auto hover:opacity-90 transition-opacity scale-105"
                        />
                      </a>
                    </div>
                  </div>
                </div>

                {/* Step 2 */}
                <div className="flex items-start gap-3 sm:gap-6 p-4 sm:p-6 bg-gradient-to-r from-primaryOrange/10 to-primaryOrange/5 rounded-xl sm:rounded-2xl border-2 border-primaryOrange/30 hover:shadow-lg transition-all">
                  <div className="flex-shrink-0 w-12 h-12 sm:w-16 sm:h-16 bg-primaryOrange rounded-full flex items-center justify-center shadow-lg">
                    <span className="text-xl sm:text-2xl font-bold text-white">2</span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 sm:gap-3 mb-2">
                      <LogIn className="w-5 h-5 sm:w-6 sm:h-6 text-primaryOrange flex-shrink-0" />
                      <h3 className="text-lg sm:text-xl font-bold text-darkerGray">
                        {t("steps.step2.title")}
                      </h3>
                    </div>
                    <p className="text-sm sm:text-base md:text-lg text-lightGray leading-relaxed">
                      {t("steps.step2.text")}
                    </p>
                  </div>
                </div>

                {/* Step 3 */}
                <div className="flex items-start gap-3 sm:gap-6 p-4 sm:p-6 bg-gradient-to-r from-primaryOrange/10 to-primaryOrange/5 rounded-xl sm:rounded-2xl border-2 border-primaryOrange/30 hover:shadow-lg transition-all">
                  <div className="flex-shrink-0 w-12 h-12 sm:w-16 sm:h-16 bg-primaryOrange rounded-full flex items-center justify-center shadow-lg">
                    <span className="text-xl sm:text-2xl font-bold text-white">3</span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 sm:gap-3 mb-2">
                      <Sparkles className="w-5 h-5 sm:w-6 sm:h-6 text-primaryOrange flex-shrink-0" />
                      <h3 className="text-lg sm:text-xl font-bold text-darkerGray">
                        {t("steps.step3.title")}
                      </h3>
                    </div>
                    <p className="text-sm sm:text-base md:text-lg text-lightGray leading-relaxed">
                      {t("steps.step3.text")}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Info Box */}
            <div className="bg-white rounded-xl sm:rounded-2xl shadow-lg p-5 sm:p-6 md:p-8 border border-gray-200">
              <div className="flex items-start gap-3 sm:gap-4">
                <CheckCircle2 className="w-5 h-5 sm:w-6 sm:h-6 text-green-600 flex-shrink-0 mt-0.5 sm:mt-1" />
                <div className="min-w-0 flex-1">
                  <p className="text-sm sm:text-base text-lightGray mb-4 leading-relaxed">
                    <span className="font-semibold text-darkerGray">{t("info.activatedTitle")}</span>{" "}
                    {t("info.activatedText")}
                  </p>
                  <Link href="/account" className="block">
                    <Button variant="outline" className="!px-5 sm:!px-6 !py-2.5 sm:!py-3 text-sm sm:text-base w-full sm:w-auto">
                      {t("info.toAccount")}
                    </Button>
                  </Link>
                </div>
              </div>
            </div>
          </>
        ) : (
          <>
            <div className="bg-white rounded-2xl sm:rounded-3xl shadow-xl p-6 sm:p-8 md:p-12 text-center border-2 border-yellow-200">
              <div className="w-20 h-20 sm:w-24 sm:h-24 bg-gradient-to-br from-yellow-400 to-yellow-600 rounded-full flex items-center justify-center mx-auto mb-4 sm:mb-6 shadow-lg">
                <CheckCircle className="w-12 h-12 sm:w-14 sm:h-14 text-white" strokeWidth={2.5} />
              </div>

              <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-darkerGray mb-3 sm:mb-4 leading-tight px-2">
                {t("pending.title")}
              </h1>

              <p className="text-sm sm:text-base md:text-lg text-lightGray mb-6 sm:mb-8 max-w-2xl mx-auto leading-relaxed px-2">
                {t("pending.text")}
              </p>

              <div className="bg-yellow-50 rounded-lg sm:rounded-xl p-4 sm:p-6 mb-6 sm:mb-8 border border-yellow-200">
                <p className="text-sm sm:text-base text-lightGray leading-relaxed">
                  <span className="font-semibold text-darkerGray">{t("pending.questionsLabel")}</span>{" "}
                  {t("pending.contact")}{" "}
                  <a
                    href="mailto:info@beafox.app"
                    className="text-primaryOrange hover:underline font-medium break-all"
                  >
                    info@beafox.app
                  </a>
                </p>
              </div>

              <Link href="/account" className="block">
                <Button variant="outline" className="!px-5 sm:!px-6 !py-2.5 sm:!py-3 text-sm sm:text-base w-full sm:w-auto">
                  {t("info.toAccount")}
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
        <div className="min-h-screen bg-gradient-to-b from-gray-50 to-primaryWhite flex items-center justify-center pt-20 sm:pt-24 px-4">
          <Loader2 className="w-6 h-6 sm:w-8 sm:h-8 animate-spin text-primaryOrange" />
        </div>
      }
    >
      <CheckoutSuccessContent />
    </Suspense>
  );
}
