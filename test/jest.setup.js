import pool from '../src/db/index.js';

// After all tests, close DB pool
export default async () => {
  await pool.end();
};
