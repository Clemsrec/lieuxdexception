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
      <section className="section">
        <div className="container">
          <div className="grid md:grid-cols-2 gap-8">
            {/* Contact Pro */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="bg-white p-8 rounded-lg shadow-sm border border-stone"
            >
              <h2 className="font-display text-2xl text-primary mb-6">
                Événements Professionnels
              </h2>
              <div className="space-y-4">
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Téléphone</p>
                  <a href="tel:+33670562879" className="text-lg text-primary hover:text-accent transition-colors">
                    06 70 56 28 79
                  </a>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Email</p>
                  <a href="mailto:pro@lieuxdexception.fr" className="text-primary hover:text-accent transition-colors">
                    pro@lieuxdexception.fr
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
              className="bg-white p-8 rounded-lg shadow-sm border border-stone"
            >
              <h2 className="font-display text-2xl text-primary mb-6">
                Mariages & Événements Privés
              </h2>
              <div className="space-y-4">
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Téléphone</p>
                  <a href="tel:+33602037011" className="text-lg text-primary hover:text-accent transition-colors">
                    06 02 03 70 11
                  </a>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Email</p>
                  <a href="mailto:mariages@lieuxdexception.fr" className="text-primary hover:text-accent transition-colors">
                    mariages@lieuxdexception.fr
                  </a>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Section Formulaire */}
      <section className="section bg-alt">
        <div className="container">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="text-center mb-12"
          >
            <h2 className="font-display text-4xl md:text-5xl text-primary mb-6">
              Votre Demande
            </h2>
            <p className="text-lg text-muted-foreground mx-auto">
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
