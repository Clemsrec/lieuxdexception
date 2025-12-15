/**
 * Configuration SEO Master Universel - Lieux d'Exception
 * 
 * Système SEO adaptatif pour optimisation Google, Google SGE, ChatGPT, Claude
 * Configuration spécifique : Événementiel corporate et mariages en Loire-Atlantique
 */

// ============================================================================
// TYPES
// ============================================================================

export type SiteType = 'corporate' | 'ecommerce' | 'blog' | 'restaurant' | 'local' | 'saas';
export type PageType = 'homepage' | 'venue' | 'service' | 'contact' | 'about' | 'catalogue';

interface KeywordConfig {
  primary: string[];
  commercial: string[];
  local: string[];
  longTail: string[];
  semantic: string[];
}

type SiteKeywords = {
  [K in SiteType]: KeywordConfig;
};

// ============================================================================
// CONFIGURATION PRINCIPALE
// ============================================================================

export const universalSEOConfig = {
  // Type de site
  siteType: 'corporate' as SiteType,

  // Configuration business Lieux d'Exception
  business: {
    // Expertise et positionnement
    expertise: {
      primary: "Lieux événementiels d'exception et organisation d'événements corporate",
      sectors: ["Mariages haut de gamme", "Séminaires entreprise", "Événements corporate"],
      certifications: ["Collection de 5 domaines d'exception"],
      experience: "Expertise événementielle depuis plus de 25 ans",
      clientsServed: "Des centaines d'événements réussis en Loire-Atlantique"
    },

    // SEO local - Zone géographique
    localSEO: {
      primaryCity: "Loire-Atlantique",
      secondaryCities: ["Nantes", "Angers", "La Baule", "Pornic"],
      region: "Pays de la Loire",
      departments: ["Loire-Atlantique", "Maine-et-Loire"],
      coordinates: {
        lat: 47.2184,
        lng: -1.5536
      }
    },

    // Offres et services
    services: [
      {
        name: "Mariages d'Exception",
        description: "Organisation complète de mariages dans des domaines prestigieux",
        pricing: "Sur devis personnalisé",
        benefits: ["Lieux privatisables", "Accompagnement personnalisé", "Réseau partenaires sélectionnés"]
      },
      {
        name: "Séminaires & Événements B2B",
        description: "Espaces modulables pour séminaires, conférences et team building",
        pricing: "À partir de 5000€/jour",
        benefits: ["Capacité 10-300 personnes", "Équipements professionnels", "Hébergement sur site"]
      },
      {
        name: "Événements Corporate",
        description: "Lancements produits, galas et réceptions d'entreprise",
        pricing: "Sur mesure",
        benefits: ["Privatisation exclusive", "Coordination événement", "Restauration gastronomique"]
      }
    ],

    // Contact et disponibilité
    contact: {
      phone: "+33602037011",
      email: "contact@lieuxdexception.com",
      availability: "Lun-Ven 9h-18h",
      responseTime: "Réponse sous 24h"
    }
  },

  // ============================================================================
  // MOTS-CLÉS PAR TYPE DE SITE
  // ============================================================================

  keywords: {
    corporate: {
      // Mots-clés primaires (volume élevé, compétition moyenne)
      primary: [
        "lieux événementiels Loire-Atlantique",
        "château mariage Pays de la Loire",
        "séminaire entreprise Loire-Atlantique",
        "domaine événementiel Nantes",
        "salle réception mariage 44"
      ],

      // Mots-clés commerciaux (forte intention d'achat)
      commercial: [
        "devis mariage château",
        "réserver lieu événement",
        "contact organisation mariage",
        "tarif séminaire entreprise",
        "disponibilité château mariage"
      ],

      // Mots-clés locaux (SEO proximité)
      local: [
        "château mariage près de Nantes",
        "domaine mariage Loire-Atlantique",
        "lieu réception Pays de la Loire",
        "salle séminaire Nantes",
        "événement corporate Angers"
      ],

      // Longue traîne (faible volume, haute conversion)
      longTail: [
        "meilleur château mariage Loire-Atlantique",
        "domaine privatisable mariage 200 personnes",
        "lieu événement corporate avec hébergement Nantes",
        "château authentique mariage Pays de la Loire",
        "séminaire résidentiel Loire-Atlantique"
      ],

      // Mots-clés sémantiques (contexte et autorité)
      semantic: [
        "organisation mariage clé en main",
        "privatisation domaine événement",
        "réception haut de gamme",
        "événement entreprise sur mesure",
        "coordination événementielle",
        "lieu prestige mariage",
        "domaine d'exception"
      ]
    },

    // Autres types (pour extensibilité future)
    ecommerce: {
      primary: ["boutique", "acheter", "produit"],
      commercial: ["panier", "promo", "livraison"],
      local: ["magasin près de moi"],
      longTail: ["meilleur prix"],
      semantic: ["qualité", "garantie"]
    },

    blog: {
      primary: ["guide", "conseils", "actualités"],
      commercial: ["comparatif", "test"],
      local: ["info locale"],
      longTail: ["comment faire"],
      semantic: ["expertise", "tutoriel"]
    },

    restaurant: {
      primary: ["restaurant", "menu", "réservation"],
      commercial: ["commander", "livraison"],
      local: ["restaurant près de moi"],
      longTail: ["meilleur restaurant"],
      semantic: ["gastronomie", "cuisine"]
    },

    local: {
      primary: ["service", "artisan", "commerce"],
      commercial: ["devis", "contact"],
      local: ["près de moi", "à proximité"],
      longTail: ["meilleur artisan"],
      semantic: ["expertise locale", "qualité"]
    },

    saas: {
      primary: ["logiciel", "application", "plateforme"],
      commercial: ["essai gratuit", "démo"],
      local: ["solution française"],
      longTail: ["meilleur outil"],
      semantic: ["productivité", "automatisation"]
    }
  } as SiteKeywords,

  // ============================================================================
  // OPTIMISATION E-E-A-T (Expertise, Experience, Authoritativeness, Trust)
  // ============================================================================

  ai: {
    // Expertise (Compétence et savoir-faire)
    expertise: {
      domain: "Organisation d'événements et gestion de lieux d'exception",
      credentials: [
        "25+ ans d'expérience événementielle",
        "Collection de 5 domaines historiques classés",
        "Réseau partenaires Premium (traiteurs, décorateurs, photographes)"
      ],
      specializations: [
        "Mariages haut de gamme 50-300 invités",
        "Séminaires résidentiels entreprise",
        "Événements corporate sur mesure"
      ]
    },

    // Experience (Expérience pratique démontrée)
    experience: {
      years: "25+",
      projects: "Des centaines d'événements organisés",
      clientTypes: ["Entreprises CAC40", "PME régionales", "Particuliers exigeants"],
      testimonials: "Avis clients 5 étoiles",
      portfolio: "5 domaines d'exception en Loire-Atlantique"
    },

    // Authoritativeness (Autorité et reconnaissance)
    authoritativeness: {
      officialStatus: "Lieux d'Exception - Référence événementielle Pays de la Loire",
      partnerships: ["Partenaires traiteurs étoilés", "Décorateurs reconnus", "Photographes professionnels"],
      mediaPresence: "Présence médias spécialisés mariage et événementiel",
      awards: "Lieux d'exception reconnus patrimoine local"
    },

    // Trustworthiness (Confiance et transparence)
    trustworthiness: {
      transparency: [
        "Devis personnalisé gratuit",
        "Visite des lieux proposée",
        "Tarifs clairs et détaillés"
      ],
      security: [
        "Assurance événements",
        "Contrats clairs",
        "Garantie annulation"
      ],
      reviews: "Avis clients vérifiés",
      contact: "Réponse rapide sous 24h",
      localPresence: "Équipe locale dédiée Loire-Atlantique"
    }
  },

  // ============================================================================
  // TEMPLATES DE MÉTADONNÉES PAR TYPE DE PAGE
  // ============================================================================

  metaTemplates: {
    homepage: {
      titlePattern: "{business.name} | Lieux événementiels d'exception en {region}",
      descriptionPattern: "Découvrez {business.venues} lieux d'exception en {region} pour vos mariages et événements corporate. {business.experience}. Devis gratuit sous 24h.",
      keywordsFocus: ["primary", "local"]
    },

    venue: {
      titlePattern: "{venue.name} - {venue.type} d'exception | {business.name}",
      descriptionPattern: "{venue.name} en {venue.city}, {region}. {venue.description}. Capacité {venue.capacity} personnes. {venue.features}.",
      keywordsFocus: ["longTail", "local"]
    },

    service: {
      titlePattern: "{service.name} {region} | {business.name}",
      descriptionPattern: "{service.name} en {region}. {service.description}. Expert depuis {business.years}. {service.benefits}.",
      keywordsFocus: ["primary", "commercial"]
    },

    contact: {
      titlePattern: "Contact & Devis Gratuit | {business.name} - {region}",
      descriptionPattern: "Contactez-nous pour votre projet événement en {region}. Devis personnalisé gratuit. Réponse sous 24h. Tél: {contact.phone}.",
      keywordsFocus: ["commercial", "local"]
    },

    about: {
      titlePattern: "À Propos - {business.experience} | {business.name}",
      descriptionPattern: "{business.name}, {business.experience} dans l'événementiel en {region}. {business.expertise}. Découvrez notre histoire.",
      keywordsFocus: ["semantic"]
    },

    catalogue: {
      titlePattern: "Catalogue Lieux d'Exception {region} | {business.name}",
      descriptionPattern: "Parcourez notre sélection de {business.venues} lieux événementiels d'exception en {region}. Châteaux, domaines et espaces privatisables.",
      keywordsFocus: ["primary", "local"]
    }
  },

  // ============================================================================
  // FAQ CONTEXTUELLES PAR TYPE DE PAGE
  // ============================================================================

  faqByPageType: {
    homepage: [
      {
        question: "Quels types d'événements pouvez-vous organiser ?",
        answer: "Nous organisons des mariages haut de gamme (50-300 invités), séminaires d'entreprise, conférences, team building, lancements produits et galas corporate dans nos 5 domaines d'exception en Loire-Atlantique."
      },
      {
        question: "Où se situent vos lieux d'exception ?",
        answer: "Les 5 domaines sont situés en Loire-Atlantique, Pays de la Loire, à proximité de Nantes, Angers et La Baule. Tous nos lieux sont facilement accessibles et offrent des cadres historiques exceptionnels."
      },
      {
        question: "Proposez-vous des prestations tout inclus ?",
        answer: "Oui, nous proposons des formules complètes incluant location du lieu, coordination événement, traiteur, décoration et hébergement sur site. Chaque prestation est personnalisable selon vos besoins."
      }
    ],

    venue: [
      {
        question: "Quelle est la capacité d'accueil du lieu ?",
        answer: "La capacité varie selon la configuration : de 50 à 300 personnes en fonction du type d'événement (cocktail, assis, conférence). Nous adaptons les espaces à votre projet."
      },
      {
        question: "Peut-on privatiser entièrement le domaine ?",
        answer: "Oui, tous nos lieux sont privatisables pour garantir l'exclusivité de votre événement. La privatisation inclut les espaces de réception, jardins et hébergements."
      },
      {
        question: "Quels services sont inclus dans la location ?",
        answer: "La location inclut les espaces de réception, mobilier de base, parkings et accès aux jardins. Services additionnels disponibles : traiteur, décoration, coordination et hébergement."
      }
    ],

    service: [
      {
        question: "Comment se déroule l'organisation d'un événement ?",
        answer: "1) Rendez-vous découverte et visite du lieu, 2) Devis personnalisé gratuit, 3) Coordination avec nos partenaires sélectionnés, 4) Accompagnement jusqu'au jour J. Suivi personnalisé à chaque étape."
      },
      {
        question: "Travaillez-vous avec des prestataires externes ?",
        answer: "Nous avons un réseau de partenaires sélectionnés (traiteurs, décorateurs, photographes) mais vous êtes libre de choisir vos prestataires. Nous coordonnons l'ensemble pour garantir la réussite de votre événement."
      },
      {
        question: "Quels sont vos tarifs ?",
        answer: "Les tarifs varient selon le lieu, la période, le nombre d'invités et les prestations. Location lieux à partir de 5000€/jour. Devis personnalisé gratuit fourni sous 24h après visite."
      }
    ],

    contact: [
      {
        question: "Sous quel délai répondez-vous ?",
        answer: "Nous répondons à toutes les demandes sous 24h maximum. Pour les demandes urgentes, contactez-nous directement au 06 02 03 70 11 (Lun-Ven 9h-18h)."
      },
      {
        question: "Puis-je visiter les lieux avant de réserver ?",
        answer: "Absolument ! Nous proposons des visites sur rendez-vous de tous nos domaines. C'est l'occasion de découvrir les espaces, discuter de votre projet et obtenir un devis personnalisé."
      }
    ],

    about: [
      {
        question: "Quelle est votre expérience dans l'événementiel ?",
        answer: "Nous organisons des événements depuis plus de 25 ans. Nous avons accompagné des centaines d'entreprises et particuliers en Loire-Atlantique pour des événements d'exception."
      },
      {
        question: "Pourquoi choisir Lieux d'Exception ?",
        answer: "Expertise événementielle de 25+ ans, collection de 5 domaines historiques classés, réseau partenaires Premium, accompagnement personnalisé et équipe locale dédiée en Loire-Atlantique."
      }
    ],

    catalogue: [
      {
        question: "Comment choisir le bon lieu pour mon événement ?",
        answer: "Nous vous conseillons selon vos critères : nombre d'invités, type d'événement, budget, période et localisation souhaitée. Contactez-nous pour un accompagnement personnalisé dans votre choix."
      },
      {
        question: "Les lieux sont-ils accessibles toute l'année ?",
        answer: "Oui, nos 5 domaines sont disponibles toute l'année. Certaines périodes (mai-septembre pour mariages) sont très demandées. Nous recommandons de réserver 12-18 mois à l'avance."
      }
    ]
  }
};

// ============================================================================
// EXPORTS
// ============================================================================

export default universalSEOConfig;
