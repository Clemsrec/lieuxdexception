/**
 * Script pour ajouter les clés manquantes Weddings.gallery et viewVenues
 */
const fs = require('fs');
const path = require('path');

const translations = {
  en: {
    viewVenues: "View our venues",
    gallery: {
      title: "Places that tell your story",
      subtitle: "Discover our exceptional estates, stages for your most beautiful memories"
    }
  },
  es: {
    viewVenues: "Ver nuestros lugares",
    gallery: {
      title: "Lugares que cuentan tu historia",
      subtitle: "Descubre nuestros dominios de excepción, escenarios de tus más bellos recuerdos"
    }
  },
  de: {
    viewVenues: "Unsere Locations ansehen",
    gallery: {
      title: "Orte, die Ihre Geschichte erzählen",
      subtitle: "Entdecken Sie unsere außergewöhnlichen Anwesen, Bühnen für Ihre schönsten Erinnerungen"
    }
  },
  it: {
    viewVenues: "Vedi le nostre location",
    gallery: {
      title: "Luoghi che raccontano la tua storia",
      subtitle: "Scopri i nostri domini d'eccezione, palcoscenici dei tuoi ricordi più belli"
    }
  },
  pt: {
    viewVenues: "Ver nossos locais",
    gallery: {
      title: "Lugares que contam a sua história",
      subtitle: "Descubra os nossos domínios de exceção, palcos das suas memórias mais bonitas"
    }
  }
};

function addWeddingsGallery(locale) {
  const filePath = path.join(__dirname, '..', 'messages', `${locale}.json`);
  
  try {
    // Lire le fichier
    const content = fs.readFileSync(filePath, 'utf8');
    const data = JSON.parse(content);
    
    // Ajouter les clés manquantes
    if (data.Weddings) {
      data.Weddings.viewVenues = translations[locale].viewVenues;
      data.Weddings.gallery = translations[locale].gallery;
    }
    
    // Écrire le fichier avec indentation
    fs.writeFileSync(filePath, JSON.stringify(data, null, 2), 'utf8');
    console.log(`✅ ${locale}.json enrichi`);
  } catch (error) {
    console.error(`❌ Erreur pour ${locale}:`, error.message);
  }
}

// Enrichir les 5 langues (pas FR, déjà fait manuellement)
['en', 'es', 'de', 'it', 'pt'].forEach(addWeddingsGallery);

console.log('🎉 Toutes les traductions ont été enrichies !');
