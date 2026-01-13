import { Router } from 'express';
import * as pagosController from '../controllers/pagosController.js';

const router = Router();


router.get('/pagos', pagosController.listarPagos);


router.post('/pagos', pagosController.registrarPago);


router.get('/pagos/:id', pagosController.pagoPorId);

router.patch('/pagos/:id', pagosController.actualizarEstadoPago);


router.delete('/pagos/:id', pagosController.eliminarPago);

export default router;