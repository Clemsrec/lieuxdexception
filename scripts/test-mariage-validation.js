/**
 * Script de Test - Validation Formulaire Mariage
 * 
 * Teste les nouveaux schémas Zod simplifiés pour le formulaire mariage
 */

const { z } = require('zod');

// Reproduire les schémas de validation.ts
const nameSchema = z
  .string()
  .min(2, 'Minimum 2 caractères')
  .max(50, 'Maximum 50 caractères')
  .regex(
    /^[a-zA-ZÀ-ÿ\s'-]+$/,
    'Seules les lettres, espaces, tirets et apostrophes sont autorisés'
  )
  .trim();

const emailSchema = z
  .string()
  .email('Email invalide')
  .min(5, 'Email trop court')
  .max(100, 'Email trop long')
  .toLowerCase()
  .trim();

const phoneSchema = z
  .string()
  .regex(
    /^(?:(?:\+|00)33|0)\s*[1-9](?:[\s.-]*\d{2}){4}$/,
    'Numéro de téléphone français invalide'
  )
  .transform(val => val.replace(/[\s.-]/g, ''));

const messageSchema = z
  .string()
  .min(10, 'Message trop court (minimum 10 caractères)')
  .max(2000, 'Message trop long (maximum 2000 caractères)')
  .trim();

// Nouveau schéma simplifié
const weddingFormSchema = z.object({
  // Contact (OBLIGATOIRES SEULEMENT)
  firstName: nameSchema,
  lastName: nameSchema,
  email: emailSchema,
  phone: phoneSchema,
  
  // Couple (OPTIONNELS)
  bride: z.object({
    firstName: nameSchema.optional(),
    lastName: nameSchema.optional(),
  }).optional(),
  groom: z.object({
    firstName: nameSchema.optional(),
    lastName: nameSchema.optional(),
  }).optional(),
  
  // Événement (TOUS OPTIONNELS)
  weddingDate: z.string().optional(),
  guestCount: z.string().optional(),
  budget: z.number().min(0).optional(),
  requirements: messageSchema.optional(),
  message: messageSchema.optional(),
  
  // Lieu souhaité
  venueId: z.string().optional(),
  
  // Consentement
  acceptPrivacy: z.literal(true),
});

console.log('🧪 Test de validation - Formulaire Mariage Simplifié\n');

// Test 1 : Données minimales (seulement champs obligatoires)
console.log('Test 1 : Données minimales (nom, prénom, email, téléphone)');
const test1 = {
  firstName: 'Marie',
  lastName: 'Dupont',
  email: 'marie.dupont@example.com',
  phone: '06 12 34 56 78',
  acceptPrivacy: true,
};

try {
  const result1 = weddingFormSchema.parse(test1);
  console.log('✅ SUCCÈS - Validation passée avec données minimales\n');
} catch (error) {
  console.error('❌ ÉCHEC :', error.errors);
}

// Test 2 : Avec informations couple (optionnelles)
console.log('Test 2 : Avec informations mariés (optionnelles)');
const test2 = {
  firstName: 'Marie',
  lastName: 'Dupont',
  email: 'marie.dupont@example.com',
  phone: '06 12 34 56 78',
  bride: {
    firstName: 'Sophie',
    lastName: 'Martin',
  },
  groom: {
    firstName: 'Pierre',
    lastName: 'Bernard',
  },
  guestCount: '85', // String depuis le select
  acceptPrivacy: true,
};

try {
  const result2 = weddingFormSchema.parse(test2);
  console.log('✅ SUCCÈS - Validation avec informations couple\n');
} catch (error) {
  console.error('❌ ÉCHEC :', error.errors);
}

// Test 3 : Avec date et message
console.log('Test 3 : Avec date et message');
const test3 = {
  firstName: 'Marie',
  lastName: 'Dupont',
  email: 'marie.dupont@example.com',
  phone: '+33612345678',
  weddingDate: '2026-06',
  guestCount: '150',
  message: 'Nous recherchons un lieu pour notre mariage avec hébergement sur place.',
  acceptPrivacy: true,
};

try {
  const result3 = weddingFormSchema.parse(test3);
  console.log('✅ SUCCÈS - Validation avec date et message\n');
} catch (error) {
  console.error('❌ ÉCHEC :', error.errors);
}

// Test 4 : Données invalides (email manquant)
console.log('Test 4 : Données invalides (email manquant - doit échouer)');
const test4 = {
  firstName: 'Marie',
  lastName: 'Dupont',
  phone: '06 12 34 56 78',
  acceptPrivacy: true,
};

try {
  const result4 = weddingFormSchema.parse(test4);
  console.log('❌ ERREUR - La validation aurait dû échouer !');
} catch (error) {
  console.log('✅ SUCCÈS - Validation a correctement échoué (email manquant)\n');
}

// Test 5 : guestCount avec ancien format number (doit échouer maintenant)
console.log('Test 5 : guestCount en number au lieu de string');
const test5 = {
  firstName: 'Marie',
  lastName: 'Dupont',
  email: 'marie@example.com',
  phone: '06 12 34 56 78',
  guestCount: 100, // Number au lieu de string
  acceptPrivacy: true,
};

try {
  const result5 = weddingFormSchema.parse(test5);
  console.log('❌ ATTENTION - guestCount number accepté (devrait être string)');
} catch (error) {
  console.log('✅ Type guestCount incorrect détecté (attendu: string, reçu: number)\n');
}

console.log('✅ Tests terminés\n');
console.log('📋 Résumé :');
console.log('   - Champs obligatoires : firstName, lastName, email, phone, acceptPrivacy');
console.log('   - Champs optionnels : bride, groom, weddingDate, guestCount, message');
console.log('   - guestCount : maintenant accepté en string (depuis select HTML)');
