/**
 * Composant Google Analytics 4
 * Charge les scripts GA4 et initialise le tracking
 * 
 * Configuration:
 * - ID de mesure: G-0ZM7ZL3PYB
 * - Nom du flux: Site 1 (B2B)
 * - ID de flux: 12844417102
 */

'use client';

import Script from 'next/script';
import { useEffect, Suspense } from 'react';
import { usePathname, useSearchParams } from 'next/navigation';

const GA_MEASUREMENT_ID = 'G-0ZM7ZL3PYB';

/**
 * Événements GA4 personnalisés
 */
export const trackEvent = (eventName: string, eventParams?: Record<string, any>) => {
  if (typeof window !== 'undefined' && (window as any).gtag) {
    (window as any).gtag('event', eventName, eventParams);
  }
};

/**
 * Track page view
 */
export const trackPageView = (url: string) => {
  if (typeof window !== 'undefined' && (window as any).gtag) {
    (window as any).gtag('config', GA_MEASUREMENT_ID, {
      page_path: url,
      cookie_domain: 'auto',
      cookie_flags: 'SameSite=None;Secure'
    });
  }
};

/**
 * Composant interne qui utilise useSearchParams
 */
function GoogleAnalyticsTracker() {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  // Track page views on route change
  useEffect(() => {
    if (pathname) {
      const url = pathname + (searchParams?.toString() ? `?${searchParams.toString()}` : '');
      trackPageView(url);
    }
  }, [pathname, searchParams]);

  return null;
}

/**
 * Composant qui injecte les scripts Google Analytics
 */
export default function GoogleAnalytics() {
  return (
    <>
      {/* Google Tag Manager Script - Lazy load pour performance */}
      <Script
        strategy="lazyOnload"
        src={`https://www.googletagmanager.com/gtag/js?id=${GA_MEASUREMENT_ID}`}
      />
      
      {/* GA4 Initialization */}
      <Script
        id="google-analytics"
        strategy="lazyOnload"
        dangerouslySetInnerHTML={{
          __html: `
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            
            gtag('config', '${GA_MEASUREMENT_ID}', {
              cookie_domain: 'auto',
              cookie_flags: 'SameSite=None;Secure'
            });
          `,
        }}
      />
      
      {/* Tracker avec Suspense */}
      <Suspense fallback={null}>
        <GoogleAnalyticsTracker />
      </Suspense>
    </>
  );
}

/**
 * Hook pour tracker les événements personnalisés
 */
export function useAnalytics() {
  return {
    trackEvent,
    trackPageView,
    trackContactForm: (formType: 'b2b' | 'mariage', venueName?: string) => {
      trackEvent('contact_form_submit', {
        form_type: formType,
        venue_name: venueName,
      });
    },
    trackVenueView: (venueName: string, venueSlug: string) => {
      trackEvent('venue_view', {
        venue_name: venueName,
        venue_slug: venueSlug,
      });
    },
    trackDownload: (fileName: string, fileType: string) => {
      trackEvent('file_download', {
        file_name: fileName,
        file_type: fileType,
      });
    },
    trackExternalLink: (url: string, label?: string) => {
      trackEvent('external_link_click', {
        url,
        label,
      });
    },
  };
}
