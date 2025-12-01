import { Router } from 'express';
import * as agendaController from '../controllers/agendacontroller.js';
const router = Router();

router.get('/agenda', agendaController.listarAgenda);
router.post('/agenda', agendaController.crearAgenda);
router.get('/agenda/:id', agendaController.AgendaPorId);
router.patch('/agenda/:id', agendaController.actualizarAgenda);
router.delete('/agenda/:id', agendaController.desactivarAgenda);

export default router;