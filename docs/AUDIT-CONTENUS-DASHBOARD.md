# 📊 AUDIT COMPLET - GESTION DES CONTENUS DASHBOARD

**Date**: 19 décembre 2025  
**Objectif**: Vérifier que tous les contenus publics sont gérables via le dashboard

---

## 🎯 RÉSUMÉ EXÉCUTIF

### Situation actuelle
- **5/9 pages** ont du contenu dans Firestore
- **2/9 pages** utilisent réellement Firestore dans leur code
- **Dashboard fonctionnel** pour 5 pages

### Problème identifié
⚠️ **Incohérence entre dashboard et code des pages** :
- Dashboard permet d'éditer Contact, Mariages, B2B
- **MAIS** ces pages ne chargent PAS le contenu Firestore dans leur code
- Le contenu est hardcodé dans les fichiers `.tsx`

---

## 📋 DÉTAIL PAR PAGE

### ✅ Pages FONCTIONNELLES (2/9)

#### 1. **Homepage** (`/`)
- ✅ Contenu dans Firestore
- ✅ Code charge depuis Firestore (`getPageContent`)
- ✅ Éditable via dashboard
- **Statut**: OPÉRATIONNEL

#### 2. **Histoire** (`/galerie-histoire`)
- ✅ Contenu dans Firestore
- ✅ Code charge depuis Firestore (`getPageContent`)
- ✅ Éditable via dashboard
- **Statut**: OPÉRATIONNEL

---

### ⚠️ Pages PARTIELLES (3/9) - **PRIORITÉ 1**

#### 3. **Contact** (`/contact`)
- ✅ Contenu dans Firestore (hero)
- ❌ Code **NE charge PAS** depuis Firestore
- ❌ Modifications dashboard **NON visibles** sur le site
- **Action requise**: Modifier `contact/page.tsx` pour charger depuis Firestore

#### 4. **Mariages** (`/mariages`)
- ✅ Contenu dans Firestore (hero + 1 section)
- ❌ Code **NE charge PAS** depuis Firestore
- ❌ Modifications dashboard **NON visibles** sur le site
- **Action requise**: Modifier `mariages/page.tsx` pour charger depuis Firestore

#### 5. **Événements B2B** (`/evenements-b2b`)
- ✅ Contenu dans Firestore (hero + 1 section)
- ❌ Code **NE charge PAS** depuis Firestore
- ❌ Modifications dashboard **NON visibles** sur le site
- **Action requise**: Modifier `evenements-b2b/page.tsx` pour charger depuis Firestore

---

### ❌ Pages HARDCODÉES (4/9) - **PRIORITÉ 2**

#### 6. **CGV** (`/cgv`)
- ❌ Pas de contenu Firestore
- ❌ 100% hardcodé (30 blocs de texte)
- **Recommandation**: Peut rester hardcodé (contenu légal statique)

#### 7. **Confidentialité** (`/confidentialite`)
- ❌ Pas de contenu Firestore
- ❌ 100% hardcodé (25 blocs de texte)
- **Recommandation**: Peut rester hardcodé (contenu légal statique)

#### 8. **Cookies** (`/cookies`)
- ❌ Pas de contenu Firestore
- ❌ 100% hardcodé (16 blocs de texte)
- **Recommandation**: Peut rester hardcodé (contenu légal statique)

#### 9. **Mentions Légales** (`/mentions-legales`)
- ❌ Pas de contenu Firestore
- ❌ 100% hardcodé (4 blocs de texte)
- **Recommandation**: Peut rester hardcodé (contenu légal statique)

---

## 🚨 PROBLÈMES IDENTIFIÉS

### 1. Incohérence Dashboard ↔ Site
**Symptôme**: On peut éditer Contact/Mariages/B2B dans le dashboard, mais ça ne change rien sur le site

**Cause**: Les fichiers `.tsx` ne chargent pas le contenu Firestore

**Impact**: 
- ❌ Dashboard inutile pour ces pages
- ❌ Confusion pour l'utilisateur
- ❌ Données Firestore inexploitées

