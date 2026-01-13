import { Router } from 'express';
import * as asegController from '../controllers/aseguradorasController.js';

const router = Router();


router.get('/aseguradoras', asegController.listarAseguradoras);


router.post('/aseguradoras', asegController.crearAseguradora);


router.get('/aseguradoras/:id', asegController.aseguradoraPorId);


router.patch('/aseguradoras/:id', asegController.actualizarAseguradora);


router.delete('/aseguradoras/:id', asegController.eliminarAseguradora);

export default router;