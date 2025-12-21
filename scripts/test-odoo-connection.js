#!/usr/bin/env node

/**
 * Script de test de connexion Odoo
 * 
 * Ce script permet de :
 * 1. Vérifier les credentials Odoo
 * 2. Tester l'authentification
 * 3. Récupérer le nom de la base de données
 * 4. Optionnellement créer un lead de test
 * 
 * Usage:
 *   node scripts/test-odoo-connection.js
 *   node scripts/test-odoo-connection.js --create-test-lead
 */

const xmlrpc = require('xmlrpc');

// Configuration depuis .env.local
require('dotenv').config({ path: '.env.local' });

const ODOO_URL = process.env.ODOO_URL;
const ODOO_DB = process.env.ODOO_DB;
const ODOO_USERNAME = process.env.ODOO_USERNAME;
const ODOO_API_KEY = process.env.ODOO_API_KEY;

const createTestLead = process.argv.includes('--create-test-lead');

console.log('🔍 Test de connexion Odoo\n');
console.log('Configuration:');
console.log(`  URL: ${ODOO_URL}`);
console.log(`  DB: ${ODOO_DB}`);
console.log(`  Username: ${ODOO_USERNAME}`);
console.log(`  API Key: ${ODOO_API_KEY ? '***' + ODOO_API_KEY.slice(-4) : 'NON DÉFINIE'}`);
console.log('');

if (!ODOO_URL || !ODOO_USERNAME || !ODOO_API_KEY) {
  console.error('❌ Variables d\'environnement Odoo manquantes !');
  console.error('Assurez-vous que .env.local contient :');
  console.error('  - ODOO_URL');
  console.error('  - ODOO_DB');
  console.error('  - ODOO_USERNAME');
  console.error('  - ODOO_API_KEY');
  process.exit(1);
}

/**
 * Étape 1 : Récupérer les bases de données disponibles
 */
async function getDatabases() {
  return new Promise((resolve, reject) => {
    console.log('1️⃣ Récupération des bases de données disponibles...');
    
    const client = xmlrpc.createClient({
      url: `${ODOO_URL}/xmlrpc/2/db`,
      headers: {
        'User-Agent': 'Lieux d\'Exception Test Script',
      },
    });

    client.methodCall('list', [], (error, databases) => {
      if (error) {
        console.error('❌ Erreur récupération des bases:', error.message);
        reject(error);
      } else {
        console.log('✅ Bases de données disponibles:', databases);
        console.log('');
        resolve(databases);
      }
    });
  });
}

/**
 * Étape 2 : Authentification
 */
async function authenticate() {
  return new Promise((resolve, reject) => {
    console.log('2️⃣ Test d\'authentification...');
    
    const client = xmlrpc.createClient({
      url: `${ODOO_URL}/xmlrpc/2/common`,
      headers: {
        'User-Agent': 'Lieux d\'Exception Test Script',
      },
    });

    client.methodCall(
      'authenticate',
      [ODOO_DB, ODOO_USERNAME, ODOO_API_KEY, {}],
      (error, uid) => {
        if (error) {
          console.error('❌ Erreur authentification:', error.message);
          reject(error);
        } else if (!uid) {
          console.error('❌ Authentification échouée : UID vide');
          console.error('Vérifiez :');
          console.error('  - Le nom de la base de données (ODOO_DB)');
          console.error('  - L\'email utilisateur (ODOO_USERNAME)');
          console.error('  - La clé API (ODOO_API_KEY)');
          reject(new Error('Authentification échouée'));
        } else {
          console.log(`✅ Authentification réussie ! UID: ${uid}`);
          console.log('');
          resolve(uid);
        }
      }
    );
  });
}

/**
 * Étape 3 : Vérifier les permissions CRM
 */
