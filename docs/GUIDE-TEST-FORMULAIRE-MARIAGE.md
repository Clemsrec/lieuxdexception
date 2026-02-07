# 🧪 Guide de Test - Formulaire Mariage Corrigé

**Date :** 7 février 2026  
**Pour :** Alizée Lieux D'exception  
**Objectif :** Valider que le formulaire mariage fonctionne correctement

---

## ✅ Ce qui a été corrigé

### Problème initial
- ❌ Message "données invalides" sur tous les envois
- ❌ Trop de champs obligatoires (prénoms/noms mariés)

### Solution appliquée
- ✅ Validation simplifiée : **seulement 4 champs obligatoires**
- ✅ Tous les autres champs sont maintenant **optionnels**

---

## 📋 Champs Obligatoires (avec astérisque *)

1. **Prénom** (votre prénom à vous)
2. **Nom** (votre nom à vous)
3. **Email**
4. **Téléphone**

**C'est tout !** Vous pouvez envoyer le formulaire avec juste ces 4 champs remplis.

---

## 🧪 Scénarios de Test

### Test 1 : Formulaire minimal (DOIT FONCTIONNER ✅)

**Champs à remplir :**
- Prénom : `Marie`
- Nom : `Dupont`
- Email : `marie.dupont@test.com`
- Téléphone : `06 12 34 56 78`
- *(Tout le reste vide)*

**Résultat attendu :**
- ✅ Message de succès : "Votre demande a été envoyée avec succès !"
- ✅ Email de notification reçu par l'équipe

---

### Test 2 : Formulaire avec informations couple (DOIT FONCTIONNER ✅)

**Champs à remplir :**
- Prénom : `Marie`
- Nom : `Dupont`
- Email : `marie.dupont@test.com`
- Téléphone : `06 12 34 56 78`
- **+ Prénom Mariée :** `Sophie`
- **+ Prénom Marié :** `Pierre`
- **+ Nombre d'invités :** `70 - 100 personnes`

**Résultat attendu :**
- ✅ Message de succès
- ✅ Email avec les infos couple

---

### Test 3 : Formulaire complet (DOIT FONCTIONNER ✅)

**Champs à remplir :**
- Prénom : `Marie`
- Nom : `Dupont`
- Email : `marie.dupont@test.com`
- Téléphone : `06 12 34 56 78`
- Prénom Mariée : `Sophie Martin`
- Prénom Marié : `Pierre Bernard`
- Date événement : `Juin 2026`
- Nombre d'invités : `130+ personnes`
- Lieux : ☑️ `Le Château de la Brûlaire`, ☑️ `Le Manoir de la Boulaie`
- Message : `Nous cherchons un lieu avec hébergement sur place`

**Résultat attendu :**
- ✅ Message de succès
- ✅ Email avec toutes les infos

---

### Test 4 : Email manquant (DOIT ÉCHOUER ❌)

**Champs à remplir :**
- Prénom : `Marie`
- Nom : `Dupont`
- ~~Email : (vide)~~
- Téléphone : `06 12 34 56 78`

**Résultat attendu :**
- ❌ Message d'erreur du navigateur : "Veuillez renseigner ce champ"
- ❌ Le formulaire ne s'envoie pas (validation HTML5)

---

## 🔍 Comment tester

### Sur Desktop (Chrome/Firefox/Safari)

1. Aller sur : `https://lieuxdexception.com/mariages`
2. Scroller jusqu'au formulaire de contact
3. Cliquer sur **"Événements privés"** (onglet de droite)
4. Remplir les champs selon les scénarios ci-dessus
5. Cliquer sur **"Demander un devis"**
6. Vérifier le message de succès

### Sur Mobile (iPhone/Android)

1. Ouvrir Safari ou Chrome mobile
2. Aller sur `https://lieuxdexception.com/mariages`
3. Scroller jusqu'au formulaire
4. Tester les scénarios 1 et 2 minimum
5. Vérifier que le clavier mobile fonctionne bien pour téléphone/email

---

## 🎯 Points de Contrôle

### ✅ Validation Réussie

- [ ] Test 1 (minimal) → Message de succès
- [ ] Test 2 (avec couple) → Message de succès
- [ ] Test 3 (complet) → Message de succès
- [ ] Test 4 (email manquant) → Erreur correcte
- [ ] Formulaire responsive sur mobile
- [ ] Email de notification reçu dans Odoo/inbox

### ⚠️ Si Problème Persiste

1. **Vérifier la console navigateur**
   - Clic droit → Inspecter → Console
   - Chercher des erreurs en rouge

2. **Copier l'erreur exacte**
   - Screenshot ou copier le message d'erreur
   - Envoyer à l'équipe technique

3. **Infos à fournir**
   - Navigateur utilisé (Chrome, Safari, Firefox...)
   - Système (Windows, Mac, iPhone, Android)
   - Valeurs exactes remplies dans les champs
   - Message d'erreur complet

---

## 📊 Comparaison Avant/Après

| Aspect | AVANT ❌ | APRÈS ✅ |
|--------|---------|----------|
| **Champs obligatoires** | 6 champs | 4 champs |
| | (prénoms + noms mariés + email + tel + nb invités) | (nom + prénom + email + tel) |
| **Validation guestCount** | number strict | string optionnel |
| **Validation weddingDate** | date future stricte | string optionnel |
| **Prénoms mariés** | Obligatoires | Optionnels |
| **Message erreur** | "données invalides" | Validation claire |

---

## 🚀 Mise en Production

**Statut :** ✅ Prêt à déployer

**Commandes (si besoin de redéployer) :**

```bash
# Déployer sur Firebase Hosting
firebase deploy --only hosting

# Vérifier le site en production
open https://lieuxdexception.com/mariages
```

---

## 📝 Questions Fréquentes

### "Pourquoi les prénoms mariés ne sont plus obligatoires ?"

Souvent, la personne qui remplit le formulaire n'a pas encore tous les détails du couple (témoin, parent, futur marié seul). Le but est de **faciliter la prise de contact** sans créer de friction.

### "Les anciennes demandes vont-elles continuer de fonctionner ?"

Oui, la rétrocompatibilité est assurée. Les leads existants avec `bride`/`groom` remplis restent valides.

### "Est-ce que ça change le formulaire B2B aussi ?"

Non, le formulaire B2B reste inchangé (séminaires, team-buildings, etc.). Seul le formulaire **Événements privés** (mariages) a été modifié.

---

**✅ Correction validée - Prêt pour tests**

---

**Contact Support Technique :**
- Email : [support technique]
- Slack : #tech-support
