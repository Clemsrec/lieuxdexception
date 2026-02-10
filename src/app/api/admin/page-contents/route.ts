import { NextRequest, NextResponse } from 'next/server';
import { getPageContent, getAllPageContents, upsertPageContent, deletePageContent } from '@/lib/firestore';
import { cookies } from 'next/headers';

/**
 * API Route - Gestion des contenus de pages
 * 
 * GET: Récupérer le contenu d'une page ou tous les contenus
 * POST: Créer ou mettre à jour un contenu de page
 * DELETE: Supprimer un contenu de page
 */

/**
 * GET - Récupérer les contenus de pages
 * Query params:
 * - pageId: ID de la page (optionnel, si absent retourne toutes les pages)
 * - locale: Locale de la page (défaut: 'fr')
 */
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const pageId = searchParams.get('pageId');
    const locale = searchParams.get('locale') || 'fr';

    // Récupérer une page spécifique
    if (pageId) {
      const content = await getPageContent(pageId, locale);
      
      if (!content) {
        return NextResponse.json(
          { error: 'Contenu non trouvé' },
          { status: 404 }
        );
      }
      
      return NextResponse.json(content);
    }

    // Récupérer toutes les pages pour une locale
    const allContents = await getAllPageContents(locale);
    return NextResponse.json(allContents);

  } catch (error) {
    console.error('[API] Erreur GET page-contents:', error);
    return NextResponse.json(
      { error: 'Erreur serveur lors de la récupération des contenus' },
      { status: 500 }
    );
  }
}

/**
 * POST - Créer ou mettre à jour un contenu de page
 * Body: { pageId, locale, content }
 */
export async function POST(request: NextRequest) {
  try {
    // Vérifier l'authentification admin
    const cookieStore = await cookies();
    const authToken = cookieStore.get('auth-token');
    
    console.log('[API] POST - Cookie auth-token présent:', !!authToken);
    
    if (!authToken) {
      console.error('[API] POST - Pas de cookie auth-token trouvé');
      return NextResponse.json(
        { error: 'Non authentifié - Token manquant. Reconnectez-vous.' },
        { status: 401 }
      );
    }

    // Vérification basique : présence du token auth (admin Firebase Auth)
    // En production, Firebase Auth gère les permissions via les custom claims
    
    const body = await request.json();
    const { pageId, locale, content } = body;

    console.log('[API] POST page-contents - Données reçues:', { pageId, locale, hasContent: !!content });

    // Validation basique
    if (!pageId || !locale || !content) {
      console.error('[API] Validation échouée:', { pageId, locale, hasContent: !!content });
      return NextResponse.json(
        { error: 'Paramètres manquants (pageId, locale, content requis)' },
        { status: 400 }
      );
    }

    // Email admin par défaut (custom claims Firebase contiennent l'email réel)
    const userEmail = 'contact@lieuxdexception.com';

    // Créer ou mettre à jour le contenu
    const docId = await upsertPageContent(pageId, locale, content, userEmail);

    return NextResponse.json({
      success: true,
      docId,
      message: 'Contenu enregistré avec succès'
    });

  } catch (error) {
    console.error('[API] Erreur POST page-contents:', error);
    return NextResponse.json(
      { error: 'Erreur serveur lors de la sauvegarde du contenu' },
      { status: 500 }
    );
  }
}

/**
 * DELETE - Supprimer un contenu de page
 * Query params:
 * - pageId: ID de la page
 * - locale: Locale de la page
 */
export async function DELETE(request: NextRequest) {
  try {
    // Vérifier l'authentification admin
    const cookieStore = await cookies();
    const authToken = cookieStore.get('auth-token');
    
    if (!authToken) {
      return NextResponse.json(
        { error: 'Non authentifié - Token manquant' },
        { status: 401 }
      );
    }

    const { searchParams } = new URL(request.url);
    const pageId = searchParams.get('pageId');
    const locale = searchParams.get('locale') || 'fr';

    if (!pageId) {
      return NextResponse.json(
        { error: 'pageId requis' },
        { status: 400 }
      );
    }

    await deletePageContent(pageId, locale);

    return NextResponse.json({
      success: true,
      message: 'Contenu supprimé avec succès'
    });

  } catch (error) {
    console.error('[API] Erreur DELETE page-contents:', error);
    return NextResponse.json(
      { error: 'Erreur serveur lors de la suppression du contenu' },
      { status: 500 }
    );
  }
}
