import express from 'express';
import bodyParser from 'body-parser';
import 'dotenv/config';


import identidades from './routes/identidadesroutes.js';
import registros from './routes/registroroutes.js';
import citas from './routes/citasroutes.js';
import agenda from './routes/agendaroutes.js';
import ordenes from './routes/ordenesroutes.js';
import prescripciones from './routes/prescripcionesroutes.js';
import resultados from './routes/resultadosroutes.js';
import aseguradoras from './routes/aseguradorasroutes.js';
import planesCobertura from './routes/planesCoberturaroutes.js';
import afiliaciones from './routes/afiliacionesroutes.js';
import autorizaciones from './routes/autorizacionesroutes.js';
import prestaciones from './routes/prestacionesroutes.js';
import arancel from './routes/arancelroutes.js';
import facturas from './routes/facturasroutes.js';
import pagos from './routes/pagosroutes.js';
import mensajeria from './routes/mensajeriaroutes.js';

const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.set('port', process.env.PORT || 4000);

app.use('/', identidades);
app.use('/', registros);
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

app.listen(app.get('port'));
console.log(`Server is running on port ${app.get('port')}`);