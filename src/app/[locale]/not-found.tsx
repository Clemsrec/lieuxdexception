'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';

/**
 * Page 404 - Not Found
 * Design élégant avec animations subtiles et photos du château
 * Pas de header/footer/layout admin, page standalone
 */
export default function NotFoundPage() {
  const [mounted, setMounted] = useState(false);
  const [imageIndex, setImageIndex] = useState(0);

  // Images disponibles (rotation subtile)
  const images = [
    '/images/Vue-chateau.jpg',
    '/images/table.jpg',
    '/images/salle-seminaire.jpg',
    '/images/table-seminaire.jpg',
  ];

  useEffect(() => {
    setMounted(true);

    // Rotation des images toutes les 4 secondes
    const interval = setInterval(() => {
      setImageIndex((prev) => (prev + 1) % images.length);
    }, 4000);

    return () => clearInterval(interval);
  }, [images.length]);

  return (
    <div className="min-h-screen w-full relative overflow-hidden bg-neutral-50">
      {/* Background image avec overlay */}
      <div className="absolute inset-0 z-0">
        {images.map((img, idx) => (
          <div
            key={img}
            className={`absolute inset-0 transition-opacity duration-1000 ${
              idx === imageIndex ? 'opacity-30' : 'opacity-0'
            }`}
          >
            <Image
              src={img}
              alt="Lieux d'Exception"
              fill
              className="object-cover"
              priority={idx === 0}
            />
          </div>
        ))}
        {/* Overlay gradient */}
        <div className="absolute inset-0 bg-linear-to-br from-primary/60 via-primary/40 to-accent/30" />
      </div>

      {/* Contenu principal */}
      <div className="relative z-10 min-h-screen flex items-center justify-center px-4 sm:px-6 lg:px-8 py-12">
        <div className="w-full">
          {/* Logo */}
          <div
            className={`text-center mb-8 transition-all duration-700 ${
              mounted ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-8'
            }`}
          >
            <Image
              src="/logo/Logo_CLE_avec Texte.png"
              alt="Lieux d'Exception"
              width={300}
              height={120}
              className="mx-auto drop-shadow-lg"
              priority
            />
          </div>

          {/* Carte principale */}
          <div
            className={`bg-white/95 backdrop-blur-sm rounded-2xl shadow-2xl p-6 sm:p-8 md:p-12 border border-white/50 transition-all duration-700 delay-200 max-w-content mx-auto ${
              mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
            }`}
          >
            {/* 404 animé */}
            <div className="text-center mb-6">
              <div className="inline-flex items-baseline gap-2">
                <span
                  className="text-8xl md:text-9xl font-heading font-bold text-primary animate-bounce"
                  style={{ animationDuration: '2s', animationDelay: '0s' }}
                >
                  4
                </span>
                <span
                  className="text-8xl md:text-9xl font-heading font-bold text-accent animate-bounce"
                  style={{ animationDuration: '2s', animationDelay: '0.2s' }}
                >
                  0
                </span>
                <span
                  className="text-8xl md:text-9xl font-heading font-bold text-primary animate-bounce"
                  style={{ animationDuration: '2s', animationDelay: '0.4s' }}
                >
                  4
                </span>
              </div>
            </div>

            {/* Message principal */}
            <h1 className="text-3xl md:text-4xl font-heading font-semibold text-primary text-center mb-4">
              Page introuvable
            </h1>

            <p className="text-lg text-secondary text-center mb-8 mx-auto">
              Désolé, la page que vous recherchez semble s&apos;être égarée dans nos magnifiques domaines...
            </p>

            {/* Séparateur décoratif */}
            <div className="flex items-center justify-center gap-3 mb-8">
              <div className="w-12 h-px bg-accent/40" />
              <span className="text-accent text-xl">✦</span>
              <div className="w-12 h-px bg-accent/40" />
            </div>

            {/* Suggestions */}
            <div className="bg-accent/5 rounded-lg p-6 mb-8">
              <h2 className="font-semibold text-primary mb-3 text-center">
                Peut-être cherchez-vous :
              </h2>
              <ul className="space-y-2 text-secondary">
                <li className="flex items-center gap-2">
                  <span className="text-accent">→</span>
                  <Link href="/catalogue" className="hover:text-primary hover:underline transition-colors">
                    Notre catalogue de lieux d&apos;exception
                  </Link>
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-accent">→</span>
                  <Link href="/evenements-b2b" className="hover:text-primary hover:underline transition-colors">
                    Organiser un événement professionnel
                  </Link>
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-accent">→</span>
                  <Link href="/mariages" className="hover:text-primary hover:underline transition-colors">
                    Célébrer votre mariage
                  </Link>
                </li>
              </ul>
            </div>

            {/* Boutons d'action */}
            <div className="flex flex-col sm:flex-row gap-4">
              <Link
                href="/"
                className="flex-1 btn-primary text-center py-4 font-semibold hover:shadow-lg transition-all group"
              >
                <span className="inline-flex items-center gap-2">
                  <svg className="w-5 h-5 transition-transform group-hover:-translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                  </svg>
                  Retour à l&apos;accueil
                </span>
              </Link>

              <Link
                href="/contact"
                className="flex-1 border-2 border-primary text-primary text-center py-4 rounded-lg font-semibold hover:bg-primary hover:text-white transition-all"
              >
                Nous contacter
              </Link>
            </div>

            {/* Info contact rapide */}
            <div className="mt-8 pt-6 border-t border-neutral-200 text-center">
              <p className="text-sm text-secondary mb-2">
                Besoin d&apos;aide immédiate ?
              </p>
              <div className="flex items-center justify-center gap-4 flex-wrap">
                <a
                  href="tel:+33123456789"
                  className="text-sm text-accent hover:text-accent-dark transition-colors inline-flex items-center gap-1"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                  </svg>
                  01 23 45 67 89
                </a>
                <a
                  href="mailto:contact@lieuxdexception.fr"
                  className="text-sm text-accent hover:text-accent-dark transition-colors inline-flex items-center gap-1"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                  contact@lieuxdexception.fr
                </a>
              </div>
            </div>
          </div>

          {/* Footer minimal */}
          <p className="text-center text-sm text-white/80 mt-6">
            © {new Date().getFullYear()} Lieux d&apos;Exception
          </p>
        </div>
      </div>

      {/* Particules décoratives flottantes */}
      <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden">
        {mounted && [...Array(6)].map((_, i) => (
          <div
            key={i}
            className="absolute w-2 h-2 bg-accent/20 rounded-full animate-float"
            style={{
              left: `${[10, 85, 25, 70, 50, 90][i]}%`,
              top: `${[20, 15, 70, 85, 40, 60][i]}%`,
              animationDelay: `${i * 0.5}s`,
              animationDuration: `${3 + i}s`,
            }}
          />
        ))}
      </div>
    </div>
  );
}
