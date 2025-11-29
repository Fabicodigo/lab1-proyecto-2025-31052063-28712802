import { Router } from 'express';
import * as citasController from '../controllers/citascontroller.js';
const router = Router();

// Listar todas las citas y crear una nueva
router.get('/citas', citasController.listarCitas);
router.post('/citas', citasController.crearCita);

// Obtener, actualizar o eliminar una cita por ID
router.get('/citas/:id', citasController.CitaPorId);
router.patch('/citas/:id', citasController.actualizarCita);
router.delete('/citas/:id', citasController.desactivarCita);

export default router;