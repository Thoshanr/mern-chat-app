import express from 'express';
import { getAdminQr, unlockAdminQr } from '../controllers/admin.controller.js';

const router = express.Router();
router.post('/unlock', unlockAdminQr);
router.get('/qr', getAdminQr);

export default router;
