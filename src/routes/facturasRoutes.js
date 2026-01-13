import { Router } from 'express';
import * as facturaController from '../controllers/facturasController.js';
import { validate } from '../middlewares/validateRequest.js';
import { facturaSchema } from '../validators/schemas.js';

const router = Router();

router.post('/facturas', validate(facturaSchema), facturaController.crearFactura);

router.get('/facturas', facturaController.listarFacturas);


router.post('/facturas', facturaController.crearFactura);


router.get('/facturas/:id', facturaController.facturaPorId);


router.patch('/facturas/:id/estado', facturaController.actualizarEstadoFactura);


router.delete('/facturas/:id', facturaController.anularFactura);

export default router;