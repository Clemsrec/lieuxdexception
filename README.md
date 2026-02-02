# Lieux d'Exception - Groupe Riou

Site vitrine B2B pour la collection "Lieux d'Exception" du Groupe Riou, présentant 5 domaines prestigieux pour événements professionnels et mariages.

## 🏛️ Présentation du Projet

**Lieux d'Exception** est la plateforme B2B du Groupe Riou proposant des lieux d'exception pour :
- **Événements professionnels** : séminaires, conférences, lancements produit, team building
- **Mariages et réceptions** : célébrations dans des cadres prestigieux
- **Services sur-mesure** : accompagnement complet de A à Z

## 🚀 Stack Technique

### Framework & Technologies
- **Next.js 15** avec App Router et Turbopack
- **TypeScript** en mode strict
- **Tailwind CSS v4** (approche CSS-first, sans fichier de configuration JS)
- **Firebase** pour l'authentification et Firestore
- **React 19** avec Server/Client Components

### Architecture
```
src/
├── app/                 # Pages avec App Router
│   ├── globals.css     # Styles globaux Tailwind CSS v4
│   ├── layout.tsx      # Layout principal avec navigation
│   ├── page.tsx        # Page d'accueil
│   ├── mariages/        # Page mariages
│   ├── evenements-b2b/  # Page événements B2B
│   ├── lieux/[slug]/    # Pages lieux individuelles
│   ├── evenements-b2b/ # Page événements B2B
│   ├── mariages/       # Page mariages
│   ├── contact/        # Formulaires de contact adaptatifs
│   └── admin/          # Dashboard d'administration
├── components/         # Composants réutilisables
│   ├── Navigation.tsx  # Navigation principale avec states actifs
│   └── ContactFormSwitcher.tsx # Formulaires adaptatifs (B2B/Mariage/Rapide)
├── lib/               # Services et configurations
│   ├── firebase.ts    # Configuration Firebase
│   └── firestore.ts   # Services CRUD Firestore
└── types/             # Définitions TypeScript
    └── firebase.ts    # Types pour Firebase/Firestore
```

## 🔥 Configuration Firebase

### Projet Firebase
- **Nom du projet** : `lieux-d-exceptions`
- **ID du projet** : `886228169873`
- **Base de données** : `lieuxdexception`
- **Région** : Europe (europe-west1)

### Services Activés
- **Firestore** : Base de données NoSQL pour les lieux, leads et analytics
- **Authentication** : Authentification utilisateur (admin)
- **Hosting** : Déploiement de production

### Variables d'Environnement

⚠️ **IMPORTANT** : Ne jamais commiter les clés API dans le repository !

Créer un fichier `.env.local` à la racine du projet (ce fichier est dans .gitignore) :

```env
# Configuration Firebase (NE PAS COMMITER CES VALEURS)
NEXT_PUBLIC_FIREBASE_API_KEY=votre_clé_api_ici
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=lieux-d-exceptions.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=lieux-d-exceptions
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=lieux-d-exceptions.firebasestorage.app
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=886228169873
NEXT_PUBLIC_FIREBASE_APP_ID=votre_app_id_ici
```

