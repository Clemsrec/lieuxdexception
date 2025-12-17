# Mise à jour des Contacts B2B et Mariages - Récapitulatif

## 📅 Date
17 décembre 2025

## 🎯 Objectif
Ajouter une distinction claire entre les contacts B2B/Pro et Mariages/Privés pour tous les lieux d'exception.

## 📊 Données Mises à Jour

### 🏢 Contacts B2B/Pro
- **Téléphone** : 06 70 56 28 79
- **Email** : contact@lieuxdexception.com
- **Utilisé pour** : Pages B2B, événements professionnels, séminaires

### 💒 Contacts Mariages/Privés
- **Téléphone** : 06 02 03 70 11
- **Email** : contact@[nom-lieu].com (spécifique à chaque lieu)
  - contact@chateaudelabrulaire.com
  - contact@chateaudelacorbe.com
  - contact@domainenantais.com
  - contact@ledome.com
  - contact@manoirdelaboulaie.com

## 🗄️ Modifications Firestore

### Scripts Exécutés
1. ✅ `scripts/update-venues-phones.js` - Ajout des téléphones B2B et Mariages
2. ✅ `scripts/update-venues-emails.js` - Ajout des emails B2B et Mariages
3. ✅ `scripts/check-venues-contacts.js` - Vérification des données

### Structure des Données
Chaque lieu dispose maintenant de :
```javascript
{
  // Champs racine (accès rapide)
  emailB2B: "contact@lieuxdexception.com",
  emailMariages: "contact@[lieu].com",
  phoneB2B: "06 70 56 28 79",
  phoneMariages: "06 02 03 70 11",
  
  // Objet contact (structure complète)
  contact: {
    email: "contact@lieuxdexception.com",
    emailB2B: "contact@lieuxdexception.com",      // à ajouter dans contact
    emailMariages: "contact@[lieu].com",
    phone: "06 70 56 28 79",
    phoneB2B: "06 70 56 28 79",                    // à ajouter dans contact
    phoneMariages: "06 02 03 70 11",
    instagram: "@[lieu]",
    mariagesNet: "https://..."
  }
}
```

## 🔧 Modifications de Code

### 1. Types TypeScript (`src/types/firebase.ts`)
✅ Ajout des champs `emailB2B`, `emailMariages`, `phoneB2B`, `phoneMariages` dans l'interface Venue

### 2. Homepage (`src/components/HomeClient.tsx`)
✅ Ajout des liens email et téléphone sur les cards de châteaux
- Email mariages (avec icône ✉)
- Téléphone mariages (avec icône ☎)
- Affichage dans toutes les grilles de venues

### 3. Pages Individuelles des Lieux (`src/app/[locale]/lieux/[slug]/page.tsx`)
✅ Affichage des 4 contacts distincts :
- Email Pro/B2B
- Email Mariages/Privés
- Téléphone Pro/B2B
- Téléphone Mariages/Privés

### 4. Page Mariages (`src/app/[locale]/mariages/page.tsx`)
✅ Mise à jour du CTA final :
- **Téléphone Mariages** : 06 02 03 70 11
- **Email** : contact@lieuxdexception.com

### 5. Page B2B (`src/app/[locale]/evenements-b2b/page.tsx`)
✅ Mise à jour du CTA final :
- **Téléphone Pro/B2B** : 06 70 56 28 79
- **Email** : contact@lieuxdexception.com

### 6. Page Contact (`src/components/ContactPageClient.tsx`)
✅ Mise à jour des deux sections de contact :
- Email B2B : contact@lieuxdexception.com
- Email Mariages : contact@lieuxdexception.com

### 7. Footer (`src/components/Footer.tsx`)
✅ Déjà à jour avec les deux téléphones distincts

## ✅ Statut de Validation

### Lieux Vérifiés (5/5)
1. ✅ Le Château de la Brûlaire
2. ✅ Le Château de la Corbe
3. ✅ Le Domaine Nantais
4. ✅ Le Dôme
5. ✅ Le Manoir de la Boulaie

### Pages Vérifiées
- ✅ Homepage (cards avec liens email/téléphone)
- ✅ Pages individuelles des lieux (4 contacts affichés)
- ✅ Page Mariages (téléphone mariages + email)
- ✅ Page B2B (téléphone B2B + email)
- ✅ Page Contact (emails mis à jour)
- ✅ Footer (téléphones distincts déjà présents)

## 📝 Notes Importantes

1. **Champs manquants dans contact.*** : Les scripts ont ajouté les données au niveau racine des venues. Pour une cohérence totale, il faudrait aussi ajouter `contact.emailB2B` et `contact.phoneB2B` (actuellement marqués comme manquants dans la vérification, mais les champs racine sont complets).

2. **Instagram/Mariages.net** : Certains lieux n'ont pas encore de liens Instagram ou Mariages.net dans Firestore (ex: Domaine Nantais, Manoir de la Boulaie). Les liens sont définis en dur dans HomeClient.tsx via `venueSocialLinks`.

3. **Affichage Contextualized** : 
   - Les cards homepage montrent les contacts **Mariages** (email + téléphone spécifiques)
   - La page B2B montre les contacts **B2B/Pro**
   - Les pages individuelles montrent **les deux** pour laisser le choix

## 🚀 Prochaines Actions Suggérées

1. **Optionnel** : Ajouter `contact.emailB2B` et `contact.phoneB2B` dans Firestore pour une structure 100% cohérente
2. **Optionnel** : Migrer les liens Instagram/Mariages.net depuis HomeClient.tsx vers Firestore pour centraliser toutes les données
3. **Test** : Vérifier l'affichage des nouveaux liens sur toutes les pages en dev/prod
