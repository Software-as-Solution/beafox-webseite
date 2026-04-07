"use client";

import { useState, useMemo } from "react";
import { motion } from "framer-motion";
import { Calculator, Info } from "lucide-react";

export interface CalcField {
  id: string;
  label: string;
  placeholder?: string;
  defaultValue?: number;
  suffix?: string;
  min?: number;
  max?: number;
  step?: number;
}

export interface CalcResult {
  label: string;
  /** Compute function receives values map, returns formatted string */
  compute: (values: Record<string, number>) => string;
  highlight?: boolean;
}

interface GuideCalculatorProps {
  title?: string;
  description?: string;
  fields: CalcField[];
  results: CalcResult[];
}

export default function GuideCalculator({
  title = "Rechner",
  description,
  fields,
  results,
}: GuideCalculatorProps) {
  const [values, setValues] = useState<Record<string, number>>(() => {
    const init: Record<string, number> = {};
    for (const f of fields) {
      init[f.id] = f.defaultValue ?? 0;
    }
    return init;
  });

  const setValue = (id: string, v: number) => {
    setValues((prev) => ({ ...prev, [id]: v }));
  };

  const computedResults = useMemo(() => {
    return results.map((r) => ({
      label: r.label,
      value: r.compute(values),
      highlight: r.highlight,
    }));
  }, [values, results]);

  return (
    <div className="my-8 rounded-2xl border border-gray-200 overflow-hidden bg-white shadow-sm">
      {/* Header */}
      <div className="px-5 pt-5 pb-3">
        <h4 className="text-darkerGray font-bold text-sm flex items-center gap-2 mb-1">
          <Calculator className="w-4 h-4 text-primaryOrange" />
          {title}
        </h4>
        {description && (
          <p className="text-xs text-lightGray leading-relaxed">{description}</p>
        )}
      </div>

      {/* Input fields */}
      <div className="px-5 pb-4 space-y-3">
        {fields.map((field) => (
          <div key={field.id}>
            <label className="block text-xs text-lightGray mb-1.5 font-medium">
              {field.label}
            </label>
            <div className="relative">
              <input
                type="number"
                value={values[field.id] || ""}
                onChange={(e) => setValue(field.id, parseFloat(e.target.value) || 0)}
                placeholder={field.placeholder}
                min={field.min}
                max={field.max}
                step={field.step ?? 1}
                className="w-full px-3 py-2.5 rounded-xl bg-gray-50 border border-gray-200 text-darkerGray text-sm placeholder-gray-400 focus:border-primaryOrange focus:outline-none focus:ring-1 focus:ring-primaryOrange/30 transition-all"
              />
              {field.suffix && (
                <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-lightGray pointer-events-none">
                  {field.suffix}
                </span>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Results */}
      <div className="px-5 pb-5">
        <div className="rounded-xl border border-primaryOrange/15 bg-primaryOrange/5 p-4 space-y-2.5">
          {computedResults.map((r, i) => (
            <motion.div
              key={i}
              className="flex items-center justify-between"
              initial={false}
              animate={{ opacity: 1 }}
            >
              <span className="text-xs text-lightGray">{r.label}</span>
              <span
                className={`text-sm font-bold ${
                  r.highlight ? "text-primaryOrange" : "text-darkerGray"
                }`}
              >
                {r.value}
              </span>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}
