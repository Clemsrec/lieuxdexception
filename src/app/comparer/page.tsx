/**
 * Page Comparer - Comparaison de lieux d'exception
 * 
 * Permet aux utilisateurs de comparer jusqu'à 3 domaines
 * sur différents critères pour faciliter leur choix.
 */

import { Metadata } from 'next';
import VenueComparator from '@/components/VenueComparator';
import { getVenues } from '@/lib/firestore';
import Icon from '@/components/ui/Icon';

export const metadata: Metadata = {
  title: 'Comparer nos domaines | Lieux d\'Exception',
  description: 'Comparez jusqu\'à 3 de nos domaines d\'exception pour trouver le lieu idéal pour votre événement professionnel ou votre mariage.',
  keywords: ['comparateur', 'domaines', 'lieux d\'exception', 'événements', 'mariages', 'séminaires'],
};

export default async function ComparerPage() {
  // Récupérer tous les lieux actifs
  const venues = await getVenues();

  return (
    <main className="min-h-screen">
      {/* Hero Section */}
      <section className="bg-linear-to-br from-primary to-secondary text-white py-16">
        <div className="section-container">
          <div className="text-center max-w-3xl mx-auto">
            <Icon
              type="scale"
              size={48}
              className="mx-auto mb-4"
              aria-label="Comparateur"
            />
            <h1 className="text-4xl md:text-5xl font-bold mb-4 text-balance">
              Comparez nos domaines d&apos;exception
            </h1>
            <p className="text-xl text-blue-100 text-balance">
              Trouvez le lieu idéal pour votre événement en comparant nos {venues.length} domaines
              sur leurs capacités, équipements et tarifs.
            </p>
          </div>
        </div>
      </section>

      {/* Instructions */}
      <section className="py-8 bg-gray-50">
        <div className="section-container">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="bg-white rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-3 shadow">
                <span className="text-2xl font-bold text-primary">1</span>
              </div>
              <h3 className="font-semibold mb-2">Sélectionnez</h3>
              <p className="text-sm text-gray-600">
                Choisissez jusqu&apos;à 3 domaines à comparer
              </p>
            </div>

            <div className="text-center">
              <div className="bg-white rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-3 shadow">
                <span className="text-2xl font-bold text-primary">2</span>
              </div>
              <h3 className="font-semibold mb-2">Comparez</h3>
              <p className="text-sm text-gray-600">
                Consultez le tableau comparatif détaillé
              </p>
            </div>

            <div className="text-center">
              <div className="bg-white rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-3 shadow">
                <span className="text-2xl font-bold text-primary">3</span>
              </div>
              <h3 className="font-semibold mb-2">Choisissez</h3>
              <p className="text-sm text-gray-600">
                Demandez un devis pour le lieu idéal
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Comparateur */}
      <section className="py-12">
        <div className="section-container">
          <VenueComparator venues={venues} />
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-primary text-white">
        <div className="section-container text-center">
          <h2 className="text-3xl font-bold mb-4">
            Besoin d&apos;aide pour choisir ?
          </h2>
          <p className="text-xl mb-6 text-blue-100">
            Notre équipe est là pour vous conseiller et vous accompagner dans votre projet.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href="/contact"
              className="inline-flex items-center justify-center gap-2 bg-white text-primary px-6 py-3 rounded-lg font-semibold hover:bg-blue-50 transition"
            >
              <Icon type="mail" size={20} aria-label="Contact" />
              Nous contacter
            </a>
            <a
              href="tel:+33000000000"
              className="inline-flex items-center justify-center gap-2 border-2 border-white text-white px-6 py-3 rounded-lg font-semibold hover:bg-white hover:text-primary transition"
            >
              <Icon type="phone" size={20} aria-label="Téléphone" />
              Appeler un conseiller
            </a>
          </div>
        </div>
      </section>
    </main>
  );
}
