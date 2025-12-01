import { Router } from 'express';
import * as citasController from '../controllers/citascontroller.js';
const router = Router();

router.get('/citas', citasController.listarCitas);
router.post('/citas', citasController.crearCita);

router.get('/citas/:id', citasController.CitaPorId);
router.patch('/citas/:id', citasController.actualizarCita);
router.delete('/citas/:id', citasController.desactivarCita);

export default router;