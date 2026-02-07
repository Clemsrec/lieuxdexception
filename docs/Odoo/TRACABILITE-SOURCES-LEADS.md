# 🎯 Configuration Odoo - Traçabilité des Sources de Leads

**Objectif :** Identifier clairement d'où viennent les leads dans Odoo CRM

---

## 📊 Champs de Traçabilité Utilisés

### 1. **Sources (`utm.source`)**
**Navigation :** CRM → Configuration → Sources

Créer ces sources dans Odoo :
```
ID | Nom | Description
1  | Site Web | Formulaire site lieuxdexception.com
2  | Google Ads | Campagnes publicitaires Google
3  | Facebook | Réseaux sociaux
4  | Email | Newsletters et mailings
5  | Salon | Salons et événements
6  | Téléphone | Appels directs
7  | Recommandation | Bouche-à-oreille
```

### 2. **Médiums (`utm.medium`)**
**Navigation :** CRM → Configuration → Médiums

```
ID | Nom | Description
1  | Direct | Trafic direct
2  | Organique | SEO naturel
3  | PPC | Publicité payante (Google Ads)
4  | Social | Réseaux sociaux
5  | Email | Campagnes email
6  | Référent | Site référent
```

### 3. **Campagnes (`utm.campaign`)**
**Navigation :** CRM → Configuration → Campagnes

```
ID | Nom | Période | Budget
3  | Lieux Exception 2026 - B2B | Jan-Déc 2026 | 10000€
4  | Mariages 2026 | Jan-Déc 2026 | 5000€
5  | Campagne Été 2026 | Mai-Sep 2026 | 3000€
```

### 4. **Tags (`crm.tag`)**
**Navigation :** CRM → Configuration → Tags

```
ID | Nom | Couleur | Usage
1  | Site Web | Bleu | Leads du site
2  | B2B | Vert | Événements entreprise
3  | Loire-Atlantique | Orange | Localisation
4  | Prioritaire | Rouge | Leads importants
5  | Mariage | Rose | Événements privés
6  | Premium | Doré | Clients haute valeur
7  | Récurrent | Violet | Clients fidèles
```

---

## 🔧 Configuration dans Odoo

### Étape 1 : Créer les Sources
1. **CRM → Configuration → Sources**
2. Cliquer **"Créer"**
3. Remplir : 
   - Nom : `Site Web`
   - Code : `website`
   - Description : `Formulaire de contact sur lieuxdexception.com`

### Étape 2 : Créer les Médiums
1. **CRM → Configuration → Médiums**
2. Créer `Organique` avec code `organic`

### Étape 3 : Créer les Tags
1. **CRM → Configuration → Tags**
2. Créer chaque tag avec sa couleur

### Étape 4 : Récupérer les IDs
```sql
-- Dans Odoo (Paramètres → Technique → Interface base de données)
SELECT id, name FROM utm_source WHERE name = 'Site Web';
SELECT id, name FROM utm_medium WHERE name = 'Organique';  
SELECT id, name FROM crm_tag WHERE name IN ('Site Web', 'B2B', 'Mariage');
```

---

## 📋 Identification dans l'Interface Odoo

### Vue Liste des Leads
**Colonnes visibles :**
- 📧 **Email** : Email du prospect
- 🏷️ **Tags** : `Site Web`, `B2B` ou `Mariage`
- 🎯 **Source** : `Site Web`
- 📱 **Médium** : `Organique`
- ⭐ **Priorité** : ⭐ (B2B) ou ⭐⭐ (Mariage)
- 👤 **Référent** : `Site Web Lieux d'Exception - Formulaire B2B`

### Fiche Détaillée du Lead
**Onglet Principal :**
```
Nom : Demande B2B - Test Corp (Jean Dupont)
Contact : Jean Dupont
Email : jean@testcorp.com
Téléphone : 06 12 34 56 78
Entreprise : Test Corp

🎯 TRAÇABILITÉ
Source : Site Web
Médium : Organique  
Campagne : Lieux Exception 2026 - B2B
Référent : Site Web Lieux d'Exception - Formulaire B2B
Tags : Site Web, B2B, Loire-Atlantique
```

