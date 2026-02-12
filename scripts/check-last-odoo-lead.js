#!/usr/bin/env node

/**
 * Script pour vérifier le dernier lead créé dans Odoo
 * Affiche les détails incluant les lieux sélectionnés
 */

require('dotenv').config({ path: '.env.local' });
const xmlrpc = require('xmlrpc');

async function checkLastOdooLead() {
  const url = process.env.ODOO_URL || 'https://groupe-lr.odoo.com';
  const db = process.env.ODOO_DB || 'groupe-lr';
  const username = process.env.ODOO_USERNAME || 'domainenantais@gmail.com';
  const password = process.env.ODOO_API_KEY;

  if (!password) {
    console.error('❌ ODOO_API_KEY manquant dans .env.local');
    process.exit(1);
  }

  console.log('🔐 Connexion à Odoo...');
  console.log(`   URL: ${url}`);
  console.log(`   DB: ${db}`);
  console.log(`   User: ${username}`);

  try {
    // 1. Authentification
    const commonClient = xmlrpc.createSecureClient({ url: `${url}/xmlrpc/2/common` });
    const uid = await new Promise((resolve, reject) => {
      commonClient.methodCall('authenticate', [db, username, password, {}], (err, uid) => {
        if (err) reject(err);
        else resolve(uid);
      });
    });

    if (!uid) {
      console.error('❌ Authentification échouée');
      process.exit(1);
    }

    console.log(`✅ Authentification réussie, UID: ${uid}\n`);

    // 2. Récupérer le dernier lead créé
    const modelsClient = xmlrpc.createSecureClient({ url: `${url}/xmlrpc/2/object` });
    
    console.log('🔍 Recherche du dernier lead créé...');
    const leadIds = await new Promise((resolve, reject) => {
      modelsClient.methodCall('execute_kw', [
        db,
        uid,
        password,
        'crm.lead',
        'search',
        [[]],
        { 
          limit: 1,
          order: 'id desc'
        }
      ], (err, result) => {
        if (err) reject(err);
        else resolve(result);
      });
    });

    if (!leadIds || leadIds.length === 0) {
      console.log('❌ Aucun lead trouvé');
      process.exit(0);
    }

    console.log(`📋 Lead ID trouvé: ${leadIds[0]}\n`);

    // 3. Récupérer les détails du lead
    const leads = await new Promise((resolve, reject) => {
      modelsClient.methodCall('execute_kw', [
        db,
        uid,
        password,
        'crm.lead',
        'read',
        [leadIds],
        { 
          fields: [
            'id',
            'name',
            'contact_name',
            'email_from',
            'phone',
            'mobile',
            'description',
            'type',
            'create_date',
            'partner_name',
            'tag_ids'
          ]
        }
      ], (err, result) => {
        if (err) reject(err);
        else resolve(result);
      });
    });

    if (!leads || leads.length === 0) {
      console.log('❌ Impossible de récupérer les détails du lead');
      process.exit(1);
    }

    const lead = leads[0];
    
    // 4. Récupérer les noms des tags si présents
    let tagNames = [];
    if (lead.tag_ids && lead.tag_ids.length > 0) {
      const tags = await new Promise((resolve, reject) => {
        modelsClient.methodCall('execute_kw', [
          db,
          uid,
          password,
          'crm.tag',
          'read',
          [lead.tag_ids],
          { fields: ['name'] }
        ], (err, result) => {
          if (err) reject(err);
          else resolve(result);
        });
      });
      tagNames = tags.map(tag => tag.name);
    }
    
    console.log('═══════════════════════════════════════════════════');
    console.log(`📌 LEAD ID: ${lead.id}`);
    console.log('═══════════════════════════════════════════════════');
    console.log(`Titre: ${lead.name}`);
    console.log(`Type: ${lead.type || 'N/A'}`);
    console.log(`Contact: ${lead.contact_name || 'N/A'}`);
    console.log(`Email: ${lead.email_from || 'N/A'}`);
    console.log(`Téléphone fixe: ${lead.phone || 'N/A'}`);
    console.log(`Mobile: ${lead.mobile || 'N/A'}`);
    console.log(`Société: ${lead.partner_name || 'N/A'}`);
    console.log(`Date création: ${lead.create_date || 'N/A'}`);
    if (tagNames.length > 0) {
      console.log(`Tags: ${tagNames.join(', ')}`);
    } else {
      console.log(`Tags: Aucun`);
    }
    console.log('───────────────────────────────────────────────────');
    console.log('DESCRIPTION:');
    console.log(lead.description || '(vide)');
    console.log('═══════════════════════════════════════════════════');

    // 4. Vérifier si les lieux sont présents
    if (lead.description && lead.description.includes('Lieux sélectionnés:')) {
      console.log('\n✅ Les lieux sélectionnés sont bien présents dans Odoo !');
    } else {
      console.log('\n⚠️  Les lieux sélectionnés ne sont pas présents dans la description');
    }

  } catch (error) {
    console.error('❌ Erreur:', error.message);
    process.exit(1);
  }
}

checkLastOdooLead().catch(console.error);
