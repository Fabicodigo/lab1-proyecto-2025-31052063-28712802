import { Router } from 'express';
import * as pagosController from '../controllers/pagoscontroller.js';
const router = Router();

// Rutas para Pagos
router.get('/pagos', pagosController.listarPagos);
router.post('/pagos', pagosController.crearPago);
router.get('/pagos/:id', pagosController.PagoPorId);
router.patch('/pagos/:id', pagosController.actualizarPago);
router.delete('/pagos/:id', pagosController.desactivarPago); // Borrado suave

export default router; // <--- ESTO DEBE ESTAR AHÍ.