import { Router } from 'express';
import { getHello } from '../controllers/helloController.js';
import * as projectController from '../controllers/projectController.js';

const router = Router();

router.get('/', getHello);

// project routes
router.get('/projects', projectController.listProjects);
router.get('/projects/:id', projectController.getProject);
router.post('/projects', projectController.createProject);
router.put('/projects/:id', projectController.editProject);
router.delete('/projects/:id', projectController.removeProject);

export default router;
