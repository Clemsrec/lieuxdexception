'use client';

import { useEffect, useState, useRef, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import ContactFormSwitcher from '@/components/ContactFormSwitcher';
import { m } from 'framer-motion';

interface ContactInfo {
  type: 'b2b' | 'wedding';
  phone: string;
  email: string;
  description: string;
}

/**
 * Composant client pour la page Contact avec gestion du scroll et des search params
 */
function ContactFormWrapper() {
 const formRef = useRef<HTMLDivElement>(null);
 const searchParams = useSearchParams();
 const formParam = searchParams.get('form');
 const initialForm = (formParam === 'b2b' || formParam === 'prive') ? formParam : null;

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
   <ContactFormSwitcher defaultForm="b2b" initialForm={initialForm} />
  </div>
 );
}

/**
 * Composant principal avec Suspense boundary et contenu dynamique
 */
export default function ContactPageClient({ contactInfo }: { contactInfo: ContactInfo[] }) {
 const [structuredData, setStructuredData] = useState<any>(null);
 const [faqSchema, setFaqSchema] = useState<any>(null);

 useEffect(() => {
  // Import dynamique pour éviter les problèmes SSR
  import('@/lib/universalStructuredData').then(({ generateUniversalStructuredData, generateFAQSchema }) => {
   const contactSchema = generateUniversalStructuredData({
    siteType: 'corporate',
    pageType: 'contact',
    url: 'https://lieuxdexception.com/contact'
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

   {/* Section Coordonnées - Contenu Dynamique */}
   {contactInfo && contactInfo.length > 0 && (
    <section className="section bg-white">
     <div className="container">
      <div className="text-center mb-12">
       <h2 className="text-2xl md:text-3xl font-semibold mb-4 text-accent">
        Nos Coordonnées
       </h2>
       <div className="accent-line" />
      </div>

      <div className="grid md:grid-cols-2 gap-6 md:gap-8">
       {contactInfo.map((info, index) => {
        const phoneLink = `tel:+33${info.phone.replace(/\s/g, '').replace(/^0/, '')}`;
        
        return (
         <m.div
          key={info.type}
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: index * 0.2 }}
          className="bg-charcoal-800 p-6 md:p-8 border border-accent/20 shadow-lg"
         >
          <h3 className="text-xl md:text-2xl font-semibold mb-6 text-[#C9A961]!">
           {info.description}
          </h3>
          <div className="space-y-4">
           <div>
            <p className="text-sm text-neutral-200 mb-1">Téléphone</p>
            <a href={phoneLink} className="text-lg text-white hover:text-accent transition-colors">
             {info.phone}
            </a>
           </div>
           <div>
            <p className="text-sm text-neutral-200 mb-1">Email</p>
            <a href={`mailto:${info.email}`} className="text-white hover:text-accent transition-colors">
             {info.email}
            </a>
           </div>
          </div>
         </m.div>
        );
       })}
      </div>
     </div>
    </section>
   )}

   {/* Section Formulaire */}
   <section className="section bg-stone/30">
    <div className="container">
     <m.div
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
     </m.div>

     <Suspense fallback={<div className="text-center py-12">Chargement...</div>}>
      <ContactFormWrapper />
     </Suspense>
    </div>
   </section>
  </>
 );
}