**Pour obtenir vos clés Firebase :**
1. Connectez-vous à la [Console Firebase](https://console.firebase.google.com/)
2. Sélectionnez le projet `lieux-d-exceptions`
3. Allez dans Paramètres du projet > Applications Web
4. Copiez les valeurs de configuration dans votre `.env.local`

**Restrictions de sécurité recommandées :**
- Limitez l'utilisation de la clé API aux domaines autorisés uniquement
- Activez les restrictions d'API dans Google Cloud Console
- Configurez les règles de sécurité Firestore en mode production

## 📋 Fonctionnalités Implémentées

### ✅ Pages Principales
- [x] **Page d'accueil** : Présentation générale et héros
- [x] **Pages dédiées** : Mariages et événements B2B avec galeries
- [x] **Événements B2B** : Page dédiée aux événements professionnels
- [x] **Mariages** : Page spécialisée mariages et réceptions
- [x] **Contact** : Formulaires adaptatifs selon le type d'événement
- [x] **Admin** : Dashboard de gestion (leads, lieux, analytics)

### ✅ Composants & UX
- [x] **Navigation responsive** avec states actifs
- [x] **Formulaires adaptatifs** : B2B, Mariage, Contact rapide
- [x] **Design system** cohérent avec Tailwind CSS v4
- [x] **Optimisation mobile** : Design mobile-first
- [x] **Accessibilité** : ARIA labels et navigation clavier

### ✅ Backend & Services
- [x] **Services Firestore** : CRUD pour lieux, leads, analytics
- [x] **Types TypeScript** : Interfaces complètes pour tous les models
- [x] **Validation des données** : Prêt pour intégration Zod
- [x] **Architecture modulaire** : Services séparés et réutilisables

## 🎯 Structure des Données

### Venues (Lieux)
```typescript
interface Venue {
  id: string;
  name: string;
  location: string;
  capacity: number;
  images: string[];
  description: string;
  features: string[];
  pricing: {
    b2b_half_day: number;
    b2b_full_day: number;
    wedding_weekend: number;
  };
  translations: Record<string, VenueTranslation>;
  isActive: boolean;
  createdAt: Timestamp;
  updatedAt: Timestamp;
}
```

### Leads (Prospects)
```typescript
interface Lead {
  id: string;
  type: 'b2b' | 'wedding';
  contactInfo: ContactInfo;
  eventDetails: EventDetails;
  status: 'new' | 'contacted' | 'qualified' | 'converted' | 'lost';
  source: string;
  createdAt: Timestamp;
  updatedAt: Timestamp;
}
```

## �️ Commandes de Développement

```bash
# Installation des dépendances
npm install

# Développement avec Turbopack (ultra rapide)
npm run dev

# Build de production
npm run build

# Démarrer en production
npm start

# Linting et vérifications
npm run lint

# Tests (à configurer)
npm run test
```

## � Déploiement

### Développement
- **URL locale** : http://localhost:3002
- **Hot reload** : Activé avec Turbopack
- **TypeScript** : Compilation en temps réel

### Production
```bash
# Build optimisé
npm run build

# Déploiement Firebase
firebase deploy

# Déploiement Vercel (alternative)
vercel --prod
```

## 🔄 Prochaines Étapes

### 🚧 À Implémenter
- [ ] **Multilingual** : Support 6 langues (FR, EN, ES, DE, IT, PT) avec next-intl
- [ ] **Intégration Odoo** : Synchronisation automatique des leads
- [ ] **Système de réservation** : Calendrier et gestion des disponibilités
- [ ] **Galerie photos** : Integration avec un CDN pour les images
- [ ] **Système de paiement** : Acomptes et paiements en ligne
- [ ] **Analytics avancés** : Tracking des conversions et comportements

### 🎨 Améliorations UX
- [ ] **Animations** : Transitions fluides et micro-interactions
- [ ] **Progressive Web App** : Support PWA pour mobile
- [ ] **SEO avancé** : Schema.org et métadonnées enrichies
- [ ] **Performance** : Optimisation des images et lazy loading

### � Fonctionnalités Admin
- [ ] **CMS intégré** : Édition des contenus sans redéploiement
- [ ] **Gestion des utilisateurs** : Rôles et permissions
- [ ] **Exports de données** : CSV, PDF pour les rapports
- [ ] **Notifications** : Alertes email pour nouveaux leads

## � Support & Contact

### Équipe Technique
- **Développement** : Architecture Next.js 15 + TypeScript
- **Design** : Tailwind CSS v4 avec design system cohérent
- **Backend** : Firebase/Firestore avec services modulaires
- **SEO** : Optimisation française et multilingue

### Documentation
- **Copilot Instructions** : `.github/copilot-instructions.md`
- **Types TypeScript** : `src/types/firebase.ts`
- **Services API** : `src/lib/firestore.ts`
- **Composants** : Documentation JSDoc inline

---

**Lieux d'Exception** - Une expérience B2B premium pour des événements inoubliables.
*Développé avec ❤️ et Next.js 15 par l'équipe Groupe Riou*