'use client';

import ContactFormSwitcher from '@/components/ContactFormSwitcher';
import Image from 'next/image';
import { motion } from 'framer-motion';
import HeroSection from '@/components/HeroSection';
import { generateContactMetadata } from '@/lib/smartMetadata';
import { generateUniversalStructuredData, generateFAQSchema } from '@/lib/universalStructuredData';
import { useEffect, useState } from 'react';

/**
 * Page Contact avec animations Framer Motion + SEO optimisé
 */
export default function ContactPage() {
  const [structuredData, setStructuredData] = useState<any>(null);
  const [faqSchema, setFaqSchema] = useState<any>(null);

  useEffect(() => {
    // Générer structured data côté client
    const contactSchema = generateUniversalStructuredData({
      siteType: 'corporate',
      pageType: 'contact',
      url: 'https://lieuxdexception.fr/contact'
    });
    setStructuredData(contactSchema);

    const faq = generateFAQSchema('contact');
    setFaqSchema(faq);
  }, []);

  return (
    <main className="min-h-screen">
      
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
      
      {/* Hero Section */}
      <HeroSection
        title="Contactez-nous"
        subtitle="Prêt à créer des moments inoubliables ?"
        description="Que ce soit pour un événement professionnel ou un mariage, notre équipe vous accompagne pour créer des moments inoubliables."
        backgroundImage="/venues/chateau-de-la-corbe/photo-2025-11-18-12-05-43-2-07.webp"
      />

      {/* Formulaires */}
      <section className="section">
        <motion.div 
          className="mt-12"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <ContactFormSwitcher />
        </motion.div>
      </section>

      {/* Informations de contact */}
      <section className="section section-alt">
        <div className="section-container">
        <motion.h2 
          className="text-3xl font-display font-semibold text-center mb-12"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.4 }}
        >
          Nos coordonnées
        </motion.h2>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Téléphone */}
          <motion.div 
            className="venue-card text-center"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.5 }}
            whileHover={{ y: -5, transition: { duration: 0.2 } }}
          >
            <div className="font-display text-5xl text-primary/20 font-light mb-4">01</div>
            <h3 className="text-xl font-semibold mb-4">Appelez-nous</h3>
            <div className="w-16 h-px bg-accent/40 mx-auto mb-6" />
            <div className="space-y-3">
              <a 
                href="tel:+33602037011"
                className="block text-2xl text-primary hover:text-accent font-medium transition-colors"
              >
                06 02 03 70 11
              </a>
              <p className="text-sm text-secondary uppercase tracking-wider">
                Lundi - Vendredi
              </p>
              <p className="text-sm text-secondary">
                9h - 18h
              </p>
            </div>
          </motion.div>

          {/* Email */}
          <motion.div 
            className="venue-card text-center"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.6 }}
            whileHover={{ y: -5, transition: { duration: 0.2 } }}
          >
            <div className="font-display text-5xl text-accent/20 font-light mb-4">02</div>
            <h3 className="text-xl font-semibold mb-4">Écrivez-nous</h3>
            <div className="w-16 h-px bg-accent/40 mx-auto mb-6" />
            <div className="space-y-3">
              <a 
                href="mailto:contact@lieuxdexception.com"
                className="block text-lg text-primary hover:text-accent font-medium transition-colors break-all"
              >
                contact@lieuxdexception.com
              </a>
              <p className="text-sm text-secondary uppercase tracking-wider">
                Réponse rapide
              </p>
              <p className="text-sm text-secondary">
                Sous 2h en journée
              </p>
            </div>
          </motion.div>

          {/* Localisation */}
          <motion.div 
            className="venue-card text-center"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.7 }}
            whileHover={{ y: -5, transition: { duration: 0.2 } }}
          >
            <div className="font-display text-5xl text-secondary/20 font-light mb-4">03</div>
            <h3 className="text-xl font-semibold mb-4">Nous rencontrer</h3>
            <div className="w-16 h-px bg-accent/40 mx-auto mb-6" />
            <div className="space-y-3">
              <p className="text-lg font-medium text-primary">Lieux d&apos;Exception</p>
              <p className="text-sm text-secondary uppercase tracking-wider">
                Loire-Atlantique
              </p>
              <p className="text-sm text-secondary">
                Pays de la Loire<br />
                France
              </p>
            </div>
          </motion.div>
        </div>
        </div>
      </section>

    </main>
  );
}