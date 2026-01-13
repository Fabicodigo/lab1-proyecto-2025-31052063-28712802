import { Router } from 'express';
import * as proController from '../controllers/profesionalesController.js';
import { validate } from '../middlewares/validateRequest.js';
import { profesionalSchema } from '../validators/schemas.js';
const router = Router();

router.post('/profesionales', validate(profesionalSchema), proController.crearProfesional);

router.get('/profesionales', proController.listarProfesionales);
router.post('/profesionales', proController.crearProfesional);
router.patch('/profesionales/:id', proController.actualizarProfesional);
router.delete('/profesionales/:id', proController.desactivarProfesional);

export default router;