const admin = require('firebase-admin');
const serviceAccount = require('../firebase-service-account.json');

if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    databaseURL: 'https://lieux-d-exceptions.firebaseio.com'
  });
}

const db = admin.firestore();

async function analyzeVenueStructure() {
  console.log('📊 ANALYSE COMPLÈTE DE LA STRUCTURE VENUES\n');
  console.log('='.repeat(80));
  
  try {
    const snapshot = await db.collection('venues').get();
    
    // Collecter tous les champs uniques
    const allFields = new Set();
    const fieldExamples = {};
    const fieldTypes = {};
    const fieldFrequency = {};
    
    snapshot.forEach(doc => {
      const data = doc.data();
      
      function traverseObject(obj, prefix = '') {
        Object.keys(obj).forEach(key => {
          const fullKey = prefix ? `${prefix}.${key}` : key;
          const value = obj[key];
          
          allFields.add(fullKey);
          
          // Compter la fréquence
          fieldFrequency[fullKey] = (fieldFrequency[fullKey] || 0) + 1;
          
          // Stocker un exemple
          if (!fieldExamples[fullKey]) {
            fieldExamples[fullKey] = value;
          }
          
          // Déterminer le type
          if (!fieldTypes[fullKey]) {
            if (Array.isArray(value)) {
              fieldTypes[fullKey] = 'Array';
              if (value.length > 0) {
                const firstItem = value[0];
                if (typeof firstItem === 'object') {
                  fieldTypes[fullKey] += ' of Objects';
                  // Analyser les champs des objets dans le tableau
                  traverseObject(firstItem, `${fullKey}[0]`);
                } else {
                  fieldTypes[fullKey] += ` of ${typeof firstItem}`;
                }
              }
            } else if (value && typeof value === 'object' && value.constructor.name === 'Timestamp') {
              fieldTypes[fullKey] = 'Timestamp';
            } else if (value && typeof value === 'object') {
              fieldTypes[fullKey] = 'Object';
              traverseObject(value, fullKey);
            } else {
              fieldTypes[fullKey] = typeof value;
            }
          }
        });
      }
      
      traverseObject(data);
    });
    
    // Organiser les champs par catégorie
    const categories = {
      'Informations de base': [],
      'Localisation': [],
      'Capacités': [],
      'Tarification': [],
      'Images': [],
      'SEO': [],
      'Services et équipements': [],
      'Contacts': [],
      'Réseaux sociaux': [],
      'Horaires': [],
      'Métadonnées système': [],
      'Autres': []
    };
    
    Array.from(allFields).sort().forEach(field => {
      const freq = fieldFrequency[field];
      const total = snapshot.size;
      const percentage = ((freq / total) * 100).toFixed(0);
      
      const fieldInfo = {
        field,
        type: fieldTypes[field],
        frequency: `${freq}/${total} (${percentage}%)`,
        example: fieldExamples[field]
      };
      
      // Catégoriser
      if (field.match(/^(name|slug|tagline|description|shortDescription|experienceText)$/)) {
        categories['Informations de base'].push(fieldInfo);
      } else if (field.match(/^(location|region|address|coordinates|geo)/)) {
        categories['Localisation'].push(fieldInfo);
      } else if (field.match(/^(capacity|capacityMin|capacityMax|guestCapacity)/)) {
        categories['Capacités'].push(fieldInfo);
      } else if (field.match(/^(pricing|price|tarif)/)) {
        categories['Tarification'].push(fieldInfo);
      } else if (field.match(/^(images|photos|gallery|hero|cardImage)/)) {
        categories['Images'].push(fieldInfo);
      } else if (field.match(/^(seo|meta)/)) {
        categories['SEO'].push(fieldInfo);
      } else if (field.match(/^(services|amenities|features|equipment|facilities)/)) {
        categories['Services et équipements'].push(fieldInfo);
      } else if (field.match(/^(contact|email|phone|tel)/)) {
        categories['Contacts'].push(fieldInfo);
      } else if (field.match(/^(social|facebook|instagram|linkedin)/)) {
        categories['Réseaux sociaux'].push(fieldInfo);
      } else if (field.match(/^(hours|openingHours|schedule)/)) {
        categories['Horaires'].push(fieldInfo);
      } else if (field.match(/^(createdAt|updatedAt|active|featured|deleted|displayOrder)/)) {
        categories['Métadonnées système'].push(fieldInfo);
      } else {
        categories['Autres'].push(fieldInfo);
      }
    });
    
    // Afficher par catégorie
    Object.entries(categories).forEach(([category, fields]) => {
      if (fields.length > 0) {
        console.log(`\n📁 ${category.toUpperCase()}`);
        console.log('-'.repeat(80));
        fields.forEach(({ field, type, frequency, example }) => {
          console.log(`\n  ${field}`);
          console.log(`    Type:      ${type}`);
          console.log(`    Fréquence: ${frequency}`);
          
          let exampleStr = JSON.stringify(example);
          if (exampleStr.length > 100) {
            exampleStr = exampleStr.substring(0, 100) + '...';
          }
          console.log(`    Exemple:   ${exampleStr}`);
        });
      }
    });
    
    console.log('\n' + '='.repeat(80));
    console.log(`\n✅ Total de ${allFields.size} champs uniques trouvés dans ${snapshot.size} lieux`);
    
  } catch (error) {
    console.error('❌ Erreur:', error.message);
  }
  
  process.exit(0);
}

analyzeVenueStructure();
