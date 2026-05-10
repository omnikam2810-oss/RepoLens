import { Router } from 'express';
import { analyzeRepositoryController } from '../controllers/analysis.controller.js';

const router = Router();

router.post('/', analyzeRepositoryController);

export default router;
