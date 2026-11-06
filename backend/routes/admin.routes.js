import express from 'express';
import { getAdminImage, saveAdminImage } from '../controllers/admin.controller.js';

const router = express.Router();
router.get('/showcase-image', getAdminImage);
router.put('/showcase-image', saveAdminImage);

export default router;
