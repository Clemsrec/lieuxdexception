# Instructions Copilot pour Lieux d'Exception

## Règles Fondamentales ⚠️

### Langue et Documentation
- **Site entièrement en français** - Tous les textes, commentaires et documentation
- **Documentation obligatoire** - Chaque fichier doit contenir des commentaires explicatifs détaillés
- **Commentaires explicites** - Expliquer le pourquoi, pas seulement le quoi
- **Vérification lors des mises à jour** - Toujours s'assurer que la documentation reste à jour

### Design et Interface 🎨
- **RÈGLE D'OR : ZÉRO EMOJI SUR LE SITE** - Bannir complètement les emojis de TOUT le site (public + admin)
- **Icônes professionnelles uniquement** - SVG optimisés, cohérents et accessibles (Lucide React)
- **Éviter absolument** - Tous les emojis dans le code React/JSX (🚫 ❌ 💡 💒 🏰 etc.)
- **Exception très limitée** - Emojis autorisés uniquement dans les commentaires de code et documentation Markdown

### Données et Implémentation
- **Données réelles uniquement** - Jamais de données mockées ou factices
- **Pas de solutions temporaires** - Toujours implémenter la version définitive
- **TODO explicites** - Utiliser des commentaires TODO pour les fonctionnalités à implémenter plus tard
- **Validation systématique** - Vérifier que chaque mise à jour préserve la cohérence

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
- **Documentation obligatoire** : JSDoc pour chaque composant avec description et exemples

#### Styles
- Classes Tailwind CSS v4 en priorité
- CSS modules pour les styles spécifiques
- Variables CSS custom pour la cohérence
- **Commentaires CSS** : Expliquer les choix de design complexes

#### Icônes et Interface
- **Zéro emoji sur le site** : Bannir complètement les emojis de tout le site (public + admin)
- **Icônes modernes uniquement** : Utiliser exclusivement Lucide React, Heroicons ou similaires
- **Guide de migration** : Voir `docs/migration-emojis-to-icons.md` pour les conversions
- **Cohérence visuelle** : Même famille d'icônes dans tout le site
- **Accessibilité** : Aria-labels et alternatives textuelles pour toutes les icônes
- **Performance** : SVG optimisés et tree-shaking des icônes inutilisées

#### Firebase Integration
- Configuration centralisée dans `lib/firebase.ts`
- Hooks personnalisés pour Auth dans `lib/auth.ts`
- Types Firestore dans `types/firebase.ts`
- **Données réelles** : Pas de configuration en dur, utiliser les variables d'environnement

#### Code Quality Standards
- **Documentation systématique** : Chaque fonction doit avoir des commentaires explicatifs
- **Types stricts** : Pas de `any`, utiliser des types précis
- **Validation des données** : Toujours valider les entrées utilisateur avec Zod
- **TODO explicites** : Format `// TODO: [Description précise de ce qui reste à faire]`
- **Pas de solutions temporaires** : Implémenter directement la version finale

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
- **SEO optimisé** avec métadonnées dynamiques en français
- **Performance** : lazy loading des images, optimisation des bundles
- **Accessibilité** : ARIA labels et navigation clavier en français
- **Responsive design** mobile-first avec breakpoints cohérents
- **Interface professionnelle** : Pas d'emojis - uniquement des icônes modernes (Lucide, Heroicons)
- **Documentation** : Maintenir les commentaires à jour lors des modifications
- **Données** : Utiliser uniquement des données de production réelles
- **Cohérence** : Vérifier l'impact des modifications sur l'ensemble du projet

### Workflow de Développement
1. **Avant modification** : Lire et comprendre la documentation existante
2. **Pendant développement** : Documenter chaque fonction/composant créé
3. **Interface utilisateur** : Utiliser UNIQUEMENT des icônes modernes (Lucide React) - PAS D'EMOJIS
4. **Après modification** : Mettre à jour la documentation impactée
5. **Validation** : Tester avec des données réelles uniquement
6. **Review icônes** : Vérifier qu'aucun emoji n'a été introduit dans l'interface