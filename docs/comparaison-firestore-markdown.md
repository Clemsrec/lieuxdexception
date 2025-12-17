# Rapport de comparaison : Données Firestore vs Fichiers Markdown

Date: 16 décembre 2025

## 1. Le Château de la Brûlaire

### ✅ Données présentes dans Firestore
- Description complète ✅
- Capacités: seated 350, standing 450 ✅
- Espaces: Salons, Orangerie, Terrasse, Parc ✅
- Hébergement: présent ✅
- Contact, adresse, coordonnées GPS ✅

### ⚠️ Données manquantes (trouvées dans le .md)
- **Nombre de salles**: 4 salles (non spécifié en Firestore)
- **Nombre de chambres**: 15 chambres dont 8 twin (accommodation: true mais pas de détail)
- **Salles détaillées**:
  - Comte du Fou: 100 m²
  - L'Orangerie: 200 m²
  - Salons du Château: 200 m²
  - Parc: 5000 m²
- **Capacités par type**:
  - Réunion: 20 pers
  - Salle en U: 20 pers
  - Théâtre: 200 pers (Firestore a 350 seated - incohérence?)
  - Cabaret: 3500 pers
  - Banquet: 170 pers (Firestore a 350 seated - incohérence?)
  - Cocktail: non spécifié (Firestore a 450)
- **Équipements**: Son, Écran LCD, Vidéoprojecteur, Wifi, Paperboard, DJ, Animations, Micro
- **Activités**: Rallye & Chasse au trésor
- **Parking**: 100 places (non dans Firestore)

---

## 2. Le Château de la Corbe

### ✅ Données présentes dans Firestore
- Description complète ✅
- Parc 25 hectares ✅
- Orangerie 380m² ✅
- Capacités max: 300 seated/standing ✅
- Contact, adresse ✅

### ⚠️ Données manquantes (trouvées dans le .md)
- **Nombre de salles**: 3 salles (non spécifié)
- **Salles détaillées**:
  - Salle Atlantique: 70 m²
  - L'Orangerie: 380 m² (mentionné mais pas détaillé)
  - Parc: 25000 m²
- **Capacités par salle**:
  - Salle Atlantique:
    - Réunion: 25 pers
    - Salle en U: 25 pers
    - Théâtre: 70 pers
    - Rang d'école: 35 pers
  - L'Orangerie:
    - Théâtre: 300 pers ✅
    - Cabaret: 250 pers
    - Banquet: 300 pers ✅
    - Cocktail: 450 pers
  - Parc:
    - Cocktail: 5000 pers (Firestore a 300 max - GROSSE incohérence!)
- **Statut**: Nouveau (tag à ajouter?)

---

## 3. Le Domaine Nantais

### ✅ Données présentes dans Firestore
- Parc 1 hectare ✅
- Rénové mars 2025 ✅
- Terrasse et patio 80m² ✅
- Capacités: 220 max ✅
- Contact, adresse ✅

### ⚠️ Données manquantes (trouvées dans le .md)
- **Nombre de salles**: 3 salles (non spécifié)
- **Privatisable**: oui (non indiqué)
- **Salles détaillées**:
  - Grande Salle: 200 m²
  - Espace Accueil: 120 m²
  - Le Parc: 1500 m²
- **Capacités par type**:
  - Réunion: 25 pers
  - Salle en U: 30 pers
  - Théâtre: 200 pers
  - Cabaret: 50 pers
  - Rang d'école: 100 pers
  - Banquet: 400 pers (Firestore a 180 - incohérence!)
  - Cocktail: 100 pers (Firestore a 220 - incohérence!)
- **Équipements**: Son, Écran LCD, Micro, DJ, Vidéoprojecteur, Paperboard, Wifi
- **Services**: Vestiaire, Piste de danse, Parking sur place, Accès PMR, Terrasse, Jardin, Cuisine événementielle
- **Activités**: Multi-Activités & Olympiades, Oenologie, Rallye & Chasse au trésor, VTT

