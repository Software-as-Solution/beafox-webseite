"use client";

// STANDARD COMPONENTS
import Image from "next/image";
// IMPORTS
import { motion, AnimatePresence } from "framer-motion";
import { useCallback, useState } from "react";
import { useTranslations, useLocale } from "next-intl";
// CUSTOM
import { useCart } from "@/components/ShopCartProvider";
import {
  getProductById,
  getVariantPrice,
  formatPrice,
} from "@/lib/shop-products";
// ICONS
import { X, Minus, Plus, ShoppingBag, Trash2, Loader2 } from "lucide-react";

// CONSTANTS
const OVERLAY_VARIANTS = {
  hidden: { opacity: 0 },
  visible: { opacity: 1 },
};
const PANEL_VARIANTS = {
  hidden: { x: "100%" },
  visible: { x: 0 },
};

export default function ShopCart() {
  // HOOKS
  const t = useTranslations("shop.cart");
  const locale = useLocale();
  const {
    items,
    itemCount,
    totalPrice,
    isOpen,
    closeCart,
    removeItem,
    updateQuantity,
    clearCart,
  } = useCart();
  // STATES
  const [isCheckingOut, setIsCheckingOut] = useState(false);

  // FUNCTIONS
  const handleCheckout = useCallback(async () => {
    setIsCheckingOut(true);
    try {
      const response = await fetch("/api/shop/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ items }),
      });
      const data = await response.json();
      if (data.url) {
        window.location.href = data.url;
      } else {
        setIsCheckingOut(false);
      }
    } catch {
      setIsCheckingOut(false);
    }
  }, [items]);

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Overlay */}
          <motion.div
            className="fixed inset-0 bg-black/40 z-[9998]"
            variants={OVERLAY_VARIANTS}
            initial="hidden"
            animate="visible"
            exit="hidden"
            onClick={closeCart}
            aria-hidden="true"
          />

          {/* Panel */}
          <motion.aside
            role="dialog"
            aria-modal="true"
            aria-label={t("title")}
            className="fixed top-0 right-0 bottom-0 w-full max-w-md bg-white shadow-2xl z-[9999] flex flex-col"
            variants={PANEL_VARIANTS}
            initial="hidden"
            animate="visible"
            exit="hidden"
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
          >
            {/* Header */}
            <div className="flex items-center justify-between px-5 py-4 border-b border-gray-200">
              <div className="flex items-center gap-2">
                <ShoppingBag
                  className="w-5 h-5 text-primaryOrange"
                  aria-hidden="true"
                />
                <h2 className="text-lg font-bold text-darkerGray">
                  {t("title")}
                </h2>
                {itemCount > 0 && (
                  <span className="text-xs bg-primaryOrange text-white rounded-full px-2 py-0.5 font-semibold">
                    {itemCount}
                  </span>
                )}
              </div>
              <button
                onClick={closeCart}
                aria-label={t("close")}
                className="p-1.5 rounded-lg hover:bg-gray-100 transition-colors"
              >
                <X className="w-5 h-5 text-darkerGray" />
              </button>
            </div>

            {/* Items */}
            <div className="flex-1 overflow-y-auto px-5 py-4">
              {items.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full text-center">
                  <ShoppingBag className="w-12 h-12 text-gray-300 mb-3" />
                  <p className="text-darkerGray/60 font-medium">
                    {t("empty")}
                  </p>
                </div>
              ) : (
                <ul className="space-y-4">
                  {items.map((item) => {
                    const product = getProductById(item.productId);
                    if (!product) return null;
                    const variant = product.variants.find(
                      (v) => v.id === item.variantId,
                    );
                    const price = getVariantPrice(product, item.variantId);
                    const variantLabel = [variant?.size, variant?.color]
                      .filter(Boolean)
                      .join(" / ");

                    return (
                      <li
                        key={`${item.productId}-${item.variantId}`}
                        className="flex gap-3 pb-4 border-b border-gray-100 last:border-0"
                      >
                        {/* Thumbnail */}
                        <div className="w-16 h-16 rounded-lg overflow-hidden bg-gray-100 flex-shrink-0">
                          <Image
                            src={product.images[0]}
                            alt={product.nameKey}
                            width={64}
                            height={64}
                            className="w-full h-full object-cover"
                          />
                        </div>
                        {/* Info */}
                        <div className="flex-1 min-w-0">
                          <div className="flex items-start justify-between gap-2">
                            <div className="min-w-0">
                              <p className="text-sm font-semibold text-darkerGray truncate">
                                {t(`products.${product.nameKey}`)}
                              </p>
                              {variantLabel && (
                                <p className="text-xs text-lightGray mt-0.5">
                                  {variantLabel}
                                </p>
                              )}
                            </div>
                            <button
                              onClick={() =>
                                removeItem(item.productId, item.variantId)
                              }
                              aria-label={t("remove")}
                              className="p-1 rounded hover:bg-red-50 text-gray-400 hover:text-red-500 transition-colors flex-shrink-0"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                          <div className="flex items-center justify-between mt-2">
                            {/* Quantity */}
                            <div className="flex items-center gap-1.5 bg-gray-100 rounded-lg px-1">
                              <button
                                onClick={() =>
                                  updateQuantity(
                                    item.productId,
                                    item.variantId,
                                    item.quantity - 1,
                                  )
                                }
                                aria-label={t("decrease")}
                                className="p-1 hover:text-primaryOrange transition-colors"
                              >
                                <Minus className="w-3 h-3" />
                              </button>
                              <span className="text-sm font-semibold w-6 text-center text-darkerGray">
                                {item.quantity}
                              </span>
                              <button
                                onClick={() =>
                                  updateQuantity(
                                    item.productId,
                                    item.variantId,
                                    item.quantity + 1,
                                  )
                                }
                                aria-label={t("increase")}
                                className="p-1 hover:text-primaryOrange transition-colors"
                              >
                                <Plus className="w-3 h-3" />
                              </button>
                            </div>
                            {/* Price */}
                            <span className="text-sm font-bold text-primaryOrange">
                              {formatPrice(price * item.quantity, locale)}
                            </span>
                          </div>
                        </div>
                      </li>
                    );
                  })}
                </ul>
              )}
            </div>

            {/* Footer */}
            {items.length > 0 && (
              <div className="border-t border-gray-200 px-5 py-4 space-y-3">
                {/* Total */}
                <div className="flex items-center justify-between">
                  <span className="text-sm text-darkerGray/70">
                    {t("subtotal")}
                  </span>
                  <span className="text-lg font-bold text-darkerGray">
                    {formatPrice(totalPrice, locale)}
                  </span>
                </div>
                <p className="text-xs text-lightGray">{t("shippingNote")}</p>
                {/* Checkout Button */}
                <button
                  onClick={handleCheckout}
                  disabled={isCheckingOut}
                  className="w-full bg-primaryOrange text-white py-3 rounded-xl font-bold text-sm hover:bg-primaryOrange/90 transition-all disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                  style={{
                    boxShadow: "0 4px 14px rgba(232,119,32,0.25)",
                  }}
                >
                  {isCheckingOut ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      {t("processing")}
                    </>
                  ) : (
                    t("checkout")
                  )}
                </button>
                {/* Clear */}
                <button
                  onClick={clearCart}
                  className="w-full text-xs text-gray-400 hover:text-gray-500 transition-colors py-1"
                >
                  {t("clear")}
                </button>
              </div>
            )}
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  );
}
