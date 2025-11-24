import { NextRequest, NextResponse } from 'next/server';
import { adminAuth } from '@/lib/firebase-admin';

/**
 * API pour créer le premier utilisateur admin
 * 
 * SÉCURITÉ : À utiliser uniquement en dev local ou avec secret
 * En production, désactiver ou protéger avec un secret partagé
 * 
 * POST /api/admin/create-first-user
 * Body: { email, password, secret }
 */

const ADMIN_SECRET = process.env.ADMIN_CREATION_SECRET || 'change-me-in-production';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email, password, secret } = body;

    // Vérifier le secret
    if (secret !== ADMIN_SECRET) {
      return NextResponse.json(
        { error: 'Secret invalide' },
        { status: 403 }
      );
    }

    // Validation
    if (!email || !password) {
      return NextResponse.json(
        { error: 'Email et mot de passe requis' },
        { status: 400 }
      );
    }

    if (password.length < 8) {
      return NextResponse.json(
        { error: 'Le mot de passe doit contenir au moins 8 caractères' },
        { status: 400 }
      );
    }

    // Vérifier que Firebase Admin est initialisé
    if (!adminAuth) {
      return NextResponse.json(
        { error: 'Firebase Admin non initialisé' },
        { status: 500 }
      );
    }

    // Créer l'utilisateur avec Firebase Admin SDK
    const userRecord = await adminAuth.createUser({
      email,
      password,
      emailVerified: true, // Admin vérifié par défaut
    });

    // Définir custom claim admin
    await adminAuth.setCustomUserClaims(userRecord.uid, {
      admin: true,
      role: 'admin',
    });

    return NextResponse.json({
      success: true,
      message: 'Utilisateur admin créé avec succès',
      uid: userRecord.uid,
      email: userRecord.email,
    });

  } catch (error: any) {
    console.error('[Admin] Erreur création utilisateur:', error);

    if (error.code === 'auth/email-already-exists') {
      return NextResponse.json(
        { error: 'Cet email est déjà utilisé' },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { error: 'Erreur lors de la création de l\'utilisateur', details: error.message },
      { status: 500 }
    );
  }
}
