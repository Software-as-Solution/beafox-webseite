"use client";

import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import { X } from "lucide-react";
import { useTranslations } from "next-intl";

interface DownloadModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAppStoreClick?: (e: React.MouseEvent<HTMLAnchorElement>) => void;
}

export default function DownloadModal({
  isOpen,
  onClose,
  onAppStoreClick,
}: DownloadModalProps) {
  const t = useTranslations("downloadModal");
  const handleAppStoreClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    if (onAppStoreClick) {
      onAppStoreClick(e);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
          onClick={onClose}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            onClick={(e) => e.stopPropagation()}
            className="bg-primaryWhite rounded-2xl shadow-2xl max-w-md w-full p-6 md:p-8 relative"
          >
            {/* Close Button */}
            <button
              onClick={onClose}
              className="absolute top-4 right-4 p-2 rounded-full hover:bg-gray-100 transition-colors"
              aria-label={t("closeAria")}
            >
              <X className="w-5 h-5 text-darkerGray" />
            </button>

            {/* Title */}
            <h2 className="text-2xl md:text-3xl font-bold text-primaryOrange mb-4 text-center">
              {t("title")}
            </h2>

            {/* Info Text */}
            <p className="text-lightGray mb-6 text-center">
              {t("description")}
            </p>

            {/* App Store Buttons */}
            <div className="flex flex-col sm:flex-row gap-3">
              <a
                href="https://apps.apple.com/de/app/beafox/id6746110612"
                target="_blank"
                rel="noopener noreferrer"
                className="flex-1"
                onClick={handleAppStoreClick}
              >
                <Image
                  src="/assets/Apple.png"
                  alt="Download on the App Store"
                  width={180}
                  height={60}
                  className="object-contain w-full h-auto hover:opacity-80 transition-opacity relative bottom-[16%]"
                />
              </a>
              <a
                href="https://play.google.com/store/apps/details?id=com.tapelea.beafox&pcampaignid=web_share"
                target="_blank"
                rel="noopener noreferrer"
                className="flex-1"
                onClick={handleAppStoreClick}
              >
                <Image
                  src="/assets/Android.png"
                  alt="GET IT ON Google Play"
                  width={180}
                  height={60}
                  className="object-contain w-full h-auto hover:opacity-80 transition-opacity"
                />
              </a>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
