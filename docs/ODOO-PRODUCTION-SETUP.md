# 📋 Configuration Odoo en Production

## ❌ Problème Identifié

Les formulaires fonctionnent mais **rien n'arrive dans Odoo** car les variables d'environnement Odoo ne sont PAS déployées en production.

## ✅ Solution Rapide (2 commandes)

### 1. Configurez les secrets Odoo

```bash
./scripts/add-odoo-secrets.sh
```

Si Firebase CLI vous demande de vous reconnecter, faites-le avec `firebase login`.

### 2. Déployez en production

```bash
git push origin main
```

Le déploiement prendra ~3-5 minutes.

### 3. Testez

1. Allez sur **https://lieuxdexception.com/fr/contact**
2. Remplissez un formulaire (B2B ou Privé)
3. Vérifiez dans **Odoo CRM** : https://groupe-lr.odoo.com/web#menu_id=156&action=196&model=crm.lead&view_type=kanban

---

## 📊 Vérification des Logs

Si ça ne fonctionne toujours pas, regardez les logs Firebase :

```bash
firebase functions:log --only hosting
```

Ou dans la console : https://console.firebase.google.com/project/lieux-d-exceptions/apphosting

---

## 🔍 Variables Configurées

### Dans apphosting.yaml (Production)

```yaml
# Odoo CRM
ODOO_URL=https://groupe-lr.odoo.com           # ✅ Valeur
ODOO_DB=groupe-lr                             # ✅ Valeur
ODOO_USERNAME=domainenantais@gmail.com        # ✅ Valeur
ODOO_API_KEY=secret:ODOO_API_KEY              # ✅ Secret (Firebase)

# Upstash Redis (optionnel, pour rate limiting)
UPSTASH_REDIS_REST_URL=secret:...             # ✅ Secret
UPSTASH_REDIS_REST_TOKEN=secret:...           # ✅ Secret
```

### Dans .env.local (Dev)

```env
ODOO_URL=https://groupe-lr.odoo.com
ODOO_DB=groupe-lr
ODOO_USERNAME=domainenantais@gmail.com
ODOO_API_KEY=f8d57d6d1041ece0e7d262d325b86f035d67ea70
```

---

## 📝 Changements Appliqués

1. **apphosting.yaml** : Ajout des 4 variables Odoo
2. **ContactFormSwitcher.tsx** : Simplification formulaire privé (retrait bride/groom)
3. **scripts/add-odoo-secrets.sh** : Outil Firebase CLI pour configurer secrets

---

## ⚠️ Important

Les secrets sont gérés via **Firebase CLI** (`firebase apphosting:secrets:set`), pas besoin de gcloud. Le script fait tout automatiquement en lisant `.env.local`.
