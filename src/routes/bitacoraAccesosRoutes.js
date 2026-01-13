import { Router } from 'express';
import * as bitacoraController from '../controllers/bitacoraAccesosController.js';

const router = Router();


router.get('/bitacora', bitacoraController.listarBitacora);


router.post('/bitacora', bitacoraController.registrarAcceso);


router.get('/bitacora/:id', bitacoraController.bitacoraPorId);

export default router;