**Onglet Description :**
```
=== Demande d'Événement B2B ===

Contact: Jean Dupont
Email: jean@testcorp.com
Téléphone: 06 12 34 56 78
Entreprise: Test Corp
Poste: Directeur Commercial

Type d'événement: seminar
Date souhaitée: 2026-06-15
Nombre de participants: 50

Message:
Nous organisons notre séminaire annuel et cherchons un lieu prestigieux...

---
Source: Site Web Lieux d'Exception
Date: 07/02/2026 15:45:00
```

---

## 📊 Rapports et Analyses

### 1. **Pipeline par Source**
**Navigation :** CRM → Rapports → Pipeline

Voir la performance de chaque source :
- `Site Web` : 45 leads, 12 opportunités, 8 conversions
- `Google Ads` : 23 leads, 8 opportunités, 3 conversions
- `Recommandation` : 15 leads, 12 opportunités, 10 conversions

### 2. **Analyse ROI par Médium**
Comparer l'efficacité :
- `Organique` (SEO) : Gratuit, conversion 25%
- `PPC` (Google Ads) : Coûteux, conversion 15%
- `Social` : Moyen, conversion 20%

### 3. **Filtrages Avancés**
**Exemples de recherches :**
```
Tags contient "Site Web" ET Source = "Site Web"
→ Tous les leads du site

Campagne = "Mariages 2026" ET Statut = "Gagné"
→ Mariages convertis cette année

Priorité = "Haute" ET Équipe = "B2B"
→ Leads B2B prioritaires
```

---

## 🔍 Vues Personnalisées Recommandées

### Vue "Leads Site Web"
**Filtre :** `Source = Site Web`
**Colonnes :**
- Contact, Email, Téléphone, Entreprise
- Tags, Priorité, Date création
- Commercial assigné, Statut

### Vue "B2B vs Mariages"  
**Groupé par :** Tags (B2B / Mariage)
**Filtre :** Actifs seulement
**Tri :** Par date création (récent en premier)

### Tableau de Bord "Sources de Leads"
**KPIs :**
- 📈 Leads par source (graphique)
- 💰 CA par médium
- 🎯 Taux conversion par campagne
- ⏱️ Temps moyen de conversion

---

## 🚀 Automatisations Possibles

### 1. **Attribution Automatique**
```javascript
// Règle Odoo : Si source = "Site Web" → Assigner à équipe "Web"
if (lead.source_id == 1) { // Site Web
  lead.team_id = lead.tag_ids.includes(2) ? 1 : 2; // B2B → équipe 1, Mariage → équipe 2
}
```

### 2. **Notifications Intelligentes**
- Lead B2B prioritaire → Slack commercial B2B
- Lead mariage premium → Email responsable mariages
- Lead sans réponse 48h → Relance automatique

### 3. **Scoring Automatique**
```javascript
let score = 0;
if (lead.source_id == 1) score += 10; // Site web = +10
if (lead.priority == '1') score += 15; // Haute priorité = +15  
if (lead.tag_ids.includes(6)) score += 20; // Tag Premium = +20
```

---

## ✅ Checklist Configuration

- [ ] Créer sources dans Odoo (`Site Web` = ID 1)
- [ ] Créer médiums (`Organique` = ID 2) 
- [ ] Créer campagnes (`B2B 2026` = ID 3, `Mariages 2026` = ID 4)
- [ ] Créer tags avec couleurs (`Site Web`, `B2B`, `Mariage`)
- [ ] Récupérer les IDs et mettre à jour le code
- [ ] Tester un lead et vérifier la traçabilité
- [ ] Configurer les vues personnalisées
- [ ] Former l'équipe commerciale sur les nouveaux champs

**🎯 Résultat :** Traçabilité complète de tous les leads depuis leur source jusqu'à la conversion !