### 2. Traductions manquantes
- ⚠️ Seulement **français** (1/6 langues)
- ❌ Pas de contenu EN, ES, DE, IT, PT

---

## ✅ PLAN D'ACTION PRUDENT

### Phase 1 : Réparer les pages partielles (PRIORITÉ)

#### Contact (`/contact`)
```bash
# 1. Vérifier le contenu Firestore existant
# 2. Modifier contact/page.tsx pour charger depuis Firestore
# 3. Tester localement AVANT déploiement
# 4. Comparer visuellement hardcodé vs Firestore
# 5. Déployer seulement si identique
```

**Code à ajouter** :
```typescript
// Dans contact/page.tsx
const pageContent = await getPageContent('contact', locale);

// Utiliser pageContent.hero au lieu du texte hardcodé
```

#### Mariages (`/mariages`)
```bash
# Même processus que Contact
```

#### B2B (`/evenements-b2b`)
```bash
# Même processus que Contact
```

### Phase 2 : Pages légales (OPTIONNEL)

**Recommandation**: **NE PAS MIGRER**

**Raison**:
- Contenu légal statique
- Rarement modifié
- Complexité technique vs bénéfice faible
- Risque de casser des pages légales

---

## 🛡️ PRÉCAUTIONS DE SÉCURITÉ

### Avant chaque modification

1. ✅ **Backup du contenu Firestore**
   ```bash
   node scripts/audit-firestore-details.js > backup-firestore-$(date +%Y%m%d).txt
   ```

2. ✅ **Screenshot de la page actuelle**
   - Capturer visuellement la page avant modification

3. ✅ **Test local d'abord**
   - Modifier le code
   - Tester sur `localhost:3002`
   - Vérifier visuellement (texte, images, layout)

4. ✅ **Comparaison visuelle**
   - Page hardcodée (prod actuelle)
   - Page Firestore (local)
   - **Doivent être IDENTIQUES**

5. ✅ **Build de production**
   ```bash
   npm run build
   ```
   - ❌ Si erreur → Ne PAS déployer

6. ✅ **Déploiement progressif**
   - Déployer 1 page à la fois
   - Vérifier en production
   - Attendre 5 min pour vérifier logs
   - Puis page suivante

### En cas de problème

**Rollback immédiat** :
```bash
git revert HEAD
git push
```

---

## 📝 CHECKLIST AVANT DÉPLOIEMENT

### Contact
- [ ] Contenu Firestore vérifié
- [ ] Code modifié et testé localement
- [ ] Visuellement identique (hardcodé vs Firestore)
- [ ] Build production OK
- [ ] Screenshots avant/après
- [ ] Déployé et vérifié en prod

### Mariages
- [ ] Contenu Firestore vérifié
- [ ] Code modifié et testé localement
- [ ] Visuellement identique
- [ ] Build production OK
- [ ] Screenshots avant/après
- [ ] Déployé et vérifié en prod

### B2B
- [ ] Contenu Firestore vérifié
- [ ] Code modifié et testé localement
- [ ] Visuellement identique
- [ ] Build production OK
- [ ] Screenshots avant/après
- [ ] Déployé et vérifié en prod

---

## 🎯 RECOMMANDATIONS FINALES

### À FAIRE (Priorité 1)
1. **Contact, Mariages, B2B** : Connecter au contenu Firestore existant
2. Vérifier visuellement que rien ne casse
3. Déployer progressivement

### À NE PAS FAIRE
1. ❌ Ne PAS migrer les pages légales (CGV, Mentions, etc)
2. ❌ Ne PAS ajouter de nouvelles sections sans vérifier
3. ❌ Ne PAS déployer sans tester localement d'abord

### Bénéfices attendus
- ✅ Dashboard 100% fonctionnel pour 5 pages
- ✅ Modifications visibles immédiatement
- ✅ Cohérence dashboard ↔ site

---

**Prochaine étape recommandée** : Commencer par la page **Contact** (la plus simple)
