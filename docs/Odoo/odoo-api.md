Pour remonter les leads CRM Odoo depuis ton formulaire Next.js, tu vas : 1) poster le form vers une route API Next, 2) appeler l’API Odoo avec la clé, 3) créer un `crm.lead`.[1][2]

## 1. Principe général

- Next.js joue le rôle de **backend proxy** : ton formulaire ne parle jamais directement à Odoo, il appelle `/api/contact`.[3][4]
- La route `/api/contact` s’authentifie sur Odoo avec **email + clé API** et crée un lead dans le module CRM (`crm.lead`).[5][1]

## 2. Modèle de données côté Odoo

Les champs basiques utiles pour un site vitrine :  
- `name` : sujet du lead (ex: “Demande de contact – Lieux d’Exception”).[5]
- `contact_name`, `email_from`, `phone` : identité et coordonnées.[2]
- `description` : message du formulaire.[5]

Tu peux aussi fixer en dur :  
- `type` = `"opportunity"` ou `"lead"` selon ta config.[2]
- `team_id` : équipe CRM à affecter (optionnel).[5]

## 3. Route API Next.js (App Router)

Exemple en Next 15 avec `app/api/contact/route.ts` utilisant XML-RPC + clé API Odoo :

```ts
// app/api/contact/route.ts
import xmlrpc from 'xmlrpc';

const ODOO_URL = process.env.ODOO_URL!;        // ex: https://mon-instance.odoo.com
const ODOO_DB = process.env.ODOO_DB!;          // nom de la base Odoo
const ODOO_LOGIN = process.env.ODOO_LOGIN!;    // email utilisateur
const ODOO_API_KEY = process.env.ODOO_API_KEY!; // clé API récupérée dans Odoo

export async function POST(req: Request) {
  try {
    const { name, email, phone, message } = await req.json();

    if (!name || !email || !message) {
      return new Response(JSON.stringify({ error: 'Missing fields' }), { status: 400 });
    }

    // Client XML-RPC "common" pour login → uid
    const common = xmlrpc.createClient({
      url: `${ODOO_URL}/xmlrpc/2/common`,
    });

    const uid: number = await new Promise((resolve, reject) => {
      common.methodCall(
        'authenticate',
        [ODOO_DB, ODOO_LOGIN, ODOO_API_KEY, {}],
        (err: any, value: any) => (err ? reject(err) : resolve(value))
      );
    });

    if (!uid) {
      return new Response(JSON.stringify({ error: 'Odoo auth failed' }), { status: 401 });
    }

    // Client XML-RPC "object" pour appeler les modèles
    const models = xmlrpc.createClient({
      url: `${ODOO_URL}/xmlrpc/2/object`,
    });

    const leadData = {
      name: `Demande site vitrine - ${name}`,
      contact_name: name,
      email_from: email,
      phone: phone || '',
      description: message,
      type: 'opportunity', // ou 'lead' selon ta config
    };

    const leadId: number = await new Promise((resolve, reject) => {
      models.methodCall(
        'execute_kw',
        [
          ODOO_DB,
          uid,
          ODOO_API_KEY,
          'crm.lead',
          'create',
          [leadData],
        ],
        (err: any, value: any) => (err ? reject(err) : resolve(value))
      );
    });

    return new Response(JSON.stringify({ success: true, leadId }), { status: 200 });
  } catch (e: any) {
    console.error('Odoo lead error', e);
    return new Response(JSON.stringify({ error: 'Server error' }), { status: 500 });
  }
}
```

Ce pattern suit la doc Odoo External API : `authenticate()` sur `/xmlrpc/2/common`, puis `execute_kw()` sur `/xmlrpc/2/object`.[6][5]

## 4. Formulaire côté Next.js (frontend)

Composant client minimal qui tape ta route API :

```tsx
'use client';

import { useState } from 'react';

export function ContactForm() {
  const [loading, setLoading] = useState(false);
  const [ok, setOk] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setOk(false);
    setError(null);

    const form = e.currentTarget;
    const body = {
      name: (form.elements.namedItem('name') as HTMLInputElement).value,
      email: (form.elements.namedItem('email') as HTMLInputElement).value,
      phone: (form.elements.namedItem('phone') as HTMLInputElement).value,
      message: (form.elements.namedItem('message') as HTMLTextAreaElement).value,
    };

    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });

      if (!res.ok) {
        const json = await res.json().catch(() => ({}));
        throw new Error(json.error || 'Erreur serveur');
      }

      setOk(true);
      form.reset();
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 max-w-xl">
      <input name="name" placeholder="Nom" required className="w-full border p-2" />
      <input name="email" type="email" placeholder="Email" required className="w-full border p-2" />
      <input name="phone" placeholder="Téléphone" className="w-full border p-2" />
      <textarea name="message" placeholder="Votre message" required className="w-full border p-2 h-32" />
      <button
        type="submit"
        disabled={loading}
        className="px-4 py-2 bg-black text-white disabled:opacity-50"
      >
        {loading ? 'Envoi…' : 'Envoyer'}
      </button>
      {ok && <p className="text-green-600">Merci, votre message a bien été envoyé.</p>}
      {error && <p className="text-red-600">{error}</p>}
    </form>
  );
}
```

La logique est conforme aux bonnes pratiques d’intégration Odoo/Next : le front reste simple et tout ce qui touche à la clé API est caché côté serveur.[7][3]

## 5. Sécurité, env & tests

- Mets `ODOO_URL`, `ODOO_DB`, `ODOO_LOGIN`, `ODOO_API_KEY` en variables d’environnement (GCP Secret Manager ou `.env.local`), jamais dans le code.[7][2]
- Limite le spam : reCAPTCHA v3, honeypot, ou vérification d’origine sur la route `/api/contact`.[4]
- Teste d’abord sur une base de test Odoo : tu pourras vérifier que les leads arrivent bien dans le module CRM avec les bons champs.[1]

Si tu me donnes la structure précise du formulaire (champs, langues, type de demandes), la prochaine étape peut être de mapper finement vers les bons champs Odoo (tags, pipeline, équipe).

[1](https://www.cybrosys.com/blog/how-to-connect-with-odoo-17-using-api-key)
[2](https://www.getknit.dev/blog/odoo-api-integration-guide-in-depth)
[3](https://www.heliconia.io/post/integrate-next-js-website-with-odoo)
[4](https://www.turnk.co/articles/odoo-api-le-guide-complet-2025-pour-connecter-et-automatiser-votre-gestion)
[5](https://www.odooai.cn/documentation/16.0/developer/reference/external_api.html)
[6](https://odoo-master.readthedocs.io/en/master/api_integration.html)
[7](https://www.cudio.com/odoo-api-integration-how-to-seamlessly-connect-your-business-applications)