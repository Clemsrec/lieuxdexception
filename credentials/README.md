# Credentials Firebase - Lieux d'Exception

⚠️ **CE DOSSIER EST DANS .GITIGNORE - NE JAMAIS COMMITER CES FICHIERS**

## Service Account Firebase

### Récupération des credentials

1. **Accéder à la Console Firebase**
   - URL : https://console.firebase.google.com/project/lieux-d-exceptions/settings/serviceaccounts/adminsdk
   - Connexion avec le compte admin du projet

2. **Générer une nouvelle clé privée**
   - Onglet "Comptes de service"
   - Section "SDK Admin Firebase"
   - Cliquer sur "Générer une nouvelle clé privée"
   - Confirmer la génération

3. **Enregistrer le fichier**
   - Télécharger le fichier JSON généré
   - Le renommer en `firebase-service-account.json`
   - Le placer dans ce dossier `credentials/`

### Structure du fichier attendu

```json
{
  "type": "service_account",
  "project_id": "lieux-d-exceptions",
  "private_key_id": "...",
  "private_key": "-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----\n",
  "client_email": "firebase-adminsdk-xxxxx@lieux-d-exceptions.iam.gserviceaccount.com",
  "client_id": "...",
  "auth_uri": "https://accounts.google.com/o/oauth2/auth",
  "token_uri": "https://oauth2.googleapis.com/token",
  "auth_provider_x509_cert_url": "https://www.googleapis.com/oauth2/v1/certs",
  "client_x509_cert_url": "..."
}
```

## Utilisation dans le code

### Variables d'environnement (recommandé pour production)

Ajouter dans `.env.local` :

```env
FIREBASE_SERVICE_ACCOUNT_KEY=/path/to/credentials/firebase-service-account.json
```

### Import direct (développement local uniquement)

```typescript
import admin from 'firebase-admin';
import serviceAccount from '../credentials/firebase-service-account.json';

if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount as admin.ServiceAccount),
    databaseURL: 'https://lieux-d-exceptions.firebaseio.com'
  });
}
```

## Fichiers à placer dans ce dossier

- `firebase-service-account.json` - Clé privée du service account (OBLIGATOIRE)
- `firebase-service-account-staging.json` - Clé pour environnement de staging (optionnel)
- `google-cloud-key.json` - Clé pour autres services GCP (optionnel)

## Sécurité

✅ **À FAIRE :**
- Conserver ces fichiers UNIQUEMENT en local
- Ne JAMAIS les commiter dans Git
- Limiter les permissions du service account au strict nécessaire
- Utiliser des variables d'environnement en production
- Rotation régulière des clés (tous les 3-6 mois)

❌ **NE JAMAIS :**
- Partager ces fichiers par email ou Slack
- Les stocker dans un service cloud non sécurisé
- Les inclure dans des backups non chiffrés
- Les copier-coller dans des documents

## Permissions requises pour le Service Account

Le service account doit avoir les rôles suivants :
- **Firebase Admin SDK** - Accès complet à Firestore et Auth
- **Cloud Datastore User** - Lecture/écriture dans Firestore
- **Firebase Authentication Admin** - Gestion des utilisateurs

## En cas de compromission

Si les credentials sont exposés :
1. Supprimer immédiatement la clé compromise dans la Console Firebase
2. Générer une nouvelle clé
3. Mettre à jour tous les environnements avec la nouvelle clé
4. Vérifier les logs d'accès pour détecter toute utilisation frauduleuse
5. Notifier l'équipe de sécurité

---

**Pour toute question sur les credentials, contacter l'administrateur du projet Firebase.**
