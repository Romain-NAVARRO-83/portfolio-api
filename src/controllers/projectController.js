import * as projectMapper from '../models/projectMapper.js';
import { projectSchema } from '../validators/projectValidator.js';

export const listProjects = async (req, res, next) => {
  try {
    const projects = await projectMapper.findAllProjects();
    res.json(projects);
  } catch (err) {
    next(err);
  }
};

export const getProject = async (req, res, next) => {
  try {
    const project = await projectMapper.findProjectById(req.params.id);
    if (!project) return res.status(404).json({ error: 'Not found' });
    res.json(project);
  } catch (err) {
    next(err);
  }
};

export const createProject = async (req, res, next) => {
  try {
    const { error, value } = projectSchema.validate(req.body);
    if (error) return res.status(400).json({ error: error.details.map(d => d.message).join(', ') });
    const created = await projectMapper.insertProject(value);
    res.status(201).json(created);
  } catch (err) {
    next(err);
  }
};

export const editProject = async (req, res, next) => {
  try {
    const { error, value } = projectSchema.validate(req.body);
    if (error) return res.status(400).json({ error: error.details.map(d => d.message).join(', ') });
    const updated = await projectMapper.updateProject(req.params.id, value);
    if (!updated) return res.status(404).json({ error: 'Not found' });
    res.json(updated);
  } catch (err) {
    next(err);
  }
};

export const removeProject = async (req, res, next) => {
  try {
    await projectMapper.deleteProject(req.params.id);
    res.status(204).end();
  } catch (err) {
    next(err);
  }
};
