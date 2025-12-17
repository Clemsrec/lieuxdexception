/**
 * API Admin - Gestion utilisateurs Firebase Auth
 * - POST: Créer utilisateur (Auth + Firestore)
 * - PUT: Modifier utilisateur
 * - DELETE: Supprimer utilisateur
 */

import { NextRequest, NextResponse } from 'next/server';
import { adminAuth, adminDb } from '@/lib/firebase-admin';
import { Timestamp } from 'firebase-admin/firestore';

/**
 * POST /api/admin/users - Créer utilisateur
 */
export async function POST(request: NextRequest) {
  try {
    const { email, password, firstName, lastName, role } = await request.json();

    // Validation
    if (!email || !password || !firstName || !lastName) {
      return NextResponse.json(
        { error: 'Tous les champs sont obligatoires' },
        { status: 400 }
      );
    }

    if (password.length < 6) {
      return NextResponse.json(
        { error: 'Le mot de passe doit contenir au moins 6 caractères' },
        { status: 400 }
      );
    }

    if (!adminAuth || !adminDb) {
      return NextResponse.json(
        { error: 'Firebase Admin non initialisé' },
        { status: 500 }
      );
    }

    // Créer user dans Firebase Auth
    const userRecord = await adminAuth.createUser({
      email: email.toLowerCase(),
      password,
      displayName: `${firstName} ${lastName}`,
      emailVerified: false,
    });

    // Définir custom claims si admin
    if (role === 'admin') {
      await adminAuth.setCustomUserClaims(userRecord.uid, { admin: true, role: 'admin' });
    }

    // Créer document dans Firestore
    await adminDb.collection('users').doc(userRecord.uid).set({
      email: email.toLowerCase(),
      firstName: firstName.trim(),
      lastName: lastName.trim(),
      role: role || 'user',
      createdAt: Timestamp.now(),
      updatedAt: Timestamp.now(),
    });

    return NextResponse.json({
      success: true,
      userId: userRecord.uid,
      message: 'Utilisateur créé avec succès',
    });
  } catch (error: any) {
    console.error('Erreur création user:', error);
    
    // Gestion erreurs Firebase Auth
    if (error.code === 'auth/email-already-exists') {
      return NextResponse.json(
        { error: 'Cet email est déjà utilisé' },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { error: error.message || 'Erreur lors de la création' },
      { status: 500 }
    );
  }
}

/**
 * PUT /api/admin/users - Modifier utilisateur
 */
export async function PUT(request: NextRequest) {
  try {
    const { userId, email, password, firstName, lastName, role } = await request.json();

    if (!userId) {
      return NextResponse.json(
        { error: 'userId requis' },
        { status: 400 }
      );
    }

    if (!adminAuth || !adminDb) {
      return NextResponse.json(
        { error: 'Firebase Admin non initialisé' },
        { status: 500 }
      );
    }

    // Mettre à jour Firebase Auth
    const updateData: any = {};
    if (email) updateData.email = email.toLowerCase();
    if (password && password.length >= 6) updateData.password = password;
    if (firstName && lastName) updateData.displayName = `${firstName} ${lastName}`;

    await adminAuth.updateUser(userId, updateData);

    // Mettre à jour custom claims si role change
    if (role) {
      const claims = role === 'admin' 
        ? { admin: true, role: 'admin' }
        : { admin: false, role: 'user' };
      await adminAuth.setCustomUserClaims(userId, claims);
    }

    // Mettre à jour Firestore
    const firestoreUpdate: any = {
      updatedAt: Timestamp.now(),
    };
    if (email) firestoreUpdate.email = email.toLowerCase();
    if (firstName) firestoreUpdate.firstName = firstName.trim();
    if (lastName) firestoreUpdate.lastName = lastName.trim();
    if (role) firestoreUpdate.role = role;

    await adminDb.collection('users').doc(userId).update(firestoreUpdate);

    return NextResponse.json({
      success: true,
      message: 'Utilisateur modifié avec succès',
    });
  } catch (error: any) {
    console.error('Erreur modification user:', error);

    if (error.code === 'auth/email-already-exists') {
      return NextResponse.json(
        { error: 'Cet email est déjà utilisé' },
        { status: 400 }
      );
    }

    if (error.code === 'auth/user-not-found') {
      return NextResponse.json(
        { error: 'Utilisateur non trouvé' },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { error: error.message || 'Erreur lors de la modification' },
      { status: 500 }
    );
  }
}

/**
 * DELETE /api/admin/users - Supprimer utilisateur
 */
export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');

    if (!userId) {
      return NextResponse.json(
        { error: 'userId requis' },
        { status: 400 }
      );
    }

    if (!adminAuth || !adminDb) {
      return NextResponse.json(
        { error: 'Firebase Admin non initialisé' },
        { status: 500 }
      );
    }

    // Supprimer de Firebase Auth
    await adminAuth.deleteUser(userId);

    // Supprimer de Firestore
    await adminDb.collection('users').doc(userId).delete();

    return NextResponse.json({
      success: true,
      message: 'Utilisateur supprimé avec succès',
    });
  } catch (error: any) {
    console.error('Erreur suppression user:', error);

    if (error.code === 'auth/user-not-found') {
      return NextResponse.json(
        { error: 'Utilisateur non trouvé' },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { error: error.message || 'Erreur lors de la suppression' },
      { status: 500 }
    );
  }
}
