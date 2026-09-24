import React, { useState } from 'react';
import { ChevronDown, HelpCircle, Sparkles } from 'lucide-react';
import { FAQDTO } from '@tourlatam/types';

interface FAQSectionProps {
  faqs: FAQDTO[];
}

export const FAQSection: React.FC<FAQSectionProps> = ({ faqs }) => {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const toggleAccordion = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <section id="faq" className="py-24 bg-dark-900 relative overflow-hidden">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-brand-cyan/10 border border-brand-cyan/30 text-xs font-black text-brand-cyan uppercase tracking-widest mb-4">
            <Sparkles className="w-3.5 h-3.5" />
            <span>RESOLVEMOS TUS DUDAS</span>
          </div>
          <h2 className="text-3xl sm:text-5xl font-black text-white tracking-tight mb-4">
            Preguntas Frecuentes
          </h2>
          <p className="text-slate-400 text-base sm:text-lg">
            Todo lo que necesitas saber sobre inscripciones, acreditación de PDUs y modalidad virtual de TourLatam Bolivia 2026.
          </p>
        </div>

        <div className="space-y-4">
          {faqs.map((faq, index) => {
            const isOpen = openIndex === index;
            return (
              <div
                key={faq.id}
                className="glass-card rounded-2xl border border-dark-600 overflow-hidden transition-all bg-dark-800/80"
              >
                <button
                  onClick={() => toggleAccordion(index)}
                  className="w-full p-6 text-left flex items-center justify-between gap-4 focus:outline-none"
                  aria-expanded={isOpen}
                >
                  <span className="text-base sm:text-lg font-black text-white group-hover:text-brand-cyan transition-colors">
                    {faq.question}
                  </span>
                  <div className={`p-2 rounded-xl bg-dark-900 border border-dark-600 shrink-0 transition-transform duration-300 ${isOpen ? 'rotate-180 text-brand-cyan' : 'text-slate-400'}`}>
                    <ChevronDown className="w-5 h-5" />
                  </div>
                </button>

                {isOpen && (
                  <div className="px-6 pb-6 text-slate-300 text-sm sm:text-base font-light leading-relaxed border-t border-dark-600/50 pt-4 animate-fade-in">
                    {faq.answer}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
