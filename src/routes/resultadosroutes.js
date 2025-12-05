import { Router } from 'express';
import * as resultadosController from '../controllers/resultadoscontroller.js';
const router = Router();


router.get('/resultados', resultadosController.listarResultados);
router.post('/resultados', resultadosController.crearResultado);


router.get('/resultados/:id', resultadosController.ResultadoPorId);
router.patch('/resultados/:id', resultadosController.actualizarResultado);
router.delete('/resultados/:id', resultadosController.eliminarResultado); 

export default router;