"use client";

import { useState } from "react";
import JsonLd from "./JsonLd";
import { generateFAQSchema, FAQItem } from "@/libs/seo/schema";

/**
 * FAQ Section Component with Schema.org markup
 * Accordion-style FAQ that adds structured data for Google rich results
 * 
 * Usage:
 * <FAQSection
 *   faqs={[
 *     { question: "What is this?", answer: "This is an answer." },
 *     { question: "How does it work?", answer: "It works like this." },
 *   ]}
 *   title="Frequently Asked Questions"
 * />
 */

interface FAQSectionProps {
  faqs: FAQItem[];
  title?: string;
  className?: string;
}

export default function FAQSection({
  faqs,
  title = "Frequently Asked Questions",
  className = "",
}: FAQSectionProps) {
  const [openIndex, setOpenIndex] = useState<number | null>(null);
  const schema = generateFAQSchema(faqs);

  return (
    <section className={className}>
      <JsonLd data={schema} />
      
      <h2 className="text-2xl font-bold mb-6">{title}</h2>
      
      <div className="space-y-4">
        {faqs.map((faq, index) => (
          <div
            key={index}
            className="border border-base-200 rounded-lg overflow-hidden"
          >
            <button
              className="w-full px-6 py-4 text-left font-medium flex justify-between items-center hover:bg-base-100 transition-colors"
              onClick={() => setOpenIndex(openIndex === index ? null : index)}
              aria-expanded={openIndex === index}
            >
              <span>{faq.question}</span>
              <span className="text-xl ml-4 shrink-0">
                {openIndex === index ? "−" : "+"}
              </span>
            </button>
            
            {openIndex === index && (
              <div className="px-6 pb-4 text-base-content/70">
                {faq.answer}
              </div>
            )}
          </div>
        ))}
      </div>
    </section>
  );
}
