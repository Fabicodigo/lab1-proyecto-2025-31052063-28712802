import { Router } from 'express';
import * as arancelController from '../controllers/arancelController.js';

const router = Router();


router.get('/arancel', arancelController.listarAranceles);


router.post('/arancel', arancelController.crearArancel);


router.get('/arancel/:id', arancelController.arancelPorId);


router.patch('/arancel/:id', arancelController.actualizarArancel);


router.delete('/arancel/:id', arancelController.eliminarArancel);

export default router;