async function checkCRMAccess(uid) {
  return new Promise((resolve, reject) => {
    console.log('3️⃣ Vérification des permissions CRM...');
    
    const client = xmlrpc.createClient({
      url: `${ODOO_URL}/xmlrpc/2/object`,
      headers: {
        'User-Agent': 'Lieux d\'Exception Test Script',
      },
    });

    // Tenter de lire les leads CRM (check_access_rights)
    client.methodCall(
      'execute_kw',
      [
        ODOO_DB,
        uid,
        ODOO_API_KEY,
        'crm.lead',
        'check_access_rights',
        ['read'],
        { raise_exception: false },
      ],
      (error, hasAccess) => {
        if (error) {
          console.error('❌ Erreur vérification permissions:', error.message);
          reject(error);
        } else if (!hasAccess) {
          console.warn('⚠️ L\'utilisateur n\'a pas accès au module CRM');
          console.warn('Assurez-vous que l\'utilisateur a les droits sur crm.lead');
          resolve(false);
        } else {
          console.log('✅ Accès au module CRM confirmé');
          console.log('');
          resolve(true);
        }
      }
    );
  });
}

/**
 * Étape 4 : Créer un lead de test (optionnel)
 */
async function createTestLeadInOdoo(uid) {
  return new Promise((resolve, reject) => {
    console.log('4️⃣ Création d\'un lead de test...');
    
    const client = xmlrpc.createClient({
      url: `${ODOO_URL}/xmlrpc/2/object`,
      headers: {
        'User-Agent': 'Lieux d\'Exception Test Script',
      },
    });

    const testLead = {
      name: `[TEST] Demande de test - ${new Date().toLocaleString('fr-FR')}`,
      contact_name: 'Test Lieux d\'Exception',
      email_from: 'test@lieuxdexception.com',
      phone: '+33 1 23 45 67 89',
      description: `Lead de test créé automatiquement par le script de vérification.\n\nDate: ${new Date().toISOString()}\n\nCe lead peut être supprimé.`,
      type: 'lead',
    };

    client.methodCall(
      'execute_kw',
      [
        ODOO_DB,
        uid,
        ODOO_API_KEY,
        'crm.lead',
        'create',
        [testLead],
      ],
      (error, leadId) => {
        if (error) {
          console.error('❌ Erreur création lead de test:', error.message);
          reject(error);
        } else {
          console.log(`✅ Lead de test créé avec succès !`);
          console.log(`   ID Odoo: ${leadId}`);
          console.log(`   Vous pouvez le voir dans Odoo : ${ODOO_URL}/web#id=${leadId}&model=crm.lead`);
          console.log('');
          resolve(leadId);
        }
      }
    );
  });
}

/**
 * Exécution du script
 */
async function main() {
  try {
    // Étape 1 : Tenter de récupérer les bases (peut échouer sur Odoo Cloud)
    try {
      const databases = await getDatabases();
      
      if (!databases.includes(ODOO_DB)) {
        console.warn(`⚠️ Attention : La base "${ODOO_DB}" n'est pas dans la liste !`);
        console.warn(`   Bases disponibles : ${databases.join(', ')}`);
        console.warn(`   Mettez à jour ODOO_DB dans .env.local`);
        console.warn('');
      }
    } catch (error) {
      console.warn('⚠️ Impossible de lister les bases (normal sur Odoo Cloud)');
      console.warn(`   On va tester avec : "${ODOO_DB}"`);
      console.log('');
    }

    // Étape 2
    const uid = await authenticate();

    // Étape 3
    const hasCRMAccess = await checkCRMAccess(uid);

    // Étape 4 (optionnel)
    if (createTestLead && hasCRMAccess) {
      await createTestLeadInOdoo(uid);
    }

    console.log('✅ Tous les tests ont réussi !');
    console.log('');
    console.log('📝 Prochaines étapes :');
    console.log('  1. Si ODOO_DB est incorrect, mettez-le à jour dans .env.local');
    console.log('  2. Redémarrez votre serveur Next.js (npm run dev)');
    console.log('  3. Testez la soumission d\'un formulaire');
    console.log('  4. Vérifiez que le lead apparaît dans Odoo CRM');

  } catch (error) {
    console.error('\n❌ Test échoué :', error.message);
    process.exit(1);
  }
}

main();
