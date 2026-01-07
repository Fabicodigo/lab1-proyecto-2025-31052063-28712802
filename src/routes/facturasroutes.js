import { Router } from 'express';
import * as facturaController from '../controllers/facturascontroller.js';

const router = Router();


router.get('/facturas', facturaController.listarFacturas);


router.post('/facturas', facturaController.crearFactura);


router.get('/facturas/:id', facturaController.facturaPorId);


router.patch('/facturas/:id/estado', facturaController.actualizarEstadoFactura);


router.delete('/facturas/:id', facturaController.anularFactura);

export default router;