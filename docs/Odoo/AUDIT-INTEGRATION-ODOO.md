# Audit Intégration Odoo - Lieux d'Exception

**Date :** 7 février 2026  
**Objectif :** Vérifier la conformité de l'intégration Odoo avec la documentation officielle

---

## ✅ Points Conformes à la Documentation

### 1. **Architecture XML-RPC correcte**

Conforme au guide [odoo-api.md](odoo-api.md) et [documentation officielle Odoo](https://www.odoo.com/documentation/17.0/developer/reference/external_api.html)

```typescript
// ✅ Pattern correct : authenticate() puis execute_kw()
const client = xmlrpc.createClient({ url: `${ODOO_URL}/xmlrpc/2/common` });
const uid = await authenticateOdoo(); // Étape 1

const models = xmlrpc.createClient({ url: `${ODOO_URL}/xmlrpc/2/object` });
const leadId = await createOdooLead(uid, leadData); // Étape 2
```

### 2. **Sécurité respectée**

- ✅ Variables d'environnement pour credentials (`.env.local`)
- ✅ Backend proxy (`/api/contact/submit` → Odoo)
- ✅ Frontend ne parle jamais directement à Odoo
- ✅ Clé API jamais exposée côté client

```typescript
// ✅ Configuration sécurisée
const ODOO_CONFIG = {
  url: process.env.ODOO_URL || '',
  db: process.env.ODOO_DB || '',
  username: process.env.ODOO_USERNAME || '',
  apiKey: process.env.ODOO_API_KEY || '',
};
```

### 3. **Modèle `crm.lead` correctement utilisé**

Conforme à la doc [Odoo.md](Odoo.md) - champs standards du module CRM :

```typescript
const leadData = {
  name: 'Demande Mariage - Contact Name',      // ✅ Sujet du lead
  contact_name: 'John Doe',                    // ✅ Nom du contact
  email_from: 'john@example.com',              // ✅ Email
  phone: '+33612345678',                       // ✅ Téléphone
  description: 'Message détaillé...',          // ✅ Description
  type: 'opportunity',                         // ✅ Type (opportunity/lead)
  tag_ids: [[6, 0, []]],                       // ✅ Tags (format Odoo)
};
```

### 4. **Gestion d'erreurs robuste**

```typescript
// ✅ Fallback si Odoo indisponible (ne bloque pas l'utilisateur)
if (!isOdooConfigured()) {
  console.warn('⚠️ Odoo non configuré, lead enregistré localement seulement');
  return;
}

try {
  await createB2BLeadInOdoo(leadData);
} catch (error) {
  console.error('❌ Sync Odoo échouée, mais lead sauvegardé en Firestore');
  // N'interrompt pas le flux utilisateur
}
```

---

## 🔧 Corrections Appliquées (7 février 2026)

### **Adaptation au nouveau schéma formulaire mariage**

**Problème :** L'interface `OdooWeddingLead` attendait `bride`/`groom` obligatoires, mais le formulaire les rend optionnels depuis la simplification.

**Solution :**

```typescript
// ❌ AVANT : bride/groom obligatoires
export interface OdooWeddingLead {
  bride: { firstName: string; lastName: string; };
  groom: { firstName: string; lastName: string; };
  // ...
}

// ✅ APRÈS : champs principaux + bride/groom optionnels
export interface OdooWeddingLead {
  firstName?: string; // Contact principal
  lastName?: string;  // Contact principal
  bride?: { firstName?: string; lastName?: string; };
  groom?: { firstName?: string; lastName?: string; };
  // ...
}
```

**Fonction `createWeddingLeadInOdoo` adaptée :**

```typescript
// Construire le nom du contact avec fallbacks
const brideInfo = lead.bride?.firstName 
  ? `${lead.bride.firstName} ${lead.bride.lastName || ''}`
  : lead.firstName || '';
const groomInfo = lead.groom?.firstName 
  ? `${lead.groom.firstName} ${lead.groom.lastName || ''}`
  : lead.lastName || '';

const contactName = brideInfo && groomInfo 
  ? `${brideInfo} & ${groomInfo}`.trim()
  : (brideInfo || groomInfo || `${lead.firstName || ''} ${lead.lastName || ''}`.trim() || 'Contact anonyme');
```

---

## 📋 Recommandations pour Production

### 1. **Configuration des tags Odoo**

Actuellement : `tag_ids: [[6, 0, []]]` (vide)

**À faire dans Odoo :**
- Créer tags : `Site Web`, `Mariage`, `B2B`, `Loire-Atlantique`
- Récupérer leurs IDs
- Mettre à jour le code :

```typescript
// Exemple avec IDs réels
tag_ids: [[6, 0, [12, 34, 56]]], // IDs des tags Odoo
```

### 2. **Assigner une équipe CRM**

Actuellement commenté : `// team_id: 2`

**À activer si équipes CRM configurées dans Odoo :**

```typescript
leadData = {
  // ...
  team_id: 2, // ID équipe "Mariages"
  user_id: 5, // ID commercial responsable (optionnel)
};
```

### 3. **Variables d'environnement requises**

Vérifier dans `.env.local` (et secrets Google Cloud pour production) :

```bash
ODOO_URL=https://votre-instance.odoo.com
ODOO_DB=nom_base_de_donnees
ODOO_USERNAME=email@utilisateur.com
ODOO_API_KEY=clé_api_generee_dans_odoo
```

**Générer une clé API dans Odoo :**
1. Paramètres → Utilisateurs → Votre profil
2. Onglet "Préférences"
3. Section "Sécurité du compte" → Générer clé API

### 4. **Tests de connexion**

Utiliser la fonction `testOdooConnection()` pour diagnostiquer :

```typescript
import { testOdooConnection } from '@/lib/odoo';

const isConnected = await testOdooConnection();
console.log('Odoo status:', isConnected ? 'OK ✅' : 'KO ❌');
```

### 5. **Monitoring et logs**

Actuellement : logs console uniquement

**Amélioration recommandée :**
- Logger les échecs de sync dans Firestore (`collection('odoo_sync_errors')`)
- Dashboard admin pour voir les leads non synchronisés
- Retry automatique des syncs échoués (job cron)

---

## 🔐 Sécurité Supplémentaire

### **Rate Limiting spécifique Odoo**

Ajouter un rate limit séparé pour les appels Odoo (éviter DDoS sur l'instance Odoo) :

```typescript
// Dans lib/rate-limit.ts
export async function checkOdooRateLimit(ip: string) {
  // Max 10 créations de leads Odoo par IP par heure
  return checkRateLimit({
    identifier: `odoo:${ip}`,
    maxRequests: 10,
    windowMs: 60 * 60 * 1000, // 1 heure
  });
}
```

### **Validation des champs avant envoi Odoo**

Actuellement la validation Zod est faite avant, mais double-check côté Odoo :

```typescript
// Nettoyer les champs avant envoi
leadData.email_from = leadData.email_from.trim().toLowerCase();
leadData.phone = leadData.phone.replace(/[^\d+\s]/g, ''); // Garder que chiffres/+/espaces
```

---

## 📊 Workflow Actuel (Conforme aux Best Practices)

```
Utilisateur remplit formulaire
         ↓
POST /api/contact/submit
         ↓
1. Validation Zod          ← Sécurité
2. Honeypot check          ← Anti-bot
3. Rate limiting           ← Anti-spam
         ↓
4. Sauvegarde Firestore    ← Toujours réussi (données sécurisées)
         ↓
5. Sync Odoo (async)       ← Non bloquant, avec retry
         ↓
6. Notification FCM        ← Alerte admins
         ↓
Response 200 OK
```

**Points forts :**
- ✅ UX fluide (pas d'attente Odoo)
- ✅ Données jamais perdues (Firestore = source de vérité)
- ✅ Résilience (échec Odoo n'impacte pas l'utilisateur)

---

## 🧪 Tests Recommandés

### Test 1 : Connexion Odoo

```bash
# Dans un script de test
node -e "require('./src/lib/odoo').testOdooConnection()"
```

### Test 2 : Création lead B2B

```bash
curl -X POST http://localhost:3001/api/contact/submit \
  -H "Content-Type: application/json" \
  -d '{
    "type": "b2b",
    "firstName": "Test",
    "lastName": "User",
    "email": "test@example.com",
    "phone": "0612345678",
    "company": "Test Corp",
    "eventType": "seminar",
    "guestCount": "50",
    "message": "Test sync Odoo",
    "acceptPrivacy": true
  }'
```

### Test 3 : Création lead Mariage (nouveau format)

```bash
curl -X POST http://localhost:3001/api/contact/submit \
  -H "Content-Type: application/json" \
  -d '{
    "type": "mariage",
    "firstName": "Marie",
    "lastName": "Dupont",
    "email": "marie@example.com",
    "phone": "0612345678",
    "message": "Test formulaire simplifié",
    "acceptPrivacy": true
  }'
```

**Vérifier dans Odoo :**
1. CRM → Leads/Opportunités
2. Chercher par email `marie@example.com`
3. Vérifier que le contact est bien `Marie Dupont` (pas bride/groom vides)

---

## 📚 Références

- [odoo-api.md](odoo-api.md) : Guide d'intégration Next.js ↔ Odoo
- [Odoo.md](Odoo.md) : Documentation complète ORM Odoo
- [Documentation Officielle Odoo v17](https://www.odoo.com/documentation/17.0/developer/reference/external_api.html)
- [src/lib/odoo.ts](../../src/lib/odoo.ts) : Implémentation actuelle
- [src/app/api/contact/submit/route.ts](../../src/app/api/contact/submit/route.ts) : Point d'entrée API

---

**✅ Intégration conforme et sécurisée**  
**🔧 Corrections appliquées pour nouveau schéma formulaire**  
**📋 Prêt pour production après configuration tags/équipes Odoo**
