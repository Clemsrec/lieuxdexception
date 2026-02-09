#!/usr/bin/env node

/**
 * Script de diagnostic Odoo - Test authentification directe
 * Usage: node scripts/test-odoo-auth.js
 */

const xmlrpc = require('xmlrpc');
require('dotenv').config({ path: '.env.local' });

// Configuration depuis .env.local
const ODOO_CONFIG = {
  url: process.env.ODOO_URL || '',
  db: process.env.ODOO_DB || '',
  username: process.env.ODOO_USERNAME || '',
  apiKey: process.env.ODOO_API_KEY || '',
};

console.log('🔍 Configuration Odoo détectée:');
console.log('- URL:', ODOO_CONFIG.url);
console.log('- DB:', ODOO_CONFIG.db);
console.log('- Username:', ODOO_CONFIG.username);
console.log('- API Key:', ODOO_CONFIG.apiKey ? `${ODOO_CONFIG.apiKey.substring(0, 10)}...` : 'NON CONFIGURÉE');

if (!ODOO_CONFIG.url || !ODOO_CONFIG.db || !ODOO_CONFIG.username || !ODOO_CONFIG.apiKey) {
  console.error('❌ Configuration Odoo incomplète dans .env.local');
  process.exit(1);
}

/**
 * Test d'authentification directe Odoo
 */
async function testOdooAuth() {
  console.log('\n🔐 Test authentification Odoo XML-RPC...');
  
  return new Promise((resolve, reject) => {
    const url = `${ODOO_CONFIG.url}/xmlrpc/2/common`;
    console.log('📡 URL d\'authentification:', url);

    const client = xmlrpc.createClient({
      url,
      headers: {
        'User-Agent': 'Lieux d\'Exception Test Script',
      },
    });

    const startTime = Date.now();
    
    client.methodCall(
      'authenticate',
      [ODOO_CONFIG.db, ODOO_CONFIG.username, ODOO_CONFIG.apiKey, {}],
      (error, value) => {
        const duration = Date.now() - startTime;
        
        if (error) {
          console.error(`❌ Erreur authentification (${duration}ms):`, {
            message: error.message,
            code: error.code,
            faultString: error.faultString,
          });
          reject(error);
        } else if (!value) {
          console.error(`❌ Authentification refusée (${duration}ms): credentials invalides`);
          reject(new Error('Invalid credentials'));
        } else {
          console.log(`✅ Authentification réussie (${duration}ms)!`);
          console.log('👤 User ID Odoo:', value);
          resolve(value);
        }
      }
    );
  });
}

/**
 * Test de création d'un lead simple
 */
async function testCreateLead(uid) {
  console.log('\n📋 Test création lead Odoo...');
  
  return new Promise((resolve, reject) => {
    const url = `${ODOO_CONFIG.url}/xmlrpc/2/object`;
    const client = xmlrpc.createClient({ url });

    const testLead = {
      name: `Test Lead - ${new Date().toLocaleString('fr-FR')}`,
      contact_name: 'Test Contact',
      email_from: 'test@example.com',
      phone: '0123456789',
      description: 'Lead de test créé par script de diagnostic',
      type: 'opportunity',
    };

    const startTime = Date.now();

    client.methodCall(
      'execute_kw',
      [
        ODOO_CONFIG.db,
        uid,
        ODOO_CONFIG.apiKey,
        'crm.lead',
        'create',
        [testLead]
      ],
      (error, leadId) => {
        const duration = Date.now() - startTime;
        
        if (error) {
          console.error(`❌ Erreur création lead (${duration}ms):`, {
            message: error.message,
            code: error.code,
            faultString: error.faultString,
          });
          reject(error);
        } else {
          console.log(`✅ Lead créé avec succès (${duration}ms)!`);
          console.log('🆔 Lead ID:', leadId);
          console.log('🔗 Vérifiez dans Odoo:', `${ODOO_CONFIG.url}/web#id=${leadId}&cids=1&menu_id=188&model=crm.lead&view_type=form`);
          resolve(leadId);
        }
      }
    );
  });
}

/**
 * Script principal
 */
async function main() {
  console.log('🚀 Diagnostic authentification Odoo');
  console.log('⏰', new Date().toLocaleString('fr-FR'));
  
  try {
    // Test d'authentification
    const uid = await testOdooAuth();
    
    // Test de création de lead
    await testCreateLead(uid);
    
    console.log('\n✅ Tous les tests Odoo ont réussi !');
    console.log('💡 Si vous ne voyez pas de leads, vérifiez les droits utilisateur dans Odoo');
    
  } catch (error) {
    console.error('\n❌ Échec des tests Odoo:', error.message);
    console.log('\n🔧 Solutions possibles:');
    console.log('1. Vérifiez les credentials dans .env.local');
    console.log('2. Vérifiez que l\'utilisateur a les droits sur CRM');
    console.log('3. Vérifiez que la clé API est activée dans Odoo');
    console.log('4. Testez la connexion réseau vers', ODOO_CONFIG.url);
  }
}

// Lancement
if (require.main === module) {
  main().catch(console.error);
}