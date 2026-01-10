"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { CheckCircle, Download, ArrowRight } from "lucide-react";
import Button from "@/components/Button";
import client from "@/lib/api-client";

export default function CheckoutSuccessPage() {
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
      <div className="min-h-screen bg-primaryWhite flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-primaryOrange border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-lightGray">Zahlung wird überprüft...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-primaryWhite py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-2xl mx-auto">
        <div className="bg-white rounded-2xl shadow-lg p-8 md:p-12 text-center">
          {isVerified ? (
            <>
              <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <CheckCircle className="w-12 h-12 text-green-600" />
              </div>

              <h1 className="text-3xl md:text-4xl font-bold text-darkerGray mb-4">
                Zahlung erfolgreich! 🎉
              </h1>

              <p className="text-lg text-lightGray mb-8">
                Herzlichen Glückwunsch! Du hast jetzt Zugang zu BeAFox Unlimited.
                Du kannst dich jetzt in der App anmelden und alle Premium-Funktionen
                nutzen.
              </p>

              <div className="bg-primaryOrange/10 rounded-lg p-6 mb-8">
                <h2 className="font-semibold text-darkerGray mb-4">
                  Nächste Schritte:
                </h2>
                <ol className="text-left space-y-3 text-lightGray">
                  <li className="flex items-start gap-3">
                    <span className="font-bold text-primaryOrange">1.</span>
                    <span>
                      Lade die BeAFox App auf dein Smartphone herunter
                    </span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="font-bold text-primaryOrange">2.</span>
                    <span>
                      Melde dich mit deinen Login-Daten an (die du gerade erstellt hast)
                    </span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="font-bold text-primaryOrange">3.</span>
                    <span>
                      Genieße alle Premium-Funktionen von BeAFox Unlimited!
                    </span>
                  </li>
                </ol>
              </div>

              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <a
                  href="https://apps.apple.com/de/app/beafox/id6746110612"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-block"
                >
                  <img
                    src="/assets/Apple.png"
                    alt="Download on the App Store"
                    className="h-12 w-auto mx-auto hover:opacity-80 transition-opacity"
                  />
                </a>
                <a
                  href="https://play.google.com/store/apps/details?id=com.tapelea.beafox&pcampaignid=web_share"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-block"
                >
                  <img
                    src="/assets/Android.png"
                    alt="GET IT ON Google Play"
                    className="h-12 w-auto mx-auto hover:opacity-80 transition-opacity"
                  />
                </a>
              </div>

              <div className="mt-8 pt-8 border-t border-gray-200">
                <p className="text-sm text-lightGray mb-4">
                  Du kannst diese Seite jetzt schließen. Dein Account ist aktiviert
                  und du kannst dich jederzeit in der App anmelden.
                </p>
                <Link href="/">
                  <Button variant="outline" className="!px-6 !py-3">
                    Zur Startseite
                  </Button>
                </Link>
              </div>
            </>
          ) : (
            <>
              <div className="w-20 h-20 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <CheckCircle className="w-12 h-12 text-yellow-600" />
              </div>

              <h1 className="text-3xl md:text-4xl font-bold text-darkerGray mb-4">
                Zahlung wird verarbeitet
              </h1>

              <p className="text-lg text-lightGray mb-8">
                Deine Zahlung wurde erfolgreich übermittelt, aber die Aktivierung
                kann einige Minuten dauern. Du erhältst eine E-Mail, sobald dein
                Account aktiviert ist.
              </p>

              <div className="bg-primaryOrange/10 rounded-lg p-6 mb-8">
                <p className="text-sm text-lightGray">
                  Falls du Fragen hast oder Hilfe benötigst, kontaktiere uns unter{" "}
                  <a
                    href="mailto:info@beafox.app"
                    className="text-primaryOrange hover:underline"
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
            </>
          )}
        </div>
      </div>
    </div>
  );
}
