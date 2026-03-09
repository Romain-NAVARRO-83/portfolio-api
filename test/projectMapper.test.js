import { beforeAll, afterAll, describe, it, expect } from '@jest/globals';
import pool, { query } from '../src/db/index.js';
import * as projectMapper from '../src/models/projectMapper.js';

beforeAll(async () => {
  await query(`CREATE TEMP TABLE projects (id SERIAL PRIMARY KEY, name VARCHAR(255) NOT NULL, description TEXT, created_at TIMESTAMPTZ DEFAULT now()) ON COMMIT DROP`);
});

afterAll(async () => {
  await pool.end();
});

describe('projectMapper', () => {
  it('should insert and retrieve a project', async () => {
    const created = await projectMapper.insertProject({ name: 'Test', description: 'Desc' });
    expect(created).toHaveProperty('id');
    const fetched = await projectMapper.findProjectById(created.id);
    expect(fetched.name).toBe('Test');
  });

  it('should list projects', async () => {
    await projectMapper.insertProject({ name: 'T2', description: 'D2' });
    const all = await projectMapper.findAllProjects();
    expect(all.length).toBeGreaterThanOrEqual(2);
  });

  it('should update a project', async () => {
    const created = await projectMapper.insertProject({ name: 'Upd', description: 'Before' });
    const updated = await projectMapper.updateProject(created.id, { name: 'Upd2', description: 'After' });
    expect(updated.name).toBe('Upd2');
  });

  it('should delete a project', async () => {
    const created = await projectMapper.insertProject({ name: 'Del', description: 'X' });
    await projectMapper.deleteProject(created.id);
    const found = await projectMapper.findProjectById(created.id);
    expect(found).toBeNull();
  });
});
