# Troubleshooting Connexion Odoo

## Problème : Authentification échoue (UID vide)

### Diagnostic étape par étape

#### 1. Vérifier les credentials dans Odoo

**a) URL correcte :**
- ✅ Votre instance : `https://groupe-lr.odoo.com`
- ✅ Base de données : `groupe-lr`

**b) Vérifier l'utilisateur :**

1. Connectez-vous à https://groupe-lr.odoo.com
2. Allez dans **Paramètres** → **Utilisateurs et entreprises** → **Utilisateurs**
3. Cherchez : `contact@lieuxdexception.com`
4. Vérifiez :
   - ✅ Utilisateur **actif** (pas archivé)
   - ✅ Type d'accès : **Utilisateur interne** (pas portail)
   - ✅ Droits CRM : Application **CRM** cochée

**c) Régénérer la clé API (recommandé) :**

1. Connectez-vous avec `contact@lieuxdexception.com`
2. Cliquez sur votre nom → **Préférences**
3. Onglet **Sécurité du compte**
4. Section **Clés API** :
   - Supprimez toutes les clés existantes
   - Cliquez sur **Nouvelle clé API**
   - Description : `Site Web Lieux d'Exception`
   - **IMPORTANT** : Copiez la clé IMMÉDIATEMENT (format : `abc123...xyz789`)
   - Collez-la dans `.env.local` :
     ```bash
     ODOO_API_KEY=la_cle_copiee_ici
     ```

#### 2. Vérifier la version d'Odoo

Sur https://groupe-lr.odoo.com :
1. Allez dans **Paramètres** → **À propos**
2. Notez la version : **Odoo 17.x** ou **Odoo 18.x** ?

**Odoo 17/18 utilise l'authentification par clé API.**

Si c'est une version inférieure (16 ou moins), l'authentification est différente.

#### 3. Test manuel avec curl

Testez directement l'API Odoo depuis le terminal :

```bash
# Test 1 : Vérifier que l'API XML-RPC répond
curl -X POST https://groupe-lr.odoo.com/xmlrpc/2/common \
  -H "Content-Type: text/xml" \
  -d '<?xml version="1.0"?>
<methodCall>
  <methodName>version</methodName>
  <params></params>
</methodCall>'
```

Devrait retourner la version d'Odoo.

```bash
# Test 2 : Tester l'authentification
curl -X POST https://groupe-lr.odoo.com/xmlrpc/2/common \
  -H "Content-Type: text/xml" \
  -d '<?xml version="1.0"?>
<methodCall>
  <methodName>authenticate</methodName>
  <params>
    <param><value><string>groupe-lr</string></value></param>
    <param><value><string>contact@lieuxdexception.com</string></value></param>
    <param><value><string>VOTRE_CLE_API_ICI</string></value></param>
    <param><value><struct></struct></value></param>
  </params>
</methodCall>'
```

**Résultat attendu :**
```xml
<methodResponse>
  <params>
    <param><value><int>123</int></value></param>  <!-- UID de l'utilisateur -->
  </params>
</methodResponse>
```

**Si ça retourne `false` ou `0` :**
- ❌ Clé API invalide
- ❌ Email incorrect
- ❌ Base de données incorrecte

#### 4. Causes courantes

**a) Nom de base incorrect :**

Le nom dans l'URL n'est pas forcément le nom de la base. Testez ces variantes :

```bash
# Dans .env.local, essayez :
ODOO_DB=groupe-lr
# OU
ODOO_DB=groupe-lr-main
# OU
ODOO_DB=groupe_lr
```

**b) Clé API mal copiée :**
- Espaces au début/fin
- Retour à la ligne
- Caractères invisibles

**c) Utilisateur portail :**

Si `contact@lieuxdexception.com` est un **utilisateur portail**, il ne peut PAS utiliser l'API.
→ Il faut un **utilisateur interne** avec droits CRM.

**d) Authentification à deux facteurs :**

Si l'authentification 2FA est activée, les clés API peuvent ne pas fonctionner.
→ Désactiver temporairement la 2FA pour ce compte.

#### 5. Solution alternative : Utilisateur technique dédié

Créez un utilisateur spécifique pour l'API :

1. Dans Odoo : **Paramètres** → **Utilisateurs** → **Créer**
2. Nom : `API Site Web`
3. Email : `api-web@lieuxdexception.com` (ou autre)
4. Type d'accès : **Utilisateur interne**
5. Droits : Application **CRM** (lecture + écriture)
6. Générez une clé API pour cet utilisateur
7. Utilisez ces credentials dans `.env.local`

### Test final

Après avoir mis à jour `.env.local` :

```bash
# 1. Vérifier les variables
cat .env.local | grep ODOO

# 2. Tester la connexion
node scripts/test-odoo-connection.js

# 3. Si ça marche, tester la création d'un lead
node scripts/test-odoo-connection.js --create-test-lead
```

### Résultat attendu

```
✅ Authentification Odoo réussie, UID: 123
✅ Accès au module CRM confirmé
✅ Lead de test créé avec succès !
   ID Odoo: 456
```

---

## Support

Si le problème persiste après ces vérifications :

1. Contactez votre administrateur Odoo
2. Vérifiez les logs Odoo (si vous avez accès)
3. Testez avec un autre utilisateur admin pour isoler le problème
