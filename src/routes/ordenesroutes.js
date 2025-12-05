import { Router } from 'express';
import * as ordenesController from '../controllers/ordenescontroller.js';
const router = Router();


router.get('/ordenes', ordenesController.listarOrdenes);
router.post('/ordenes', ordenesController.crearOrden);


router.get('/ordenes/:id', ordenesController.OrdenPorId);
router.patch('/ordenes/:id', ordenesController.actualizarOrden);
router.delete('/ordenes/:id', ordenesController.desactivarOrden);

export default router;