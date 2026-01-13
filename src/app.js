import express from 'express';
import bodyParser from 'body-parser';
import 'dotenv/config';

import personas from './routes/personasRoutes.js';
import episodios from './routes/episodiosRoutes.js';
import citas from './routes/citasRoutes.js';
import agenda from './routes/agendaRoutes.js';
import ordenes from './routes/ordenesRoutes.js';
import prescripciones from './routes/prescripcionesRoutes.js';
import resultados from './routes/resultadosRoutes.js';
import aseguradoras from './routes/aseguradorasRoutes.js';
import planesCobertura from './routes/planesCoberturaRoutes.js';
import afiliaciones from './routes/afiliacionesRoutes.js';
import autorizaciones from './routes/autorizacionesRoutes.js';
import prestaciones from './routes/prestacionesRoutes.js';
import arancel from './routes/arancelRoutes.js';
import facturas from './routes/facturasRoutes.js';
import pagos from './routes/pagosRoutes.js';
import mensajeria from './routes/mensajeriaRoutes.js';
import bitacora from './routes/bitacoraAccesosRoutes.js';
import profesionales from './routes/profesionalesRoutes.js';
import unidades from './routes/unidadesRoutes.js';

const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.set('port', process.env.PORT || 4000);

app.use('/', personas);
app.use('/', episodios);
app.use('/', citas);
app.use('/', agenda);
app.use('/', ordenes);
app.use('/', prescripciones);
app.use('/', resultados);
app.use('/', aseguradoras);
app.use('/', planesCobertura);
app.use('/', afiliaciones);
app.use('/', autorizaciones);
app.use('/', prestaciones);
app.use('/', arancel);
app.use('/', facturas);
app.use('/', pagos);
app.use('/', mensajeria);
app.use('/', bitacora);
app.use('/', profesionales);
app.use('/', unidades);

if (process.env.NODE_ENV !== 'test') {
    const port = app.get('port');
    app.listen(port, () => {
        console.log(`Server is running on port ${port}`);
    });
}

export default app;