import { Router } from 'express';
import * as agendaController from '../controllers/agendaController.js';
import { validate } from '../middlewares/validateRequest.js';
import { agendaSchema } from '../validators/schemas.js';

const router = Router();

router.post('/agenda', validate(agendaSchema), agendaController.crearAgenda);

router.get('/agenda', agendaController.listarAgenda);
router.post('/agenda', agendaController.crearAgenda);
router.get('/agenda/:id', agendaController.AgendaPorId);
router.patch('/agenda/:id', agendaController.actualizarAgenda);
router.delete('/agenda/:id', agendaController.desactivarAgenda);

export default router;