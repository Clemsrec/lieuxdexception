# 🔧 Correction Formulaire Mariage - Résumé des Modifications

**Date :** 7 février 2026  
**Demandeur :** Alizée Lieux D'exception  
**Problème :** Message d'erreur "données invalides" sur le formulaire mariage

---

## 🐛 Problèmes Identifiés

### 1. **Erreur "données invalides"**
   - **Cause 1** : `guestCount` attendait un `number` mais recevait une `string` depuis le `<select>` HTML
   - **Cause 2** : `weddingDate` validé comme date future obligatoire alors que le champ est optionnel
   - **Cause 3** : Les noms des mariés (`bride`/`groom`) étaient obligatoires

### 2. **Trop de champs obligatoires**
   - Demandait : prénoms mariée/marié, noms mariée/marié, email, téléphone, nombre d'invités
   - Souhaité : **seulement nom, prénom, email, téléphone**

---

## ✅ Corrections Appliquées

### 1. **Validation Zod simplifiée** ([validation.ts](../src/lib/validation.ts))

**AVANT :**
```typescript
export const weddingFormSchema = z.object({
  bride: z.object({
    firstName: nameSchema, // ❌ Obligatoire
    lastName: nameSchema,  // ❌ Obligatoire
  }),
  groom: z.object({
    firstName: nameSchema, // ❌ Obligatoire
    lastName: nameSchema,  // ❌ Obligatoire
  }),
  email: emailSchema,
  phone: phoneSchema,
  weddingDate: futureDateSchema.optional(), // ❌ Validation date future stricte
  guestCount: z.number().int().min(20).max(500), // ❌ Type number
  // ...
});
```

**APRÈS :**
```typescript
export const weddingFormSchema = z.object({
  // ✅ OBLIGATOIRES (contact principal)
  firstName: nameSchema,
  lastName: nameSchema,
  email: emailSchema,
  phone: phoneSchema,
  
  // ✅ OPTIONNELS (informations mariés)
  bride: z.object({
    firstName: nameSchema.optional(),
    lastName: nameSchema.optional(),
  }).optional(),
  groom: z.object({
    firstName: nameSchema.optional(),
    lastName: nameSchema.optional(),
  }).optional(),
  
  // ✅ OPTIONNELS (événement)
  weddingDate: z.string().optional(), // String simple
  guestCount: z.string().optional(),  // String depuis select
  message: messageSchema.optional(),
  
  acceptPrivacy: z.literal(true),
});
```

### 2. **Formulaire HTML simplifié** ([ContactFormSwitcher.tsx](../src/components/ContactFormSwitcher.tsx))

**Champs ajoutés en HAUT du formulaire :**
```tsx
<input name="firstName" required placeholder="Votre prénom" />
<input name="lastName" required placeholder="Votre nom" />
```

**Champs mariés rendus OPTIONNELS :**
```tsx
<input name="brideFirstName" placeholder="Prénom (optionnel)" /> // ❌ Plus de required
<input name="groomFirstName" placeholder="Prénom (optionnel)" /> // ❌ Plus de required
```

**Nombre d'invités rendu OPTIONNEL :**
```tsx
<select name="guestCount"> // ❌ Plus de required
  <option value="">Sélectionner (optionnel)...</option>
  <option value="50">0 - 70 personnes</option>
  // ...
</select>
```

### 3. **Payload dynamique** ([ContactFormSwitcher.tsx](../src/components/ContactFormSwitcher.tsx))

**Nouvelle logique :**
```typescript
const payload: any = {
  type: 'mariage',
  firstName: formData.get('firstName'),    // ✅ Nouveau champ principal
  lastName: formData.get('lastName'),      // ✅ Nouveau champ principal
  email: formData.get('email'),
  phone: formData.get('phone'),
  weddingDate: formData.get('eventDate') || undefined,
  guestCount: formData.get('guestCount') || undefined,
  message: `${formData.get('message') || ''}\n\nLieux intéressants: ${venues.join(', ')}`,
  acceptPrivacy: true,
};

// ✅ N'ajouter bride/groom QUE si renseignés
if (formData.get('brideFirstName')) {
  payload.bride = { ... };
}
if (formData.get('groomFirstName')) {
  payload.groom = { ... };
}
```