---

## 4. Le Manoir de la Boulaie

### ✅ Données présentes dans Firestore
- 600m² salons ✅
- Parc 1,5 ha ✅ (mais .md dit "1 ha" - incohérence mineure)
- Plage privée ✅
- 250 pers max ✅
- Contact, adresse ✅

### ⚠️ Données manquantes (trouvées dans le .md)
- **Nombre de salles**: 11 salles (très important!)
- **Nombre de chambres**: 11 chambres (accommodation absent en Firestore)
- **Salles détaillées**:
  - Salon séminaires et réceptions: 280 m²
  - Salon de travail: 70 m²
  - Salon privé: 40 m²
  - L'Orangerie: 280 m²
  - L'Amphi: 130 m²
  - + 6 autres salles non détaillées
- **Capacités par type**:
  - Réunion: 70 pers
  - Salle en U: 50 pers
  - Théâtre: 250 pers ✅
  - Cabaret: 170 pers
  - Rang d'école: 170 pers
  - Banquet: 250 pers
  - Cocktail: 300 pers
- **Équipements**: Wifi, DJ, Animations, Écran LCD, Micro, Paperboard, Son, Blocs-notes & stylo, Vidéoprojecteur
- **Services**: Terrain de pétanque, Plage privée ✅, Espace détente, Accès PMR, Jardin, Parking, Terrasse, Piscine, Spa, Vestiaire, Cuisine événementielle
- **Activités**: Oenologie, Cours de cuisine, Multi-Activités & Olympiades, Murder Party, Rallye & Chasse au trésor
- **Statut**: "Ouverture prochainement!" (tag à ajouter?)

---

## 📊 Synthèse des données manquantes

### Données structurelles manquantes (toutes venues):
1. **Nombre de salles** (4, 3, 3, 11)
2. **Nombre de chambres** (15, 0, 0, 11)
3. **Superficie des salles** (m²)
4. **Capacités par configuration** (Réunion, U, Théâtre, Cabaret, École, Banquet, Cocktail)

### Incohérences à corriger:
1. **Le Château de la Corbe**: Cocktail parc 5000 pers (Firestore dit max 300)
2. **Le Domaine Nantais**: Banquet 400 pers (Firestore dit 180), Cocktail 100 (Firestore dit 220)
3. **Le Château de la Brûlaire**: Théâtre 200 pers (Firestore dit 350)

### Équipements à ajouter partout:
- Équipement son, Écran LCD, Vidéoprojecteur, Wifi, Paperboard, DJ, Animations, Micro
- Services: Vestiaire, Piste de danse, PMR, Cuisine événementielle

### Activités à ajouter:
- Rallye & Chasse au trésor
- Oenologie
- Multi-Activités & Olympiades
- Murder Party
- VTT
- Cours de cuisine

---

## ⚠️ Données PRIX (à NE PAS ajouter selon consigne)

Les fichiers .md contiennent des formules et tarifs détaillés pour chaque château:
- Demi-journée d'étude
- Journée d'étude
- Cocktail dînatoire
- Soirée dansante
- Location salle seule

❌ **Ces données ne doivent PAS être ajoutées au site public** selon ta consigne.

---

## 🎯 Actions recommandées

### Haute priorité:
1. ✅ Ajouter nombre de salles pour chaque venue
2. ✅ Ajouter nombre de chambres (Brûlaire 15, Boulaie 11)
3. ✅ Corriger les incohérences de capacités
4. ✅ Ajouter détail des salles avec superficies

### Priorité moyenne:
5. Ajouter équipements manquants (son, écrans, etc.)
6. Ajouter services manquants (vestiaire, PMR, etc.)
7. Ajouter activités disponibles

### Priorité basse:
8. Ajouter statut "Nouveau" pour Le Château de la Corbe
9. Ajouter statut "Ouverture prochaine" pour Manoir Boulaie
