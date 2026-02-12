'use client';

import { useEffect, useState, useRef, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import ContactFormSwitcher from '@/components/ContactFormSwitcher';

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
 
 // Déterminer le formulaire initial et par défaut basé sur l'URL
 const initialForm = (formParam === 'b2b') ? 'b2b' : 
                    (formParam === 'prive' || formParam === 'mariage') ? 'prive' : null;
 
 // Si on a un paramètre d'URL, l'utiliser comme defaultForm aussi
 const defaultForm = initialForm || 'b2b';

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
   <ContactFormSwitcher defaultForm={defaultForm} initialForm={initialForm} />
  </div>
 );
}

/**
 * Composant principal avec contenu dynamique - VERSION CORRIGÉE
 */
export default function ContactPageClient({ contactInfo }: { contactInfo: ContactInfo[] }) {
 const [structuredData, setStructuredData] = useState<any>(null);
 const [faqSchema, setFaqSchema] = useState<any>(null);

 // Log pour diagnostiquer
 console.log('🔍 [ContactPageClient] Reçu contactInfo:', contactInfo);
 console.log('🔍 [ContactPageClient] Type:', typeof contactInfo, 'Length:', contactInfo?.length);

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

   {/* Section Coordonnées - VERSION SANS FRAMER MOTION */}
   {contactInfo && contactInfo.length > 0 && (
    <section className="section bg-charcoal-900 text-white">
     <div className="container">
      <div className="text-center mb-12">
       <h2 className="text-2xl md:text-3xl font-semibold mb-4 text-golden">
        Nos Coordonnées
       </h2>
       <div className="accent-line" />
      </div>

      <div className="grid md:grid-cols-2 gap-6 md:gap-8">
       {contactInfo.map((info, index) => {
        const cleanPhone = info.phone.replace(/\s+/g, '').replace(/^0/, '');
        const phoneLink = `tel:+33${cleanPhone}`;
        
        return (
         <div
          key={info.type}
          className="bg-charcoal-800 p-6 md:p-8 border border-accent/20 shadow-lg hover:border-accent/40 transition-all duration-300"
         >
          <h3 className="text-xl md:text-2xl font-semibold mb-6 text-golden">
           {info.description}
          </h3>
          <div className="space-y-4">
           <div>
            <p className="text-sm text-neutral-300 mb-1 font-medium">Téléphone</p>
            <a href={phoneLink} className="text-lg text-white hover:text-accent transition-colors font-medium">
             {info.phone}
            </a>
           </div>
           <div>
            <p className="text-sm text-neutral-300 mb-1 font-medium">Email</p>
            <a href={`mailto:${info.email}`} className="text-white hover:text-accent transition-colors">
             {info.email}
            </a>
           </div>
          </div>
         </div>
        );
       })}
      </div>
     </div>
    </section>
   )}

   {/* Section Formulaire */}
   <section className="section bg-stone/30">
    <div className="container">
     <div className="text-center mb-12">
      <h2 className="text-2xl md:text-3xl font-semibold mb-4 text-accent">
       Votre Demande
      </h2>
      <div className="accent-line" />
      <p className="text-lg text-secondary mt-6 mx-auto">
       Remplissez le formulaire ci-dessous, nous vous répondrons dans les plus brefs délais.
      </p>
     </div>

     <Suspense fallback={<div className="text-center py-12">Chargement...</div>}>
      <ContactFormWrapper />
     </Suspense>
    </div>
   </section>
  </>
 );
}