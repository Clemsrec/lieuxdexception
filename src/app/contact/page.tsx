'use client';

import type { Metadata } from 'next';
import ContactFormSwitcher from '@/components/ContactFormSwitcher';
import { motion } from 'framer-motion';

/**
 * Page Contact avec animations Framer Motion
 * Design luxe sans icônes, avec animations légères
 */
export default function ContactPage() {
  return (
    <div className="section-container py-12">
      
      {/* Header */}
      <motion.div 
        className="text-center mb-16"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <h1 className="text-5xl font-display font-semibold mb-6">Contactez-nous</h1>
        <div className="accent-line" />
        <p className="text-xl text-secondary mt-6 max-w-3xl mx-auto leading-relaxed">
          Que ce soit pour un événement professionnel ou un mariage, 
          notre équipe vous accompagne pour créer des moments inoubliables.
        </p>
      </motion.div>

      {/* Formulaires */}
      <motion.section 
        className="mb-20"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.2 }}
      >
        <ContactFormSwitcher />
      </motion.section>

      {/* Informations de contact */}
      <section className="mb-16">
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
      </section>

    </div>
  );
}