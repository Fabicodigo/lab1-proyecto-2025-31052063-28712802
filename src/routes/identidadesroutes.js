import { Router } from 'express';
import * as idController from '../controllers/identidadescontroller.js';
const router = Router();

router.get('/personas', idController.listarPersonas);
router.post('/personas', idController.crearPersona);
router.get('/personas/:id', idController.PersonaporId);
router.patch('/personas/:id', idController.actualizarPersona);
router.delete('/personas/:id', idController.desactivarPersona);

router.get('/profesionales', idController.listarProfesionales);
router.post('/profesionales', idController.crearProfesional);
router.patch('/profesionales/:id', idController.actualizarProfesional);
router.delete('/profesionales/:id', idController.desactivarProfesional);

router.get('/unidades', idController.listarUnidades);
router.post('/unidades', idController.crearUnidad);
router.patch('/unidades/:id', idController.actualizarUnidad);
router.delete('/unidades/:id', idController.desactivarUnidad);
    
export default router;