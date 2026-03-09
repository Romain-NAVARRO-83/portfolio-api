# portfolio-api

## Database

Le projet utilise Postgres. Exemple de création de la base et de la table :

psql -U postgres -c "CREATE DATABASE portfolio;"
psql -U postgres -d portfolio -f db/schema.sql

Variables d'environnement à définir (voir `.env.example`):
- DB_HOST, DB_PORT, DB_NAME, DB_USER, DB_PASSWORD

## Migrations

Les migrations utilisent `node-pg-migrate`.
- Lancer les migrations : npm run migrate
- Revenir en arrière : npm run migrate:down

## Tests

Les tests utilisent `vitest`. Pour lancer :

npm test

Le test du mapper crée une table temporaire pour isoler les tests.