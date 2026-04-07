/**
 * Migration Script: Push calculator content from calculators.ts → Sanity CMS
 *
 * Usage:
 *   npx tsx scripts/migrate-calculators-to-sanity.ts
 *
 * This reads all calculator definitions from lib/calculators.ts and creates
 * corresponding Sanity documents of type "calculator" with the content fields.
 * Compute logic, fields, and results stay in calculators.ts.
 *
 * Safe to run multiple times — uses createOrReplace with deterministic IDs.
 */

import { createClient } from "@sanity/client";
import { CALCULATORS } from "../lib/calculators";

const client = createClient({
  projectId: "gnyg0xwn",
  dataset: "production",
  apiVersion: "2024-01-01",
  token: process.env.SANITY_API_TOKEN,
  useCdn: false,
});

async function migrate() {
  console.log(`\nMigrating ${CALCULATORS.length} calculators to Sanity...\n`);

  for (const calc of CALCULATORS) {
    const doc = {
      _id: `calculator-${calc.slug}`,
      _type: "calculator",
      slug: { _type: "slug", current: calc.slug },
      title: calc.title,
      category: calc.category,
      categoryEmoji: calc.categoryEmoji,
      metaTitle: calc.metaTitle,
      metaDescription: calc.metaDescription,
      excerpt: calc.excerpt,
      intro: calc.intro || [],
      howItWorks: (calc.howItWorks || []).map((step, idx) => ({
        _key: `step-${idx}`,
        _type: "step",
        title: step.title,
        description: step.description,
      })),
      tips: calc.tips || [],
      useCases: calc.useCases || [],
      faqs: (calc.faqs || []).map((faq, idx) => ({
        _key: `faq-${idx}`,
        _type: "faq",
        question: faq.question,
        answer: faq.answer,
      })),
    };

    try {
      const result = await client.createOrReplace(doc);
      console.log(`  ✓ ${calc.slug} → ${result._id}`);
    } catch (err: any) {
      console.error(`  ✗ ${calc.slug}: ${err.message}`);
    }
  }

  console.log("\nDone!\n");
}

migrate().catch((err) => {
  console.error("Migration failed:", err);
  process.exit(1);
});
