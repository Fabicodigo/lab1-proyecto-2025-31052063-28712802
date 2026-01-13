import { Router } from 'express';
import * as epiController from '../controllers/episodiosController.js';
import { validate } from '../middlewares/validateRequest.js'; 
import { episodioSchema, notaSchema, diagnosticoSchema } from '../validators/schemas.js';
const router = Router();

router.post('/episodios', validate(episodioSchema), epiController.crearEpisodio);

router.post('/episodios/:id/notas', validate(notaSchema), epiController.crearNotaEnEpisodio);
router.post('/notas', validate(notaSchema), epiController.crearNotaEnEpisodio);

router.post('/episodios/:id/diagnosticos', validate(diagnosticoSchema), epiController.crearDiagnosticoEnEpisodio);
router.post('/diagnosticos', validate(diagnosticoSchema), epiController.crearDiagnosticoEnEpisodio);

router.get('/episodios', epiController.listarEpisodios);
router.post('/episodios', epiController.crearEpisodio);

router.get('/episodios/:id/notas', epiController.notasEnEpisodio);
router.post('/episodios/:id/notas', epiController.crearNotaEnEpisodio);

router.get('/episodios/:id/diagnosticos', epiController.diagnosticosEnEpisodio);
router.post('/episodios/:id/diagnosticos', epiController.crearDiagnosticoEnEpisodio);

router.get('/episodios/:id/consentimientos', epiController.consentimientosEnEpisodio);
router.post('/episodios/:id/consentimientos', epiController.crearConsentimientoEnEpisodio);

export default router;