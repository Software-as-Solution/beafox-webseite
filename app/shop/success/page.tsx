"use client";

// STANDARD COMPONENTS
import Link from "next/link";
// CUSTOM COMPONENTS
import Section from "@/components/Section";
// IMPORTS
import { useEffect } from "react";
import { motion } from "framer-motion";
import { useTranslations } from "next-intl";
import { useSearchParams } from "next/navigation";
// ICONS
import { CheckCircle, ShoppingBag, ArrowRight, Package } from "lucide-react";

export default function ShopSuccessPage() {
  // HOOKS
  const t = useTranslations("shop.success");
  const searchParams = useSearchParams();
  const sessionId = searchParams.get("session_id");

  // Clear cart on mount (order was successful)
  useEffect(() => {
    try {
      localStorage.removeItem("beafox_shop_cart");
    } catch {
      // ignore
    }
  }, []);

  return (
    <Section className="py-16 md:py-24 bg-primaryWhite">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="max-w-lg mx-auto text-center"
        >
          {/* Success Icon */}
          <div className="mb-6">
            <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto">
              <CheckCircle className="w-10 h-10 text-green-500" />
            </div>
          </div>

          <h1 className="text-3xl md:text-4xl font-bold text-darkerGray mb-3">
            {t("title")}
          </h1>
          <p className="text-darkerGray/70 text-lg mb-8">{t("subtitle")}</p>

          {/* Info Cards */}
          <div className="space-y-4 mb-8 text-left">
            <div className="bg-gray-50 rounded-xl p-4 flex items-start gap-3">
              <Package
                className="w-5 h-5 text-primaryOrange mt-0.5 flex-shrink-0"
                aria-hidden="true"
              />
              <div>
                <p className="text-sm font-semibold text-darkerGray">
                  {t("shipping.title")}
                </p>
                <p className="text-xs text-darkerGray/60 mt-0.5">
                  {t("shipping.description")}
                </p>
              </div>
            </div>
            <div className="bg-gray-50 rounded-xl p-4 flex items-start gap-3">
              <ShoppingBag
                className="w-5 h-5 text-primaryOrange mt-0.5 flex-shrink-0"
                aria-hidden="true"
              />
              <div>
                <p className="text-sm font-semibold text-darkerGray">
                  {t("confirmation.title")}
                </p>
                <p className="text-xs text-darkerGray/60 mt-0.5">
                  {t("confirmation.description")}
                </p>
              </div>
            </div>
          </div>

          {sessionId && (
            <p className="text-xs text-gray-400 mb-6">
              {t("reference")}: {sessionId.slice(0, 20)}...
            </p>
          )}

          {/* CTAs */}
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link
              href="/shop"
              className="inline-flex items-center justify-center gap-2 bg-primaryOrange text-white px-6 py-3 rounded-xl font-semibold hover:bg-primaryOrange/90 transition-all shadow-lg"
            >
              {t("continueShopping")}
              <ArrowRight className="w-4 h-4" aria-hidden="true" />
            </Link>
            <Link
              href="/"
              className="inline-flex items-center justify-center gap-2 bg-gray-100 text-darkerGray px-6 py-3 rounded-xl font-semibold hover:bg-gray-200 transition-all"
            >
              {t("backToHome")}
            </Link>
          </div>
        </motion.div>
      </div>
    </Section>
  );
}
