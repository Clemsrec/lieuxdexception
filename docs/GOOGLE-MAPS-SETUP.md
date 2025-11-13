# Configuration Google Maps API

## Obtention de la Clé API

### 1. Créer un Projet Google Cloud

1. Aller sur [Google Cloud Console](https://console.cloud.google.com/)
2. Cliquer sur le sélecteur de projet en haut
3. Cliquer sur "Nouveau Projet"
4. Nom du projet : `lieux-exceptions-maps`
5. Cliquer sur "Créer"

### 2. Activer l'API Maps JavaScript

1. Dans le menu latéral, aller dans **APIs & Services** → **Bibliothèque**
2. Rechercher "Maps JavaScript API"
3. Cliquer sur "Maps JavaScript API"
4. Cliquer sur "Activer"

### 3. Créer une Clé API

1. Dans le menu latéral, aller dans **APIs & Services** → **Identifiants**
2. Cliquer sur **+ CRÉER DES IDENTIFIANTS** → **Clé API**
3. Votre clé API est créée et affichée
4. **IMPORTANT** : Cliquer sur "RESTREINDRE LA CLÉ" immédiatement

### 4. Restreindre la Clé (Sécurité)

#### Restrictions d'application

1. Sélectionner **Référents HTTP (sites web)**
2. Ajouter vos domaines autorisés :
   ```
   http://localhost:3000/*
   https://lieux-d-exceptions.web.app/*
   https://lieuxdexception.com/*
   https://*.lieuxdexception.com/*
   ```

#### Restrictions d'API

1. Sélectionner **Restreindre la clé**
2. Cocher uniquement :
   - ✅ Maps JavaScript API
   - ✅ Geocoding API (si nécessaire pour recherche d'adresses)

3. Cliquer sur **Enregistrer**

### 5. Configuration du Projet

Ajouter la clé dans `.env.local` :

```env
NEXT_PUBLIC_GOOGLE_MAPS_KEY=votre_clé_api_ici
```

**⚠️ IMPORTANT** :
- Ne JAMAIS committer `.env.local` dans Git
- Le fichier est déjà dans `.gitignore`
- Utiliser Google Cloud Secret Manager en production

### 6. Pour la Production

**Option 1 : Secret Manager (Recommandé)**

La clé est stockée dans Google Cloud Secret Manager et injectée automatiquement (voir `apphosting.yaml`).

**Option 2 : Variables d'environnement**

Ajouter dans Firebase Hosting :
```bash
firebase functions:config:set maps.api_key="votre_clé_api"
```

## APIs Google Maps Requises

### 1. **Maps JavaScript API** ✅ (Obligatoire)
- **Utilisation** : Affichage de la carte interactive
- **Coût** : 7€ / 1000 chargements (après 15 000 gratuits/mois)
- **Activation** : 
  ```
  Google Cloud Console → APIs & Services → Bibliothèque
  → Rechercher "Maps JavaScript API" → Activer
  ```

### 2. **Places API (New)** ⚠️ (Nouvelle version recommandée)
- **Note importante** : Si vous avez activé **Places API (New)** au lieu de l'ancienne "Places API", c'est parfait !
- **Utilisation** : Autocomplete d'adresses, recherche de lieux, détails des lieux
- **Différence** : Version modernisée avec meilleur pricing et fonctionnalités améliorées
- **Compatibilité** : Fonctionne avec `@react-google-maps/api`
- **Coût** : Variable selon les requêtes (généralement moins cher que l'ancienne version)
- **Activation** :
  ```
  Google Cloud Console → APIs & Services → Bibliothèque
  → Rechercher "Places API (New)" → Activer
  ```

### 3. **Geocoding API** (Optionnel mais recommandé)
- **Utilisation** : Convertir adresses en coordonnées GPS
- **Utile si** : Vous voulez ajouter une recherche d'adresse
- **Coût** : 5€ / 1000 requêtes (après 40 000 gratuites/mois)

### Optimisations pour Réduire les Coûts

1. **Lazy Loading** : Charger la carte seulement quand visible
   ```tsx
   <InteractiveMap lazy={true} />
   ```

2. **Cache côté client** : Stocker les coordonnées en localStorage

3. **Static Maps** : Utiliser Static Maps API pour les aperçus (gratuit)

4. **Limite de requêtes** : Implémenter un rate limiting

## Monitoring

### Vérifier l'Utilisation

1. Aller dans [Google Cloud Console](https://console.cloud.google.com/)
2. **APIs & Services** → **Tableau de bord**
3. Sélectionner "Maps JavaScript API"
4. Voir les statistiques d'utilisation

### Créer une Alerte Budget

1. **Facturation** → **Budgets et alertes**
2. Créer un budget : 50€/mois
3. Configurer alertes à 50%, 90%, 100%
4. Recevoir email si dépassement

## Troubleshooting

### Erreur: "This page can't load Google Maps correctly"

**Cause** : Clé API invalide ou restrictions trop strictes

**Solution** :
1. Vérifier que la clé est bien dans `.env.local`
2. Redémarrer le serveur : `npm run dev`
3. Vérifier les restrictions dans Google Cloud Console
4. Vérifier que l'API est bien activée

### Erreur: "RefererNotAllowedMapError"

**Cause** : Le domaine n'est pas autorisé dans les restrictions

**Solution** :
1. Aller dans **Identifiants** → Modifier la clé
2. Ajouter le domaine dans les référents HTTP autorisés
3. Attendre 5 minutes pour propagation

### Carte ne s'affiche que en gris

**Cause** : API non activée ou quota dépassé

**Solution** :
1. Vérifier que "Maps JavaScript API" est activée
2. Vérifier le quota dans le tableau de bord
3. Vérifier la facturation activée (obligatoire même pour usage gratuit)

## Ressources

- [Documentation Maps JavaScript API](https://developers.google.com/maps/documentation/javascript)
- [Tarification Google Maps](https://mapsplatform.google.com/pricing/)
- [Guides de sécurité](https://developers.google.com/maps/api-security-best-practices)
- [React Google Maps API](https://react-google-maps-api-docs.netlify.app/)
