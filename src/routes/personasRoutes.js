import { Router } from 'express';
import * as perController from '../controllers/personasController.js';
import { validate } from '../middlewares/validateRequest.js';
import { personaSchema } from '../validators/schemas.js';
const router = Router();

router.post('/personas', validate(personaSchema), perController.crearPersona);

router.get('/personas', perController.listarPersonas);
router.post('/personas', perController.crearPersona);
router.get('/personas/:id', perController.PersonaporId);
router.patch('/personas/:id', perController.actualizarPersona);
router.delete('/personas/:id', perController.desactivarPersona);

export default router;