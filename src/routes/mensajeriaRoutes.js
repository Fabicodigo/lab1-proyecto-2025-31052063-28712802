import { Router } from 'express';
import * as msgController from '../controllers/mensajeriaController.js';

const router = Router();


router.get('/mensajeria', msgController.listarMensajes);


router.post('/mensajeria', msgController.registrarMensaje);


router.get('/mensajeria/:id', msgController.mensajePorId);

router.patch('/mensajeria/:id', msgController.actualizarEstadoMensaje);

export default router;