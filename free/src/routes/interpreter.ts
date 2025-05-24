import { Router } from 'express';
import { interpret } from '../controllers/interpreterController';
import multer from 'multer';

const router = Router();
const upload = multer();
router.post('/', upload.none(), interpret);

export default router;
