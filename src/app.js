import express from 'express';
import bodyParser from 'body-parser';

import identidades from './routes/identidadesroutes.js';
import registros from './routes/registroroutes.js';
import citas from './routes/citasroutes.js';
import agenda from './routes/agendaroutes.js';
// Ejemplo: index.js
import * as dotenv from 'dotenv';
dotenv.config(); // Carga las variables del .env

// Ahora puedes importar Prisma, ya que DATABASE_URL ya está disponible
import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient(); 
// ... el resto de tu aplicación
const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.set('port', process.env.PORT || 4000);

app.use('/', identidades);
app.use('/', registros);
app.use('/', citas);
app.use('/', agenda);

app.listen(app.get('port'));
console.log(`Server is running on port ${app.get('port')}`);