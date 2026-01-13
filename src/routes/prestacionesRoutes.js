import { Router } from 'express';
import * as prestController from '../controllers/prestacionesController.js';

const router = Router();


router.get('/prestaciones', prestController.listarPrestaciones);


router.post('/prestaciones', prestController.crearPrestacion);


router.get('/prestaciones/:id', prestController.prestacionPorId);


router.patch('/prestaciones/:id', prestController.actualizarPrestacion);


router.delete('/prestaciones/:id', prestController.eliminarPrestacion);

export default router;