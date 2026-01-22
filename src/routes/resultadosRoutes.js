import { Router } from 'express';
import * as resultadosController from '../controllers/resultadosController.js';
import { validate } from '../middlewares/validateRequest.js';
import { resultadoSchema } from '../validators/schemas.js';

const router = Router();

router.get('/resultados', resultadosController.listarResultados);
router.post('/resultados', validate(resultadoSchema), resultadosController.crearResultado);

router.get('/resultados/:id', resultadosController.ResultadoPorId);
router.delete('/resultados/:id', resultadosController.eliminarResultado); 
router.put('/resultados/:id', validate(resultadoUpdateSchema), resultadosController.actualizarResultado);

export default router;