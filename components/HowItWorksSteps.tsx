"use client";

import { motion } from "framer-motion";
import {
  Smartphone,
  MessageCircle,
  TrendingUp,
  ArrowRight,
  ChevronRight,
} from "lucide-react";
import Button from "@/components/Button";

interface HowItWorksStepsProps {
  onDownloadClick?: () => void;
}

const steps = [
  {
    num: "1",
    icon: Smartphone,
    title: "App laden",
    desc: "Kostenlos in 30 Sekunden. Verfügbar für iOS und Android.",
    highlight: "30 Sek.",
  },
  {
    num: "2",
    icon: MessageCircle,
    title: "Bea kennenlernen",
    desc: "Bea fragt nach deiner Situation und erstellt deinen persönlichen Finanzplan.",
    highlight: "Personalisiert",
  },
  {
    num: "3",
    icon: TrendingUp,
    title: "Handeln",
    desc: "Schritt für Schritt durch echte Finanzsituationen — und dabei smarter werden.",
    highlight: "Echte Schritte",
  },
];

export default function HowItWorksSteps({
  onDownloadClick,
}: HowItWorksStepsProps) {
  return (
    <div className="max-w-4xl mx-auto">
      {/* Steps row */}
      <div className="flex flex-col md:flex-row items-stretch gap-4 md:gap-0">
        {steps.map((step, idx) => (
          <div key={step.num} className="flex items-stretch flex-1">
            {/* Step card */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: idx * 0.15 }}
              className="flex-1 relative rounded-2xl p-5 md:p-6 text-center"
              style={{
                background:
                  "linear-gradient(180deg, rgba(232,119,32,0.06) 0%, rgba(255,255,255,1) 100%)",
                border: "1px solid rgba(232,119,32,0.15)",
              }}
            >
              {/* Number badge */}
              <div className="flex justify-center mb-4">
                <div className="relative">
                  <div
                    className="w-14 h-14 md:w-16 md:h-16 rounded-2xl flex items-center justify-center"
                    style={{
                      background: "rgba(232,119,32,0.1)",
                      border: "1.5px solid rgba(232,119,32,0.2)",
                    }}
                  >
                    <step.icon className="w-6 h-6 md:w-7 md:h-7 text-primaryOrange" />
                  </div>
                  <div
                    className="absolute -top-2 -right-2 w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold text-white"
                    style={{
                      backgroundColor: "#E87720",
                      boxShadow: "0 3px 8px rgba(232,119,32,0.35)",
                    }}
                  >
                    {step.num}
                  </div>
                </div>
              </div>

              {/* Highlight pill */}
              <div
                className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider mb-2"
                style={{
                  background: "rgba(232,119,32,0.1)",
                  color: "#E87720",
                }}
              >
                {step.highlight}
              </div>

              <h3 className="text-base md:text-lg font-bold text-darkerGray mb-1.5">
                {step.title}
              </h3>
              <p className="text-xs md:text-sm text-lightGray leading-relaxed">
                {step.desc}
              </p>
            </motion.div>

            {/* Arrow connector (between cards, desktop only) */}
            {idx < steps.length - 1 && (
              <div className="hidden md:flex items-center justify-center w-10 flex-shrink-0">
                <motion.div
                  initial={{ opacity: 0, x: -4 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.3, delay: 0.3 + idx * 0.15 }}
                >
                  <ChevronRight className="w-5 h-5 text-primaryOrange/40" />
                </motion.div>
              </div>
            )}

            {/* Arrow connector (between cards, mobile — vertical) */}
            {idx < steps.length - 1 && (
              <div className="flex md:hidden items-center justify-center h-4 my-0">
                <motion.div
                  initial={{ opacity: 0, y: -4 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.3, delay: 0.3 + idx * 0.15 }}
                  className="rotate-90"
                >
                  <ChevronRight className="w-4 h-4 text-primaryOrange/40" />
                </motion.div>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* CTA below steps */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.4, delay: 0.5 }}
        className="text-center mt-8"
      >
        <Button
          onClick={onDownloadClick}
          variant="primary"
          className="flex items-center justify-center gap-2 mx-auto !px-6 !py-2.5 md:!px-8 md:!py-3 text-sm md:text-base"
        >
          Jetzt kostenlos starten
          <ArrowRight className="w-4 h-4" />
        </Button>
        <p className="text-[11px] text-lightGray mt-2">
          Kein Abo nötig · Kostenlos · iOS & Android
        </p>
      </motion.div>
    </div>
  );
}
