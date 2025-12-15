/**
 * Script pour enrichir les traductions ES, DE, IT, PT
 * Copie la structure enrichie depuis FR puis traduit
 */

const fs = require('fs');
const path = require('path');

// Traductions enrichies pour ES, DE, IT, PT
const translations = {
  es: {
    Home: {
      title: "Lugares Excepcionales",
      subtitle: "La clave de sus momentos únicos",
      description: "Fincas donde se mezclan belleza, sinceridad y el arte de recibir",
      philosophy: "Una aventura nacida de lugares y pasión",
      signature: "Porque la emoción se vive plenamente cuando encuentra su Lugar Excepcional",
      discoverButton: "Descubrir nuestros lugares",
      contactButton: "Contáctenos",
      exceptionalVenues: "Lugares excepcionales"
    },
    B2B: {
      title: "Eventos Corporativos",
      hero: "¿Y si sus eventos profesionales se volvieran... simplemente excepcionales?",
      description: "Ubicados en Loire-Atlantique, transformamos cada momento empresarial en una experiencia rara, memorable y profundamente impactante.",
      requestQuote: "Solicitar presupuesto",
      viewCatalog: "Ver catálogo",
      gallery: {
        title: "Espacios pensados para sus eventos",
        subtitle: "Salas modulables, espacios de relajación, entorno inspirador",
        seminarRoom: "Sala de seminarios",
        receptionSpace: "Espacio de recepción",
        conferenceRoom: "Sala de conferencias",
        modernSpace: "Espacio moderno"
      },
      offer: {
        title: "Lo que le ofrecemos",
        pillar1: {
          title: "Una emoción de despertar",
          description: "Porque un seminario, lanzamiento de producto o comité de dirección nunca debería dejar indiferente. Cada lugar está diseñado como soporte de su mensaje y la experiencia que desea crear. Se convierte en una palanca estratégica para reforzar el impacto de sus eventos y fomentar una conexión emocional genuina."
        },
        pillar2: {
          title: "Un servicio de excelencia",
          description: "Verdadero apoyo operacional para empresas, nuestro acompañamiento es a medida: experiencia de más de 20 años en hospitalidad y servicio de eventos, un equipo dedicado para orquestar cada detalle, servicios premium (alojamiento, catering, animaciones) y una reactividad inquebrantable."
        },
        pillar3: {
          title: "Lugares excepcionales",
          description: "Entornos cuidadosamente seleccionados para inspirar, reunir y federar a sus equipos. Arquitectura notable, entornos naturales preservados, equipamiento moderno: nuestras fincas combinan encanto y funcionalidad para satisfacer todas sus exigencias profesionales."
        }
      }
    },
    Weddings: {
      title: "Bodas Excepcionales",
      hero: "Porque la emoción se vive plenamente...",
      description: "Celebre su unión en nuestras fincas prestigiosas. Organización completa y acompañamiento personalizado para un día único.",
      requestInfo: "Solicitar información",
      service1: "Reuniones personalizadas",
      service2: "Organización y Coordinación",
      service3: "Red de socios",
      service4: "Disponibilidad exclusiva"
    }
  },
  de: {
    Home: {
      title: "Außergewöhnliche Locations",
      subtitle: "Der Schlüssel zu Ihren einzigartigen Momenten",
      description: "Anwesen, wo Schönheit, Aufrichtigkeit und die Kunst der Gastfreundschaft sich vermischen",
      philosophy: "Ein Abenteuer geboren aus Orten & Leidenschaft",
      signature: "Weil Emotionen voll erlebt werden, wenn sie ihren außergewöhnlichen Ort finden",
      discoverButton: "Entdecken Sie unsere Locations",
      contactButton: "Kontaktieren Sie uns",
      exceptionalVenues: "Außergewöhnliche Locations"
    },
    B2B: {
      title: "Firmenveranstaltungen",
      hero: "Was wäre, wenn Ihre Firmenveranstaltungen... einfach außergewöhnlich würden?",
      description: "In Loire-Atlantique ansässig, verwandeln wir jeden Unternehmensmoment in ein seltenes, unvergessliches und tiefgreifend prägendes Erlebnis.",
      requestQuote: "Angebot anfordern",
      viewCatalog: "Katalog ansehen",
      gallery: {
        title: "Räume für Ihre Veranstaltungen konzipiert",
        subtitle: "Flexible Räume, Entspannungsbereiche, inspirierende Umgebung",
        seminarRoom: "Seminarraum",
        receptionSpace: "Empfangsbereich",
        conferenceRoom: "Konferenzraum",
        modernSpace: "Moderner Raum"
      },
      offer: {
        title: "Was wir Ihnen bieten",
        pillar1: {
          title: "Eine erweckende Emotion",
          description: "Denn ein Seminar, eine Produkteinführung oder ein Vorstandskomitee sollte niemals gleichgültig lassen. Jeder Ort ist als Unterstützung für Ihre Botschaft und das Erlebnis konzipiert, das Sie schaffen möchten. Er wird zu einem strategischen Hebel, um die Wirkung Ihrer Veranstaltungen zu verstärken und eine echte emotionale Verbindung zu fördern."
        },
        pillar2: {
          title: "Exzellenter Service",
          description: "Echte operative Unterstützung für Unternehmen, unsere Begleitung ist maßgeschneidert: Expertise von über 20 Jahren in Event-Gastfreundschaft und -Service, ein engagiertes Team zur Orchestrierung jedes Details, Premium-Dienstleistungen (Unterkunft, Catering, Entertainment) und unerschütterliche Reaktionsfähigkeit."
        },
        pillar3: {
          title: "Außergewöhnliche Locations",
          description: "Sorgfältig ausgewählte Umgebungen, um Ihre Teams zu inspirieren, zu versammeln und zu vereinen. Bemerkenswerte Architektur, geschützte natürliche Umgebungen, moderne Ausstattung: Unsere Anwesen vereinen Charme und Funktionalität, um all Ihren professionellen Anforderungen gerecht zu werden."
        }
      }
    },
    Weddings: {
      title: "Außergewöhnliche Hochzeiten",
      hero: "Weil Emotion voll erlebt wird...",
      description: "Feiern Sie Ihre Verbindung in unseren prestigeträchtigen Anwesen. Vollständige Organisation und personalisierte Begleitung für einen einzigartigen Tag.",
      requestInfo: "Informationen anfordern",
      service1: "Persönliche Treffen",
      service2: "Organisation & Koordination",
      service3: "Partner-Netzwerk",
      service4: "Exklusive Verfügbarkeit"
    }
  },
  it: {
    Home: {
      title: "Luoghi Eccezionali",
      subtitle: "La chiave dei vostri momenti unici",
      description: "Tenute dove si mescolano bellezza, sincerità e l'arte dell'accoglienza",
      philosophy: "Un'avventura nata da luoghi e passione",
      signature: "Perché l'emozione si vive pienamente quando trova il suo Luogo Eccezionale",
      discoverButton: "Scopri i nostri luoghi",
      contactButton: "Contattaci",
      exceptionalVenues: "Luoghi eccezionali"
    },
    B2B: {
      title: "Eventi Aziendali",
      hero: "E se i vostri eventi professionali diventassero... semplicemente eccezionali?",
      description: "Con sede in Loire-Atlantique, trasformiamo ogni momento aziendale in un'esperienza rara, memorabile e profondamente impattante.",
      requestQuote: "Richiedi preventivo",
      viewCatalog: "Visualizza catalogo",
      gallery: {
        title: "Spazi pensati per i vostri eventi",
        subtitle: "Sale modulabili, spazi relax, ambiente ispirante",
        seminarRoom: "Sala seminari",
        receptionSpace: "Spazio ricevimenti",
        conferenceRoom: "Sala conferenze",
        modernSpace: "Spazio moderno"
      },
      offer: {
        title: "Cosa vi offriamo",
        pillar1: {
          title: "Un'emozione risvegliante",
          description: "Perché un seminario, un lancio di prodotto o un comitato direttivo non dovrebbero mai lasciare indifferenti. Ogni luogo è concepito come supporto al vostro messaggio e all'esperienza che desiderate creare. Diventa una leva strategica per rafforzare l'impatto dei vostri eventi e favorire una connessione emotiva genuina."
        },
        pillar2: {
          title: "Un servizio di eccellenza",
          description: "Vero supporto operativo per le aziende, il nostro accompagnamento è su misura: esperienza di oltre 20 anni nell'ospitalità e servizio eventi, un team dedicato per orchestrare ogni dettaglio, servizi premium (alloggio, catering, intrattenimento) e una reattività incrollabile."
        },
        pillar3: {
          title: "Luoghi eccezionali",
          description: "Ambienti accuratamente selezionati per ispirare, riunire e federare i vostri team. Architettura notevole, contesti naturali preservati, attrezzature moderne: le nostre tenute combinano fascino e funzionalità per soddisfare tutte le vostre esigenze professionali."
        }
      }
    },
    Weddings: {
      title: "Matrimoni Eccezionali",
      hero: "Perché l'emozione si vive pienamente...",
      description: "Celebrate la vostra unione nelle nostre tenute prestigiose. Organizzazione completa e accompagnamento personalizzato per un giorno unico.",
      requestInfo: "Richiedi informazioni",
      service1: "Incontri personalizzati",
      service2: "Organizzazione e Coordinamento",
      service3: "Rete di partner",
      service4: "Disponibilità esclusiva"
    }
  },
  pt: {
    Home: {
      title: "Lugares Excepcionais",
      subtitle: "A chave dos seus momentos únicos",
      description: "Propriedades onde se misturam beleza, sinceridade e a arte de receber",
      philosophy: "Uma aventura nascida de lugares e paixão",
      signature: "Porque a emoção é vivida plenamente quando encontra o seu Lugar Excepcional",
      discoverButton: "Descobrir nossos lugares",
      contactButton: "Contacte-nos",
      exceptionalVenues: "Lugares excepcionais"
    },
    B2B: {
      title: "Eventos Corporativos",
      hero: "E se os seus eventos profissionais se tornassem... simplesmente excepcionais?",
      description: "Localizados em Loire-Atlantique, transformamos cada momento empresarial numa experiência rara, memorável e profundamente impactante.",
      requestQuote: "Solicitar orçamento",
      viewCatalog: "Ver catálogo",
      gallery: {
        title: "Espaços pensados para os seus eventos",
        subtitle: "Salas moduláveis, espaços de relaxamento, ambiente inspirador",
        seminarRoom: "Sala de seminários",
        receptionSpace: "Espaço de recepção",
        conferenceRoom: "Sala de conferências",
        modernSpace: "Espaço moderno"
      },
      offer: {
        title: "O que lhe oferecemos",
        pillar1: {
          title: "Uma emoção despertante",
          description: "Porque um seminário, lançamento de produto ou comité de direção nunca deveria deixar indiferente. Cada lugar é concebido como suporte da sua mensagem e da experiência que deseja criar. Torna-se uma alavanca estratégica para reforçar o impacto dos seus eventos e fomentar uma conexão emocional genuína."
        },
        pillar2: {
          title: "Um serviço de excelência",
          description: "Verdadeiro apoio operacional para empresas, o nosso acompanhamento é à medida: experiência de mais de 20 anos em hospitalidade e serviço de eventos, uma equipa dedicada para orquestrar cada detalhe, serviços premium (alojamento, catering, animações) e uma reatividade inabalável."
        },
        pillar3: {
          title: "Lugares excepcionais",
          description: "Ambientes cuidadosamente selecionados para inspirar, reunir e federar as suas equipas. Arquitetura notável, contextos naturais preservados, equipamento moderno: as nossas propriedades combinam charme e funcionalidade para satisfazer todas as suas exigências profissionais."
        }
      }
    },
    Weddings: {
      title: "Casamentos Excepcionais",
      hero: "Porque a emoção é vivida plenamente...",
      description: "Celebre a sua união nas nossas propriedades prestigiadas. Organização completa e acompanhamento personalizado para um dia único.",
      requestInfo: "Solicitar informações",
      service1: "Encontros personalizados",
      service2: "Organização e Coordenação",
      service3: "Rede de parceiros",
      service4: "Disponibilidade exclusiva"
    }
  }
};

// Fonction pour enrichir un fichier de traduction
function enrichTranslation(locale) {
  const filePath = path.join(__dirname, '..', 'messages', `${locale}.json`);
  const data = JSON.parse(fs.readFileSync(filePath, 'utf8'));
  
  // Fusionner les nouvelles traductions
  data.Home = translations[locale].Home;
  data.B2B = translations[locale].B2B;
  data.Weddings = translations[locale].Weddings;
  
  // Écrire le fichier
  fs.writeFileSync(filePath, JSON.stringify(data, null, 2) + '\n', 'utf8');
  console.log(`✅ ${locale}.json enrichi`);
}

// Enrichir ES, DE, IT, PT
['es', 'de', 'it', 'pt'].forEach(enrichTranslation);

console.log('\n🎉 Toutes les traductions ont été enrichies !');
