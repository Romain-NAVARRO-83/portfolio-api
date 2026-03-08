import { Router } from 'express';
import { getHello } from '../controllers/helloController.js';

const router = Router();

router.get('/', getHello);

export default router;
