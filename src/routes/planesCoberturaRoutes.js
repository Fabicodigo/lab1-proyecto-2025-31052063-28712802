import { Router } from 'express';
import * as planesController from '../controllers/planesCoberturaController.js';

const router = Router();


router.get('/planesCobertura', planesController.listarPlanesCobertura);


router.post('/planesCobertura', planesController.crearPlanCobertura);


router.get('/planesCobertura/:id', planesController.planCoberturaPorId);


router.patch('/planesCobertura/:id', planesController.actualizarPlanCobertura);


router.delete('/planesCobertura/:id', planesController.eliminarPlanCobertura);

export default router;