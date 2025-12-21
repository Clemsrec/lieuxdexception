#!/usr/bin/env node

/**
 * Script de debug approfondi de l'authentification Odoo
 * Teste différentes variantes pour identifier le problème exact
 */

const xmlrpc = require('xmlrpc');
require('dotenv').config({ path: '.env.local' });

const config = {
  url: process.env.ODOO_URL,
  db: process.env.ODOO_DB,
  username: process.env.ODOO_USERNAME,
  apiKey: process.env.ODOO_API_KEY,
};

console.log('🔍 Debug authentification Odoo\n');
console.log('Configuration:');
console.log(`  URL: ${config.url}`);
console.log(`  DB: ${config.db}`);
console.log(`  Username: ${config.username}`);
console.log(`  API Key length: ${config.apiKey?.length || 0} caractères`);
console.log(`  API Key preview: ${config.apiKey?.substring(0, 10)}...${config.apiKey?.slice(-4)}`);
console.log('');

/**
 * Test 1 : Version Odoo
 */
async function testVersion() {
  return new Promise((resolve, reject) => {
    console.log('1️⃣ Test de la version Odoo...');
    
    const client = xmlrpc.createClient({
      url: `${config.url}/xmlrpc/2/common`,
    });

    client.methodCall('version', [], (error, result) => {
      if (error) {
        console.error('❌ Erreur:', error.message);
        reject(error);
      } else {
        console.log('✅ Version Odoo:', JSON.stringify(result, null, 2));
        console.log('');
        resolve(result);
      }
    });
  });
}

/**
 * Test 2 : Authentification détaillée
 */
async function testAuthenticate() {
  return new Promise((resolve, reject) => {
    console.log('2️⃣ Test d\'authentification détaillé...');
    console.log(`   Paramètres: [${config.db}, ${config.username}, <apiKey>, {}]`);
    
    const client = xmlrpc.createClient({
      url: `${config.url}/xmlrpc/2/common`,
    });

    const startTime = Date.now();
    
    client.methodCall(
      'authenticate',
      [config.db, config.username, config.apiKey, {}],
      (error, uid) => {
        const duration = Date.now() - startTime;
        
        console.log(`   Durée: ${duration}ms`);
        console.log(`   Type de réponse: ${typeof uid}`);
        console.log(`   Valeur brute: ${JSON.stringify(uid)}`);
        console.log(`   Valeur === false: ${uid === false}`);
        console.log(`   Valeur === 0: ${uid === 0}`);
        console.log(`   Valeur === null: ${uid === null}`);
        console.log(`   !uid: ${!uid}`);
        
        if (error) {
          console.error('❌ Erreur:', {
            message: error.message,
            code: error.code,
            faultCode: error.faultCode,
            faultString: error.faultString,
          });
          reject(error);
        } else if (uid === false) {
          console.error('❌ Authentification retourne false');
          console.error('   → Email ou mot de passe/clé API incorrect');
          reject(new Error('Authentification refusée (false)'));
        } else if (!uid || uid === 0) {
          console.error('❌ Authentification retourne 0 ou null');
          console.error('   → Vérifiez le nom de la base de données');
          reject(new Error('UID invalide'));
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
 * Test 3 : Vérifier l'accès utilisateur
 */
async function testUserAccess(uid) {
  return new Promise((resolve, reject) => {
    console.log('3️⃣ Test des informations utilisateur...');
    
    const client = xmlrpc.createClient({
      url: `${config.url}/xmlrpc/2/object`,
    });

    client.methodCall(
      'execute_kw',
      [
        config.db,
        uid,
        config.apiKey,
        'res.users',
        'read',
        [[uid]],
        { fields: ['name', 'login', 'groups_id'] },
      ],
      (error, userInfo) => {
        if (error) {
          console.error('❌ Erreur lecture utilisateur:', error.message);
          reject(error);
        } else {
          console.log('✅ Informations utilisateur:', JSON.stringify(userInfo, null, 2));
          console.log('');
          resolve(userInfo);
        }
      }
    );
  });
}

/**
 * Test 4 : Vérifier les droits CRM
 */
async function testCRMAccess(uid) {
  return new Promise((resolve, reject) => {
    console.log('4️⃣ Test des droits d\'accès au CRM...');
    
    const client = xmlrpc.createClient({
      url: `${config.url}/xmlrpc/2/object`,
    });

    client.methodCall(
      'execute_kw',
      [
        config.db,
        uid,
        config.apiKey,
        'crm.lead',
        'check_access_rights',
        ['create'],
        { raise_exception: false },
      ],
      (error, hasAccess) => {
        if (error) {
          console.error('❌ Erreur vérification droits:', error.message);
          reject(error);
        } else if (hasAccess) {
          console.log('✅ L\'utilisateur peut créer des leads CRM');
          console.log('');
          resolve(true);
        } else {
          console.warn('⚠️ L\'utilisateur n\'a PAS le droit de créer des leads');
          console.log('');
          resolve(false);
        }
      }
    );
  });
}

/**
 * Exécution
 */
async function main() {
  try {
    // Test version
    await testVersion();

    // Test authentification
    const uid = await testAuthenticate();

    // Test info utilisateur
    await testUserAccess(uid);

    // Test droits CRM
    await testCRMAccess(uid);

    console.log('✅ Tous les tests ont réussi !');
    console.log('');
    console.log('🎉 La connexion Odoo fonctionne parfaitement !');
    console.log('   Vous pouvez maintenant tester la création de leads depuis le formulaire.');

  } catch (error) {
    console.error('\n❌ Test échoué');
    console.error('');
    console.error('📋 Points à vérifier:');
    console.error('  1. Nom de la base de données (essayez: groupe-lr, groupe-lr-main, groupe_lr)');
    console.error('  2. Email utilisateur exact (espaces, majuscules)');
    console.error('  3. Clé API régénérée récemment (< 24h)');
    console.error('  4. Type d\'utilisateur (doit être "Utilisateur interne", pas "Portail")');
    console.error('  5. Droits CRM activés pour cet utilisateur');
    process.exit(1);
  }
}

main();
