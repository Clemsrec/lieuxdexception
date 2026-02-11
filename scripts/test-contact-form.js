#!/usr/bin/env node

/**
 * Script de test des formulaires de contact
 * Simule l'envoi d'un formulaire B2B ou Mariage vers l'API
 * 
 * Usage:
 *   node scripts/test-contact-form.js b2b
 *   node scripts/test-contact-form.js mariage
 */

const formType = process.argv[2] || 'b2b';

if (!['b2b', 'mariage'].includes(formType)) {
  console.error('❌ Type de formulaire invalide. Utilisez "b2b" ou "mariage"');
  process.exit(1);
}

const API_URL = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3001';

console.log(`🧪 Test du formulaire ${formType.toUpperCase()}\n`);

// Données de test B2B
// Date future (6 mois à partir d'aujourd'hui)
const futureDate = new Date();
futureDate.setMonth(futureDate.getMonth() + 6);
const eventDateStr = futureDate.toISOString().split('T')[0];

const testB2BData = {
  type: 'b2b',
  firstName: 'Jean',
  lastName: 'Dupont',
  email: 'jean.dupont@test-entreprise.fr',
  phone: '+33 6 12 34 56 78',
  company: 'Test Entreprise SA',
  position: 'Directeur Événementiel',
  eventType: 'seminar',
  eventDate: eventDateStr,
  guestCount: '80', // STRING pour correspondre au schéma
  message: 'Ceci est un test du formulaire B2B depuis le script terminal.\n\nBesoins: Déjeuner, Cocktail',
  acceptPrivacy: true,
};

// Données de test Mariage
// Date future (9 mois à partir d'aujourd'hui)
const futureDateWedding = new Date();
futureDateWedding.setMonth(futureDateWedding.getMonth() + 9);
const weddingDateStr = futureDateWedding.toISOString().split('T')[0];

const testMariageData = {
  type: 'mariage',
  // Contact principal (OBLIGATOIRE selon schéma)
  firstName: 'Marie',
  lastName: 'Martin',
  email: 'marie.pierre@test-mariage.fr',
  phone: '+33 6 98 76 54 32',
  // Détails du couple (OPTIONNELS)
  bride: {
    firstName: 'Marie',
    lastName: 'Martin',
  },
  groom: {
    firstName: 'Pierre',
    lastName: 'Durand',
  },
  // Détails événement (OPTIONNELS)
  weddingDate: weddingDateStr,
  guestCount: '120', // STRING pour correspondre au schéma
  message: 'Ceci est un test du formulaire Mariage depuis le script terminal.\n\nLieux intéressants: Le Château de la Corbe, Le Manoir de la Boulaie',
  acceptPrivacy: true,
};

const testData = formType === 'b2b' ? testB2BData : testMariageData;

console.log('📤 Données envoyées:');
console.log(JSON.stringify(testData, null, 2));
console.log('');

async function testContactForm() {
  try {
    console.log(`🚀 Envoi vers ${API_URL}/api/contact/submit...`);
    const startTime = Date.now();

    const response = await fetch(`${API_URL}/api/contact/submit`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(testData),
    });

    const duration = Date.now() - startTime;
    const data = await response.json();

    console.log(`⏱️  Durée: ${duration}ms`);
    console.log(`📊 Status: ${response.status} ${response.statusText}`);
    console.log('');

    if (response.ok) {
      console.log('✅ SUCCÈS !');
      console.log('');
      console.log('📝 Réponse:');
      console.log(JSON.stringify(data, null, 2));
      console.log('');
      console.log('🔍 Vérifications à faire:');
      console.log('  1. ✓ Lead sauvegardé dans Firestore (collection "leads")');
      console.log(`  2. ⏳ Synchronisation Odoo en cours (asynchrone)...`);
      console.log('  3. ⏳ Notification FCM envoyée aux admins...');
      console.log('');
      console.log('💡 Pour vérifier dans Firestore:');
      console.log('   → https://console.firebase.google.com/project/lieux-d-exceptions/firestore');
      console.log('');
      console.log('💡 Pour vérifier dans Odoo:');
      console.log('   → https://groupe-lr.odoo.com/web#menu_id=156&action=196&model=crm.lead&view_type=kanban');
      
      if (data.leadId) {
        console.log('');
        console.log(`📌 Lead ID Firestore: ${data.leadId}`);
      }
    } else {
      console.error('❌ ÉCHEC !');
      console.error('');
      console.error('📝 Erreur:');
      console.error(JSON.stringify(data, null, 2));
      console.error('');
      
      if (response.status === 429) {
        console.error('⚠️  Rate limit dépassé. Attendez quelques minutes avant de réessayer.');
      } else if (response.status === 400) {
        console.error('⚠️  Données invalides. Vérifiez la validation Zod.');
      } else if (response.status === 500) {
        console.error('⚠️  Erreur serveur. Vérifiez les logs du serveur Next.js.');
      }
    }

  } catch (error) {
    console.error('❌ ERREUR RÉSEAU !');
    console.error('');
    console.error(error.message);
    console.error('');
    console.error('💡 Vérifiez que le serveur Next.js tourne:');
    console.error('   npm run dev');
    process.exit(1);
  }
}

testContactForm();
