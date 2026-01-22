import { Router } from 'express';
import * as autController from '../controllers/autorizacionesController.js';

const router = Router();


router.get('/autorizaciones', autController.listarAutorizaciones);

router.post('/autorizaciones', autController.crearAutorizacion);

router.get('/autorizaciones/:id', autController.autorizacionPorId);

router.patch('/autorizaciones/:id', autController.actualizarAutorizacion);

router.delete('/autorizaciones/:id', autController.eliminarAutorizacion);

export default router;