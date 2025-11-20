import { Router } from 'express';
import * as regController from '../controllers/registrocontroller.js';
const router = Router();

router.get('/episodios', regController.listarEpisodios);
router.post('/episodios', regController.crearEpisodio);

router.get('/episodios/:id/notas', regController.notasEnEpisodio);
router.post('/episodios/:id/notas', regController.crearNotaEnEpisodio);

router.get('/episodios/:id/diagnosticos', regController.diagnosticosEnEpisodio);
router.post('/episodios/:id/diagnosticos', regController.crearDiagnosticoEnEpisodio);

router.get('/episodios/:id/consentimientos', regController.consentimientosEnEpisodio);
router.post('/episodios/:id/consentimientos', regController.crearConsentimientoEnEpisodio);

export default router;