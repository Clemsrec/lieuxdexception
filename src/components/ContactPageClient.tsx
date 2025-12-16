'use client';

import { useEffect, useState, useRef, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import ContactFormSwitcher from '@/components/ContactFormSwitcher';
import { motion } from 'framer-motion';

/**
 * Composant client pour la page Contact avec gestion du scroll et des search params
 */
function ContactFormWrapper() {
  const formRef = useRef<HTMLDivElement>(null);
  const searchParams = useSearchParams();

  useEffect(() => {
    // Scroll automatique vers le formulaire après un court délai
    const timer = setTimeout(() => {
      if (formRef.current) {
        formRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }, 500);

    return () => clearTimeout(timer);
  }, []);

  return (
    <div ref={formRef}>
      <ContactFormSwitcher defaultForm="b2b" />
    </div>
  );
}

/**
 * Composant principal avec Suspense boundary
 */
export default function ContactPageClient() {
  const [structuredData, setStructuredData] = useState<any>(null);
  const [faqSchema, setFaqSchema] = useState<any>(null);

  useEffect(() => {
    // Import dynamique pour éviter les problèmes SSR
    import('@/lib/universalStructuredData').then(({ generateUniversalStructuredData, generateFAQSchema }) => {
      const contactSchema = generateUniversalStructuredData({
        siteType: 'corporate',
        pageType: 'contact',
        url: 'https://lieuxdexception.fr/contact'
      });
      setStructuredData(contactSchema);

      const faq = generateFAQSchema('contact');
      setFaqSchema(faq);
    });
  }, []);

  return (
    <>
      {/* Structured Data */}
      {structuredData && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
        />
      )}
      {faqSchema && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
        />
      )}

      {/* Section Coordonnées */}
      <section className="section bg-white">
        <div className="container">
          <div className="text-center mb-12">
            <h2 className="text-2xl md:text-3xl font-semibold mb-4 text-accent">
              Nos Coordonnées
            </h2>
            <div className="accent-line" />
          </div>

          <div className="grid md:grid-cols-2 gap-6 md:gap-8">
            {/* Contact Pro */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="bg-charcoal-800 rounded-xl p-6 md:p-8 border border-accent/20 shadow-lg"
            >
              <h3 className="text-xl md:text-2xl font-semibold mb-6 !text-[#C9A961]">
                Événements Professionnels
              </h3>
              <div className="space-y-4">
                <div>
                  <p className="text-sm text-neutral-200 mb-1">Téléphone</p>
                  <a href="tel:+33670562879" className="text-lg text-white hover:text-accent transition-colors">
                    06 70 56 28 79
                  </a>
                </div>
                <div>
                  <p className="text-sm text-neutral-200 mb-1">Email</p>
                  <a href="mailto:contact@lieuxdexception.fr" className="text-white hover:text-accent transition-colors">
                    contact@lieuxdexception.fr
                  </a>
                </div>
              </div>
            </motion.div>

            {/* Contact Mariages */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="bg-charcoal-800 rounded-xl p-6 md:p-8 border border-accent/20 shadow-lg"
            >
              <h3 className="text-xl md:text-2xl font-semibold mb-6 !text-[#C9A961]">
                Mariages & Événements Privés
              </h3>
              <div className="space-y-4">
                <div>
                  <p className="text-sm text-neutral-200 mb-1">Téléphone</p>
                  <a href="tel:+33602037011" className="text-lg text-white hover:text-accent transition-colors">
                    06 02 03 70 11
                  </a>
                </div>
                <div>
                  <p className="text-sm text-neutral-200 mb-1">Email</p>
                  <a href="mailto:contact@lieuxdexception.fr" className="text-white hover:text-accent transition-colors">
                    contact@lieuxdexception.fr
                  </a>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Section Formulaire */}
      <section className="section bg-stone/30">
        <div className="container">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="text-center mb-12"
          >
            <h2 className="text-2xl md:text-3xl font-semibold mb-4 text-accent">
              Votre Demande
            </h2>
            <div className="accent-line" />
            <p className="text-lg text-secondary mt-6 mx-auto">
              Remplissez le formulaire ci-dessous, nous vous répondrons dans les plus brefs délais.
            </p>
          </motion.div>

          <Suspense fallback={<div className="text-center py-12">Chargement...</div>}>
            <ContactFormWrapper />
          </Suspense>
        </div>
      </section>
    </>
  );
}