### 4. **Synchronisation Odoo adaptée** ([route.ts](../src/app/api/contact/submit/route.ts))

**Gestion des champs optionnels :**
```typescript
const odooLead = {
  firstName: validatedData.firstName || validatedData.bride?.firstName || '',
  lastName: validatedData.lastName || validatedData.bride?.lastName || '',
  bride: validatedData.bride || {
    firstName: validatedData.firstName || '',
    lastName: validatedData.lastName || '',
  },
  groom: validatedData.groom || { firstName: '', lastName: '' },
  // ...
  guestCount: validatedData.guestCount ? parseInt(validatedData.guestCount) : 0,
};
```

---

## 🧪 Tests de Validation

**Script de test :** [test-mariage-validation.js](test-mariage-validation.js)

```bash
✅ Test 1 : Données minimales (nom, prénom, email, téléphone) → SUCCÈS
✅ Test 2 : Avec informations mariés (optionnelles) → SUCCÈS
✅ Test 3 : Avec date et message → SUCCÈS
✅ Test 4 : Données invalides (email manquant) → Erreur correcte
✅ Test 5 : guestCount en number (ancien format) → Erreur détectée
```

---

## 📋 Résumé - Champs du Formulaire Mariage

| Champ | Obligatoire ? | Type | Notes |
|-------|---------------|------|-------|
| **Prénom** | ✅ OUI | text | Contact principal |
| **Nom** | ✅ OUI | text | Contact principal |
| **Email** | ✅ OUI | email | Contact principal |
| **Téléphone** | ✅ OUI | tel | Contact principal |
| Prénom Mariée | ❌ Non | text | Optionnel |
| Prénom Marié | ❌ Non | text | Optionnel |
| Date mariage | ❌ Non | month | Optionnel (format YYYY-MM) |
| Nb invités | ❌ Non | select | Optionnel (valeurs: 50, 85, 115, 150) |
| Lieux | ❌ Non | checkbox | Optionnel (multi-sélection) |
| Message | ❌ Non | textarea | Optionnel |

---

## 🚀 Déploiement

1. **Build local validé :** ✅ Compilation réussie sans erreurs TypeScript
2. **Tests unitaires :** ✅ Tous les scénarios de validation passent
3. **Prêt pour production**

### Commandes de déploiement :
```bash
# Déployer sur Firebase Hosting
firebase deploy --only hosting

# OU via CI/CD (push sur main)
git add .
git commit -m "fix: Simplifier formulaire mariage - champs obligatoires réduits"
git push origin main
```

---

## 📝 Notes Importantes

### Rétrocompatibilité
- Les anciens leads avec `bride`/`groom` remplis continuent de fonctionner
- Les nouveaux leads peuvent avoir `bride`/`groom` vides ou absents
- La synchronisation Odoo gère les 2 formats automatiquement

### Sécurité maintenue
- ✅ Honeypot anti-bot actif (`website` field)
- ✅ Rate limiting (3 requêtes/min via Upstash Redis)
- ✅ Validation Zod stricte côté serveur
- ✅ Sanitization XSS des champs texte
- ✅ Protection doublon (même email dans les 24h)

### SEO/UX
- Labels clairs : "Prénom *" au lieu de "Prénom (Mariée) *"
- Placeholder explicites : "Votre prénom" vs "Prénom"
- Moins de friction = meilleur taux de conversion

---

## 🔗 Fichiers Modifiés

- ✏️ [src/lib/validation.ts](../src/lib/validation.ts) : Schéma Zod simplifié
- ✏️ [src/components/ContactFormSwitcher.tsx](../src/components/ContactFormSwitcher.tsx) : Formulaire HTML + payload
- ✏️ [src/app/api/contact/submit/route.ts](../src/app/api/contact/submit/route.ts) : API route + sync Odoo
- ➕ [scripts/test-mariage-validation.js](test-mariage-validation.js) : Script de test

---

**✅ Correction validée et prête pour déploiement**
