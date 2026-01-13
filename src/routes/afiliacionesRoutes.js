import { Router } from 'express';
import * as afilController from '../controllers/afiliacionesController.js';

const router = Router();


router.get('/afiliaciones', afilController.listarAfiliaciones);


router.post('/afiliaciones', afilController.crearAfiliacion);


router.get('/afiliaciones/:id', afilController.afiliacionPorId);


router.patch('/afiliaciones/:id', afilController.actualizarAfiliacion);


router.delete('/afiliaciones/:id', afilController.eliminarAfiliacion);

export default router;