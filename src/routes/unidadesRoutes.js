import { Router } from 'express';
import * as unController from '../controllers/unidadesController.js';
import { validate } from '../middlewares/validateRequest.js';
import { unidadSchema } from '../validators/schemas.js';
const router = Router();

router.post('/unidades', validate(unidadSchema), unController.crearUnidad);

router.get('/unidades', unController.listarUnidades);
router.post('/unidades', unController.crearUnidad);
router.patch('/unidades/:id', unController.actualizarUnidad);
router.delete('/unidades/:id', unController.desactivarUnidad);
    
export default router;