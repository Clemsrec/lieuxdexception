#!/usr/bin/env node

/**
 * Script de test de l'intégration Odoo
 * Teste les formulaires B2B et Mariage → Firestore → Odoo
 * 
 * Usage: node scripts/test-odoo-integration.js
 */

const https = require('https');
const http = require('http');

// Configuration
const BASE_URL = process.env.TEST_URL || 'http://localhost:3001';

/**
 * Fonction utilitaire pour faire des requêtes HTTP
 */
function makeRequest(url, options, data) {
  const client = url.startsWith('https') ? https : http;
  
  return new Promise((resolve, reject) => {
    const req = client.request(url, options, (res) => {
      let body = '';
      res.on('data', (chunk) => body += chunk);
      res.on('end', () => {
        try {
          const result = {
            status: res.statusCode,
            headers: res.headers,
            body: res.headers['content-type']?.includes('application/json') ? JSON.parse(body) : body
          };
          resolve(result);
        } catch (error) {
          resolve({
            status: res.statusCode,
            headers: res.headers,
            body: body
          });
        }
      });
    });

    req.on('error', reject);
    
    if (data) {
      req.write(typeof data === 'string' ? data : JSON.stringify(data));
    }
    
    req.end();
  });
}

/**
 * Test du formulaire B2B
 */
async function testB2BForm() {
  console.log('\n🔍 Test Formulaire B2B → Odoo');
  console.log('=' .repeat(50));

  const testData = {
    type: 'b2b',
    website: '', // Honeypot
    firstName: 'Jean',
    lastName: 'Dupont',
    email: `test.b2b.${Date.now()}@test.com`,
    phone: '0606060606',
    company: 'Test Company',
    position: 'Directeur',
    eventType: 'seminar',
    eventDate: '2026-06-15',
    guestCount: '50',
    budget: 7500,
    requirements: 'Salle équipée audiovisuel',
    message: 'Test automatisé de l\'intégration Odoo B2B',
    venueId: 'chateau-le-dome',
    acceptPrivacy: true
  };

  try {
    const result = await makeRequest(`${BASE_URL}/api/contact/submit`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'User-Agent': 'Test-Script/1.0'
      }
    }, testData);

    console.log(`📤 Statut: ${result.status}`);
    
    if (result.status === 200 || result.status === 201) {
      console.log('✅ Formulaire B2B soumis avec succès');
      console.log(`📧 Email test: ${testData.email}`);
      if (result.body.leadId) {
        console.log(`🆔 Lead ID: ${result.body.leadId}`);
      }
      if (result.body.odooSyncStatus) {
        console.log(`🔗 Sync Odoo: ${result.body.odooSyncStatus}`);
      }
    } else {
      console.log('❌ Erreur lors de la soumission');
      console.log('Response:', result.body);
    }

  } catch (error) {
    console.log('❌ Erreur réseau:', error.message);
  }
}

/**
 * Test du formulaire Mariage
 */
async function testWeddingForm() {
  console.log('\n💒 Test Formulaire Mariage → Odoo');
  console.log('=' .repeat(50));

  const testData = {
    type: 'mariage',
    website: '', // Honeypot
    firstName: 'Marie',
    lastName: 'Martin', 
    email: `test.wedding.${Date.now()}@test.com`,
    phone: '0707070707',
    bride: {
      firstName: 'Marie',
      lastName: 'Martin'
    },
    groom: {
      firstName: 'Pierre',
      lastName: 'Durand'
    },
    weddingDate: '2026-08-20',
    guestCount: '120',
    budget: 20000,
    message: 'Test automatisé de l\'intégration Odoo Mariage',
    venueId: 'chateau-brulaire',
    acceptPrivacy: true
  };

  try {
    const result = await makeRequest(`${BASE_URL}/api/contact/submit`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'User-Agent': 'Test-Script/1.0'
      }
    }, testData);

    console.log(`📤 Statut: ${result.status}`);
    
    if (result.status === 200 || result.status === 201) {
      console.log('✅ Formulaire Mariage soumis avec succès');
      console.log(`💌 Email test: ${testData.email}`);
      if (result.body.leadId) {
        console.log(`🆔 Lead ID: ${result.body.leadId}`);
      }
      if (result.body.odooSyncStatus) {
        console.log(`🔗 Sync Odoo: ${result.body.odooSyncStatus}`);
      }
    } else {
      console.log('❌ Erreur lors de la soumission');
      console.log('Response:', result.body);
    }

  } catch (error) {
    console.log('❌ Erreur réseau:', error.message);
  }
}

/**
 * Test de la santé de l'API Odoo
 */
async function testOdooHealth() {
  console.log('\n🏥 Test Santé API Odoo');
  console.log('=' .repeat(50));

  try {
    // Test avec un lead fictif pour vérifier la connectivité
    const testData = {
      leadId: 'test-health-check',
      leadData: {
        type: 'b2b',
        firstName: 'Health',
        lastName: 'Check',
        email: 'healthcheck@test.com',
        phone: '0000000000'
      }
    };

    const result = await makeRequest(`${BASE_URL}/api/odoo/sync-lead`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'User-Agent': 'Test-Script/1.0'
      }
    }, testData);

    console.log(`📡 Statut API Odoo: ${result.status}`);
    
    if (result.status === 200) {
      console.log('✅ API Odoo accessible');
    } else if (result.status === 404) {
      console.log('⚠️  Route API Odoo non trouvée');
    } else {
      console.log('⚠️  API Odoo répond avec erreur');
    }
    
    if (result.body) {
      console.log('Réponse:', typeof result.body === 'string' ? result.body.slice(0, 200) : result.body);
    }

  } catch (error) {
    console.log('❌ API Odoo inaccessible:', error.message);
  }
}

/**
 * Script principal
 */
async function main() {
  console.log('🚀 Test de l\'intégration formulaires → Odoo');
  console.log(`🌐 URL de test: ${BASE_URL}`);
  console.log('⏰ ' + new Date().toLocaleString('fr-FR'));
  
  await testOdooHealth();
  await testB2BForm();
  await testWeddingForm();
  
  console.log('\n✨ Tests terminés !');
  console.log('\n📋 Vérifications manuelles suggérées :');
  console.log('1. Vérifier les leads dans Firestore (collection: leads)');
  console.log('2. Vérifier les leads dans Odoo CRM: https://groupe-lr.odoo.com/odoo/crm');
  console.log('3. Vérifier les notifications FCM admin (si configurées)');
  console.log('\n💡 Note: L\'erreur d\'auth Odoo en local est normale (env différent de prod)');
}

// Lancement du script
if (require.main === module) {
  main().catch(console.error);
}