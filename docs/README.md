# 📚 Documentation Interne - Lieux d'Exception

⚠️ **CE DOSSIER EST DANS .GITIGNORE** - Documentation interne uniquement

## 📂 Organisation

```
docs/
├── README.md                      ← Ce fichier
├── DEPLOYMENT.md                  ← Guide de déploiement Firebase App Hosting
├── SECURITY.md                    ← Guide de sécurité et maintenance
├── SECRETS.md                     ← Configuration des secrets GitHub
└── migration-emojis-to-icons.md  ← Guide migration emojis → icônes
```

## 📖 Documents Disponibles

### DEPLOYMENT.md
**Guide complet de déploiement**
- Configuration Google Cloud Secret Manager
- Déploiement Firebase App Hosting
- CI/CD avec GitHub Actions
- Monitoring et logs
- Dépannage

**Utiliser pour** : Premier déploiement, mise en production

### SECURITY.md
**Guide de sécurité et maintenance**
- Mesures de sécurité implémentées
- Déploiement des Firestore Rules
- Headers HTTP de sécurité
- Rate limiting
- Checklist sécurité pré-prod
- Procédures en cas d'incident

**Utiliser pour** : Audit sécurité, maintenance régulière

### SECRETS.md
**Configuration des secrets GitHub**
- Secrets à ajouter dans GitHub Actions
- Workload Identity Federation
- Rotation des secrets
- Procédure en cas de compromission

**Utiliser pour** : Configuration CI/CD, gestion des secrets

### migration-emojis-to-icons.md
**Guide de migration emojis → icônes**
- Catalogue des icônes Lucide React disponibles
- Patterns de migration
- Composant Icon centralisé

**Utiliser pour** : Référence lors de l'ajout de nouvelles pages

## 🚀 Déploiement Rapide

### 1. Configurer les secrets (première fois)
```bash
./scripts/setup-secrets.sh
```

### 2. Configurer GitHub Secrets
Voir `docs/SECRETS.md` pour la liste complète

### 3. Déployer
```bash
git push origin main  # Déploiement auto via GitHub Actions
# OU
firebase deploy --only hosting
```

## 🔐 Sécurité

Ces documents contiennent :
- ✅ Guides et procédures (OK)
- ✅ Architectures et configurations (OK)
- ❌ **JAMAIS** de clés API ou secrets réels
- ❌ **JAMAIS** de mots de passe ou tokens

Les vraies credentials sont dans :
- `credentials/` (local, .gitignore)
- `.env.local` (local, .gitignore)
- Google Cloud Secret Manager (production)
- GitHub Secrets (CI/CD)

## 📞 Support

- **Firebase Support** : https://firebase.google.com/support
- **Google Cloud Support** : https://console.cloud.google.com/support
- **GitHub Actions** : https://docs.github.com/en/actions

---

**Dernière mise à jour** : 11 novembre 2025
