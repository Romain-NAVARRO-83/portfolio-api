import { query } from '../db/index.js';

export const findAllProjects = async () => {
  const res = await query('SELECT id, name, description, created_at FROM projects ORDER BY created_at DESC');
  return res.rows;
};

export const findProjectById = async (id) => {
  const res = await query('SELECT id, name, description, created_at FROM projects WHERE id = $1', [id]);
  return res.rows[0] || null;
};

export const insertProject = async ({ name, description }) => {
  const res = await query(
    'INSERT INTO projects (name, description) VALUES ($1, $2) RETURNING id, name, description, created_at',
    [name, description]
  );
  return res.rows[0];
};

export const updateProject = async (id, { name, description }) => {
  const res = await query(
    'UPDATE projects SET name = $1, description = $2 WHERE id = $3 RETURNING id, name, description, created_at',
    [name, description, id]
  );
  return res.rows[0] || null;
};

export const deleteProject = async (id) => {
  await query('DELETE FROM projects WHERE id = $1', [id]);
  return true;
};
