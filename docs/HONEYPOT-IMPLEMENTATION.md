# Honeypot Anti-Bot - Instructions

## 🎯 Objectif
Ajouter un champ honeypot caché dans tous les formulaires pour bloquer les bots automatiques.

## 📝 Principe
Les bots remplissent TOUS les champs d'un formulaire. En ajoutant un champ invisible aux humains mais visible pour les bots, on peut détecter les soumissions automatiques.

## 🛠️ Implémentation

### 1. Ajouter champ honeypot dans ContactFormSwitcher.tsx

**Emplacement :** Après les champs visibles, avant le bouton submit

```tsx
{/* Honeypot anti-bot (caché visuellement) */}
<input
  type="text"
  name="website"
  id="website"
  autoComplete="off"
  tabIndex={-1}
  aria-hidden="true"
  className="absolute -left-[9999px] w-1 h-1 opacity-0 pointer-events-none"
  value={formData.website || ''}
  onChange={(e) => setFormData({ ...formData, website: e.target.value })}
/>
```

**Explications :**
- `tabIndex={-1}` : Ne peut pas être atteint via Tab
- `aria-hidden="true"` : Invisible pour lecteurs d'écran
- `absolute -left-[9999px]` : Positionné hors écran
- `autoComplete="off"` : Empêche navigateur de le remplir

### 2. Styles CSS supplémentaires (optionnel)

Dans `globals.css` :

```css
/* Honeypot anti-bot */
input[name="website"],
input[id="website"] {
  position: absolute !important;
  left: -9999px !important;
  width: 1px !important;
  height: 1px !important;
  opacity: 0 !important;
  pointer-events: none !important;
}
```

### 3. Schéma Zod (déjà géré côté serveur)

Le champ `website` n'est PAS dans les schémas Zod (`b2bFormSchema`, `weddingFormSchema`), donc il est ignoré lors de la validation et extrait séparément dans l'API route :

```typescript
const { type, website, ...formData } = body;

// Si website rempli → Bot détecté
if (website) {
  return NextResponse.json({ error: 'Bot détecté' }, { status: 400 });
}
```

### 4. Test Manuel

**Test humain (doit fonctionner) :**
1. Remplir formulaire normalement
2. Soumettre
3. ✅ Lead créé en Firestore

**Test bot (doit échouer) :**
1. Ouvrir console navigateur
2. `document.querySelector('input[name="website"]').value = 'bot@test.com'`
3. Soumettre formulaire
4. ❌ Erreur 400 "Erreur de validation"

## 🔒 Sécurité Ajoutée

| Protection | Avant | Après |
|------------|-------|-------|
| Bots automatiques (scrapers) | ❌ Non détectés | ✅ Bloqués (honeypot) |
| Bots intelligents (JavaScript) | ❌ Passent | ⚠️ Détectés si remplissent tous champs |
| Spam manuel humain | ❌ Possible | ⚠️ Limité par rate limiting (5/min) |

## 📊 Monitoring

Logs à surveiller dans Cloud Functions :

```
[Security] Bot détecté via honeypot: { ip: '192.168.1.1', website: 'spam@bot.com' }
```

Si beaucoup de détections → Ajouter IP à blocklist (Cloudflare Firewall Rules).

## 🚀 Déploiement

1. ✅ API route déjà protégée (`api/contact/submit/route.ts`)
2. ⏳ Ajouter champ dans `ContactFormSwitcher.tsx` (frontend)
3. ⏳ Tester en local (`npm run dev`)
4. ⏳ Déployer (`firebase deploy --only hosting`)

## 📚 Références

- [OWASP Honeypot Best Practices](https://owasp.org/www-community/controls/Honeypot)
- [Cloudflare Bot Management](https://www.cloudflare.com/products/bot-management/)
