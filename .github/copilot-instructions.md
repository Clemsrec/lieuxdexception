# Instructions Copilot pour Lieux d'Exception

## Architecture du Projet

Ce projet est un site vitrine moderne développé avec Next.js 15, TypeScript et Tailwind CSS v4. Il intègre Firebase pour l'authentification et la base de données Firestore.

### Structure Technique
- **Framework**: Next.js 15 avec App Router
- **Styles**: Tailwind CSS v4 avec configuration personnalisée
- **Bundler**: Turbopack pour un développement rapide
- **Backend**: Firebase (Auth + Firestore)
- **Langage**: TypeScript strict

### Conventions du Projet

#### Organisation des Fichiers
- `app/` - Pages et layouts avec App Router
- `components/` - Composants réutilisables
- `lib/` - Utilitaires et configuration (Firebase, etc.)
- `types/` - Définitions TypeScript
- `public/` - Assets statiques

#### Composants
- Utilisez les Server Components par défaut
- Client Components seulement pour l'interactivité
- Préfixe "use client" nécessaire pour les hooks React

#### Styles
- Classes Tailwind CSS v4 en priorité
- CSS modules pour les styles spécifiques
- Variables CSS custom pour la cohérence

#### Firebase Integration
- Configuration centralisée dans `lib/firebase.ts`
- Hooks personnalisés pour Auth dans `lib/auth.ts`
- Types Firestore dans `types/firebase.ts`

### Commandes de Développement

```bash
# Développement avec Turbopack
npm run dev

# Build de production
npm run build

# Tests
npm run test

# Linting
npm run lint
```

### Patterns Spécifiques

#### Authentification
- Utiliser `useAuth()` hook pour l'état utilisateur
- Middleware pour les routes protégées
- Types stricts pour les données utilisateur

#### Navigation
- Composants de navigation responsive
- États actifs automatiques
- Transitions fluides

#### Données
- Validation avec Zod
- Gestion d'état locale avec useState/useReducer
- Cache optimiste pour Firestore

### Points d'Attention
- SEO optimisé avec métadonnées dynamiques
- Performance: lazy loading des images
- Accessibilité: ARIA labels et navigation clavier
- Responsive design mobile-first