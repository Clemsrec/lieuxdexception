/**
 * API Route : Mettre à jour les URLs Firestore avec images WebP
 * GET /api/admin/update-webp-urls
 */

import { NextResponse } from 'next/server';
import { adminDb } from '@/lib/firebase-admin';

export async function GET() {
  try {
    console.log('🔄 Mise à jour URLs WebP dans Firestore');

    const venuesRef = adminDb!.collection('venues');
    const snapshot = await venuesRef.get();

    const updates: Array<{venue: string, changes: string[]}> = [];

    for (const doc of snapshot.docs) {
      const data = doc.data();
      const docUpdates: any = {};
      const changes: string[] = [];

      // 1. Hero Brûlaire : .jpg → .webp
      if (data.heroImage?.includes('chateau-brulaire/hero.jpg')) {
        docUpdates.heroImage = 'venues/chateau-brulaire/hero.webp';
        changes.push('hero: .jpg → .webp');
      }

      // 2. Logos : .png → .webp
      if (data.logo?.includes('dome-blanc.png')) {
        docUpdates.logo = 'logos/venues/dome-blanc.webp';
        changes.push('logo: dome-blanc.png → .webp');
      } else if (data.logo?.includes('domaine-blanc.png')) {
        docUpdates.logo = 'logos/venues/domaine-blanc.webp';
        changes.push('logo: domaine-blanc.png → .webp');
      }

      // 3. Galleries
      if (data.galleries?.mariages) {
        let galleryUpdated = false;
        const updatedGallery = data.galleries.mariages.map((img: string) => {
          if (img.includes('domaine_cocktail_1.jpg')) {
            galleryUpdated = true;
            return 'venues/domaine-nantais/mariages/domaine_cocktail_1.webp';
          }
          return img;
        });

        if (galleryUpdated) {
          docUpdates['galleries.mariages'] = updatedGallery;
          changes.push('gallery: domaine_cocktail_1.jpg → .webp');
        }
      }

      // Appliquer les updates
      if (changes.length > 0) {
        await venuesRef.doc(doc.id).update(docUpdates);
        updates.push({ venue: doc.id, changes });
      }
    }

    return NextResponse.json({
      success: true,
      updated: updates.length,
      details: updates,
      message: `${updates.length} venues mis à jour avec URLs WebP`
    });

  } catch (error: any) {
    console.error('Erreur mise à jour WebP:', error);
    return NextResponse.json(
      { error: error.message },
      { status: 500 }
    );
  }
}
