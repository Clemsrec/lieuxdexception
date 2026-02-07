# 🔍 Problème : Message invisible dans Odoo

**Date :** 7 février 2026  
**Symptôme :** Les leads arrivent dans Odoo mais le message utilisateur n'est pas visible

---

## 🐛 Cause du Problème

Le champ `description` dans Odoo CRM est utilisé pour les **notes internes**, et **n'est pas visible par défaut** dans la vue formulaire principale du lead.

### Où est le message dans Odoo ?

1. **Onglet "Notes internes"** (si activé dans votre vue)
2. **Chatter / Timeline** (messages et notes)
3. **Vue liste** → colonne "Description" (si ajoutée)

---

## ✅ Solutions Appliquées

### 1. **Amélioration du mapping Odoo** ([odoo.ts](../../src/lib/odoo.ts))

Ajout du champ `priority` pour identifier facilement les leads site web :

```typescript
const leadData = {
  name: leadName,
  contact_name: contactName,
  email_from: lead.email,
  phone: lead.phone || '',
  description: description, // ✅ Notes internes (contient TOUT le message)
  priority: '1', // ✅ Haute priorité = Lead site web
  type: 'opportunity',
  // ...
};
```

**Priorités :**
- `'1'` = Haute priorité (B2B - site web)
- `'2'` = Normale (Mariages - site web)
- `'3'` = Basse

---

## 📋 Comment Voir le Message dans Odoo

### Option 1 : **Onglet Description** (Recommandé)

1. Ouvrir le lead dans Odoo CRM
2. Cliquer sur l'onglet **"Description"** ou **"Notes internes"**
3. Le message complet s'affiche ici :

```
=== Demande d'Événement B2B ===

Contact: Jean Dupont
Email: jean@example.com
Téléphone: 06 12 34 56 78
Entreprise: Test Corp
Poste: Directeur

Type d'événement: seminar
Date souhaitée: 2026-06-15
Nombre de participants: 50

Lieux sélectionnés:
- Le Château de la Brûlaire
- Le Manoir de la Boulaie

Message:
Nous cherchons un lieu pour organiser notre séminaire annuel...

---
Source: Site Web Lieux d'Exception
Date: 07/02/2026 14:30:00
```

### Option 2 : **Ajouter une colonne "Description" à la vue liste**

1. CRM → Leads/Opportunités
2. Cliquer sur l'icône **⚙️** (paramètres vue)
3. **"Sélectionner colonnes"**
4. Cocher **"Description"**
5. ✅ Le message apparaît dans la liste

### Option 3 : **Ajouter un champ personnalisé visible**

Si tu veux que le message soit **visible directement sur la fiche lead**, tu peux :

**Dans Odoo :**
1. Paramètres → Technique → Structure de base de données → Modèles
2. Chercher `crm.lead`
3. Créer un champ personnalisé `x_message_site_web` (type Text)
4. Ajouter ce champ à la vue formulaire

**Dans le code :**
```typescript
const leadData = {
  // ... champs existants
  x_message_site_web: lead.message, // ✅ Champ custom visible
  description: description, // Détails complets
};
```

---

## 🎯 Vérification Rapide

### Test dans Odoo :

1. Va dans **CRM → Leads/Opportunités**
2. Ouvre le dernier lead créé (depuis le site)
3. Vérifie ces éléments :

| Élément | Où le trouver | Attendu |
|---------|---------------|---------|
| **Nom** | Titre du lead | "Demande B2B - Entreprise (Contact)" |
| **Email** | Champ "Email" | Email du formulaire ✅ |
| **Téléphone** | Champ "Téléphone" | Numéro du formulaire ✅ |
| **Priorité** | Étoiles ou champ priority | ⭐ (haute) pour B2B |
| **Description** | Onglet "Description" | Message complet formaté ✅ |

### Commande de debug :

```bash
# Afficher les logs de création Odoo
cd /Users/clem/Nucom/Groupe\ Riou/groupe_riou/lieuxdexception
grep -r "Lead créé dans Odoo" .next/server/app/api/contact/submit/route.js
```

---

## 🔧 Alternative : Créer une Note dans le Chatter

Si tu veux que le message apparaisse dans la **timeline Odoo** (chatter), il faut créer une note séparée après la création du lead :

```typescript
// APRÈS création du lead
const noteClient = xmlrpc.createClient({
  url: `${ODOO_CONFIG.url}/xmlrpc/2/object`,
});

await new Promise((resolve, reject) => {
  noteClient.methodCall(
    'execute_kw',
    [
      ODOO_CONFIG.db,
      uid,
      ODOO_CONFIG.apiKey,
      'mail.message',
      'create',
      [{
        model: 'crm.lead',
        res_id: leadId, // ID du lead créé
        body: `<p><strong>Message du site web :</strong></p><p>${lead.message}</p>`,
        message_type: 'comment',
        subtype_id: 1, // mt_note
      }],
    ],
    (err, val) => (err ? reject(err) : resolve(val))
  );
});
```

Cette note sera **visible dans la timeline** directement sur la fiche lead.

---

## 📊 Récapitulatif

| Problème | Solution | Statut |
|----------|----------|--------|
| Message invisible | Onglet "Description" dans Odoo | ✅ Déjà implémenté |
| Identification difficile | Priorité haute (`'1'`) | ✅ Ajouté |
| Besoin champ visible | Créer `x_message_site_web` custom | 🔧 Optionnel |
| Timeline vide | Créer note dans chatter | 🔧 À implémenter si besoin |

---

## 🚀 Prochaine Étape

Si tu veux vraiment que le message soit **ultra visible**, je peux :

1. **Ajouter une note dans le chatter** (visible dans timeline)
2. **Créer un champ custom** `x_message_site_web` visible sur la fiche
3. **Envoyer un email interne Odoo** au commercial assigné

Dis-moi ce que tu préfères ! 🎯
