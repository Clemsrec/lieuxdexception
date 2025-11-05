# Lieux d'Exception

Un site vitrine moderne développé avec Next.js 15, TypeScript et Tailwind CSS v4, intégrant Firebase pour l'authentification et Firestore pour la base de données.

## 🚀 Technologies Utilisées

- **Next.js 15** avec App Router
- **TypeScript** pour un code type-safe
- **Tailwind CSS v4** pour le styling
- **Turbopack** pour un développement ultra-rapide
- **Firebase** pour l'authentification et la base de données
- **ESLint** pour la qualité du code

## 📁 Structure du Projet

```
lieuxdexception/
├── app/                    # Pages et layouts (App Router)
│   ├── globals.css        # Styles globaux avec Tailwind
│   ├── layout.tsx         # Layout racine
│   └── page.tsx           # Page d'accueil
├── components/            # Composants réutilisables
├── lib/                   # Utilitaires et configuration
│   ├── firebase.ts       # Configuration Firebase
│   └── auth.ts           # Hooks d'authentification
├── types/                 # Définitions TypeScript
│   └── firebase.ts       # Types Firebase/Firestore
├── public/               # Assets statiques
└── .github/              # Configuration GitHub
    └── copilot-instructions.md
```

## 🛠 Installation et Configuration

### 1. Cloner et installer

```bash
git clone https://github.com/Clemsrec/lieuxdexception.git
cd lieuxdexception
npm install
```

### 2. Configuration Firebase

1. Créez un projet Firebase sur [Firebase Console](https://console.firebase.google.com/)
2. Activez Authentication et Firestore
3. Copiez `.env.local.example` vers `.env.local`
4. Remplacez les valeurs par vos clés Firebase

### 3. Lancement du développement

```bash
# Démarrer le serveur de développement avec Turbopack
npm run dev

# Autres commandes disponibles
npm run build     # Build de production
npm run start     # Serveur de production
npm run lint      # Vérification ESLint
```

## 🔧 Commandes de Développement

```bash
# Développement avec Turbopack (ultra-rapide)
npm run dev

# Build optimisé pour la production
npm run build

# Serveur de production
npm run start

# Linting et formatage
npm run lint
```

## 🏗 Architecture

### Composants
- **Server Components** par défaut pour les performances
- **Client Components** seulement pour l'interactivité (avec "use client")
- Types TypeScript stricts pour tous les composants

### Authentification Firebase
- Hook `useAuth()` pour l'état utilisateur
- Actions d'authentification centralisées dans `lib/auth.ts`
- Types stricts pour les données utilisateur

### Styling
- Tailwind CSS v4 avec configuration personnalisée
- Variables CSS custom pour la cohérence
- Design responsive mobile-first

## 🔐 Variables d'Environnement

Créez un fichier `.env.local` avec vos clés Firebase :

```env
NEXT_PUBLIC_FIREBASE_API_KEY=your-api-key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your-domain
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your-project-id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your-bucket
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your-sender-id
NEXT_PUBLIC_FIREBASE_APP_ID=your-app-id
```

## 📝 Conventions de Code

- Utilisez TypeScript strict
- Préférez les Server Components
- Classes Tailwind en priorité
- Validation avec Zod pour les données
- Nommage en français pour le contenu

## 🚀 Déploiement

Le projet est optimisé pour le déploiement sur Vercel avec Next.js 15.

## 📞 Contact

Pour toute question sur ce projet, contactez [votre email].

---

Développé avec ❤️ pour Lieux d'Exception