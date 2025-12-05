import { Router } from 'express';
import * as prescripcionesController from '../controllers/prescripcionescontroller.js';
const router = Router();


router.get('/prescripciones', prescripcionesController.listarPrescripciones);
router.post('/prescripciones', prescripcionesController.crearPrescripcion);


router.get('/prescripciones/:id', prescripcionesController.PrescripcionPorId);
router.patch('/prescripciones/:id', prescripcionesController.actualizarPrescripcion);
router.delete('/prescripciones/:id', prescripcionesController.eliminarPrescripcion); 

export default router;