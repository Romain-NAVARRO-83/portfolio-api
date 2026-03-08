Récupérer et envoyer le token CSRF

Pré-requis
- Le serveur expose `GET /api/csrf-token` qui :
  - place un cookie `XSRF-TOKEN` (non httpOnly) ;
  - renvoie `{ csrfToken: "..." }` en JSON.
- CORS doit autoriser les credentials et le front doit envoyer les cookies (fetch/axios avec credentials).

1) Méthode recommandée — utiliser le token renvoyé en JSON

Exemple (fetch) :

const getCsrf = async () => {
  const res = await fetch('/api/csrf-token', { credentials: 'include' });
  const { csrfToken } = await res.json();
  return csrfToken;
};

const postData = async (payload) => {
  const token = await getCsrf();
  await fetch('/api/endpoint', {
    method: 'POST',
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
      'x-xsrf-token': token // ou 'x-csrf-token'
    },
    body: JSON.stringify(payload)
  });
};

2) Méthode alternative — lire le cookie `XSRF-TOKEN`

Si le cookie n'est pas httpOnly, le client peut le lire :

function readCookie(name) {
  const v = document.cookie.match('(^|;)\\s*' + name + '\\s*=\\s*([^;]+)');
  return v ? decodeURIComponent(v.pop()) : null;
}

const postUsingCookie = async (payload) => {
  const token = readCookie('XSRF-TOKEN');
  await fetch('/api/endpoint', {
    method: 'POST',
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
      'x-xsrf-token': token
    },
    body: JSON.stringify(payload)
  });
};

3) Exemple avec axios

import axios from 'axios';
axios.defaults.withCredentials = true;

const getCsrfAxios = async () => {
  const { data } = await axios.get('/api/csrf-token');
  return data.csrfToken;
};

const postAxios = async (payload) => {
  const token = await getCsrfAxios();
  await axios.post('/api/endpoint', payload, {
    headers: { 'x-xsrf-token': token }
  });
};

Remarques de sécurité courtes
- En production, utilisez HTTPS et cookies `secure`.
- Si le front et l’API sont sur des domaines différents : configurez correctement `Access-Control-Allow-Origin` et `Access-Control-Allow-Credentials` côté serveur, et utilisez `credentials: 'include'` côté client.
- Si vous ne voulez pas exposer le cookie au JavaScript, préférez renvoyer uniquement le token côté serveur dans l’en-tête Set-Cookie (httpOnly true) et utiliser un mécanisme alternatif (ex. double submit cookie nécessite cookie lisible par JS).
