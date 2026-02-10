#!/usr/bin/env node

/**
 * Script de test direct sync Odoo
 * Teste la création de lead via XML-RPC direct
 */

require('dotenv').config({ path: '.env.local' });
const xmlrpc = require('xmlrpc');

const ODOO_CONFIG = {
  url: process.env.ODOO_URL || '',
  db: process.env.ODOO_DB || '',
  username: process.env.ODOO_USERNAME || '',
  apiKey: process.env.ODOO_API_KEY || '',
};

console.log('🔍 Test synchronisation directe Odoo');
console.log('Configuration:', {
  url: ODOO_CONFIG.url,
  db: ODOO_CONFIG.db,
  username: ODOO_CONFIG.username,
  apiKey: ODOO_CONFIG.apiKey ? `***${ODOO_CONFIG.apiKey.slice(-4)}` : 'MANQUANT'
});

/**
 * Authentification Odoo via XML-RPC
 */
async function authenticateOdoo() {
  return new Promise((resolve, reject) => {
    console.log('\n🔐 Authentification Odoo...');
    
    const client = xmlrpc.createClient({
      url: `${ODOO_CONFIG.url}/xmlrpc/2/common`,
      headers: {
        'User-Agent': 'Lieux d\'Exception Test Script',
      },
    });

    client.methodCall(
      'authenticate',
      [ODOO_CONFIG.db, ODOO_CONFIG.username, ODOO_CONFIG.apiKey, {}],
      (error, value) => {
        if (error) {
          console.error('❌ Erreur authentification:', error.message);
          reject(error);
        } else if (!value) {
          console.error('❌ UID vide retourné');
          reject(new Error('Authentification échouée'));
        } else {
          console.log('✅ Authentifié avec UID:', value);
          resolve(value);
        }
      }
    );
  });
}

/**
 * Créer un lead dans Odoo
 */
async function createLead(uid, leadData) {
  return new Promise((resolve, reject) => {
    console.log('\n📝 Création du lead...');
    
    const client = xmlrpc.createClient({
      url: `${ODOO_CONFIG.url}/xmlrpc/2/object`,
      headers: {
        'User-Agent': 'Lieux d\'Exception Test Script',
      },
    });

    client.methodCall(
      'execute_kw',
      [
        ODOO_CONFIG.db,
        uid,
        ODOO_CONFIG.apiKey,
        'crm.lead',
        'create',
        [leadData],
      ],
      (error, value) => {
        if (error) {
          console.error('❌ Erreur création lead:', error.message);
          reject(error);
        } else {
          console.log('✅ Lead créé avec ID:', value);
          resolve(value);
        }
      }
    );
  });
}

async function testDirectSync() {
  try {
    const uid = await authenticateOdoo();
    
    const testLead = {
      name: `Test Direct Sync - ${new Date().toLocaleString('fr-FR')}`,
      contact_name: 'Test DirectSync',
      email_from: `test.direct.${Date.now()}@lieuxdexception.com`,
      phone: '0606060606',
      description: `Test de synchronisation directe via script
      
Date: ${new Date().toLocaleString('fr-FR')}
Source: Script de test direct
Type: Test technique`,
      priority: '1',
      type: 'opportunity',
      referred: 'Test Script Direct'
    };

    const leadId = await createLead(uid, testLead);
    
    console.log(`\n🎉 Succès ! Lead créé avec ID: ${leadId}`);
    console.log(`🔗 URL Odoo: ${ODOO_CONFIG.url}/web#id=${leadId}&model=crm.lead`);
    
  } catch (error) {
    console.error('\n❌ Échec du test:', error.message);
  }
}

testDirectSync();