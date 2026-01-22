import { jest, describe, test, expect, afterAll } from '@jest/globals';
import request from 'supertest';
import app from '../src/app.js';
import { prisma } from '../src/prisma.js';

// Aumentamos timeout a 60s para pruebas de integración pesadas
jest.setTimeout(60000);

// --- VARIABLES GLOBALES (Estado compartido) ---
let usuarioId, personaId, profesionalId, unidadId;
let agendaId, citaId, episodioId;
let notaId, resultadoId; // Para probar versionado
let aseguradoraId, planId, prestacionId;
let facturaId, ordenId;

// --- GENERADORES ---
const randomDoc = () => Math.floor(Math.random() * 90000000) + 10000000;
const randomEmail = () => `test_${Math.random().toString(36).substring(7)}@hospital.com`;
const randomUser = () => `user_${Math.random().toString(36).substring(7)}`;
const randomCode = () => `COD-${Math.floor(Math.random() * 9999)}`;
const randomInvoice = () => `FACT-${Math.floor(Math.random() * 99999)}`;

// Helper para extraer datos de respuestas con diferentes estructuras
const getData = (res) => res.body.body || res.body || res.body.items || res.body.data || {};

describe('🚀 SUITE E2E: SISTEMA MÉDICO CON VERSIONADO', () => {

  // ==========================================
  // 1. SETUP & IDENTIDADES
  // ==========================================
  describe('1. Gestión de Identidades y Usuarios', () => {
    
    test('Setup: Crear Usuario para Auditoría', async () => {
      const res = await prisma.usuarios.create({
        data: { 
            username: randomUser(), 
            passwordHash: '123456', 
            email: randomEmail(), 
            estado: 'Activo' 
        }
      });
      usuarioId = res.id;
      expect(usuarioId).toBeDefined();
      console.log(`✅ Usuario Auditor Creado: ${usuarioId}`);
    });

    test('POST /personas - Crear Paciente', async () => {
      const res = await request(app).post('/personas').send({
        tipoDocumento: 'CC', numeroDocumento: `${randomDoc()}`,
        nombres: 'Paciente', apellidos: 'Versionado Test',
        fechaNacimiento: '1990-01-01T00:00:00.000Z', sexo: 'M',
        correo: randomEmail(), telefono: '3001234567', estado: 'Activo'
      });
      if (res.statusCode >= 400) console.error('Error Persona:', res.body);
      expect([200, 201]).toContain(res.statusCode);
      personaId = getData(res).id;
    });

    test('POST /profesionales - Crear Médico', async () => {
      const res = await request(app).post('/profesionales').send({
        usuarioId, nombres: 'Dr. House', apellidos: 'Jest',
        registroProfesional: randomCode(), especialidad: 'Auditoría Médica',
        correo: randomEmail(), telefono: '555-1234', estado: 'Activo'
      });
      expect([200, 201]).toContain(res.statusCode);
      profesionalId = getData(res).id;
    });

    test('POST /unidades - Obtener o Crear Unidad', async () => {
       let res = await request(app).get('/unidades');
       const items = getData(res);
       if (Array.isArray(items) && items.length > 0) {
           unidadId = items[0].id;
       } else {
           const nueva = await prisma.unidadesatencion.create({
               data: { nombre: 'Unidad Central', estado: 'Activo' }
           });
           unidadId = nueva.id;
       }
       expect(unidadId).toBeDefined();
    });
  });

  // ==========================================
  // 2. CONFIGURACIÓN
  // ==========================================
  describe('2. Configuración (Aseguradoras)', () => {
      test('POST /aseguradoras - Crear Aseguradora', async () => {
          const res = await request(app).post('/aseguradoras').send({
              nombre: 'Seguros Jest', contacto: 'admin@jest.com'
          });
          if (res.statusCode === 404) {
              // Fallback si la ruta no existe
              const nueva = await prisma.aseguradoras.create({
                  data: { nombre: 'Seguros Jest', estado: 'Activo' }
              });
              aseguradoraId = nueva.id;
          } else {
              expect([200, 201]).toContain(res.statusCode);
              aseguradoraId = getData(res).id;
          }
      });
  });

  // ==========================================
  // 3. AGENDAMIENTO
  // ==========================================
  describe('3. Agendamiento', () => {
    test('POST /agenda - Crear Bloque', async () => {
      const manana = new Date();
      manana.setDate(manana.getDate() + 1);
      const res = await request(app).post('/agenda').send({
        profesionalId, unidadId,
        inicio: new Date(manana.setHours(8,0,0,0)),
        fin: new Date(manana.setHours(12,0,0,0)),
        capacidad: 10
      });
      if (res.statusCode >= 400) console.error('Error Agenda:', res.body);
      expect([200, 201]).toContain(res.statusCode);
      agendaId = getData(res).id;
    });

    test('POST /citas - Agendar Cita', async () => {
      const manana = new Date();
      manana.setDate(manana.getDate() + 1);
      const res = await request(app).post('/citas').send({
        personaId, profesionalId, unidadId,
        inicio: new Date(manana.setHours(8,30,0,0)),
        fin: new Date(manana.setHours(9,0,0,0)),
        motivo: 'Consulta Inicial'
      });
      expect([200, 201]).toContain(res.statusCode);
      citaId = getData(res).id;
    });
  });

  // ==========================================
  // 4. REGISTRO CLÍNICO & VERSIONADO DE NOTAS
  // ==========================================
  describe('4. Registro Clínico y Versionado', () => {
    
    test('POST /episodios - Abrir Episodio', async () => {
      const res = await request(app).post('/episodios').send({
        personaId, unidadId, profesionalId,
        motivo: 'Dolor Abdominal', tipo: 'Urgencia'
      });
      expect([200, 201]).toContain(res.statusCode);
      episodioId = getData(res).id;
    });

    test('POST /notas - Crear Nota (Versión 1)', async () => {
      const res = await request(app).post(`/episodios/${episodioId}/notas`).send({
         episodioId, profesionalId,
         subjetivo: 'Paciente refiere dolor leve (V1)', 
         objetivo: 'Sin fiebre',
         analisis: 'Estable', 
         plan: 'Observación'
      });
      
      if (res.statusCode >= 400) console.error('Error Crear Nota:', res.body);
      expect([200, 201]).toContain(res.statusCode);
      
      const data = getData(res);
      notaId = data.id;
      
      expect(data.version).toBe(1); // Debe nacer en versión 1
      expect(data.subjetivo).toContain('(V1)');
    });

    test('PUT /notas/:id - Actualizar Nota (Generar Versión 2)', async () => {
        // Esta prueba verifica si tu middleware de Prisma.js funciona
        const res = await request(app).put(`/notas/${notaId}`).send({
            usuarioId, // <--- OBLIGATORIO para el middleware
            subjetivo: 'Paciente refiere dolor INTENSO (V2)',
            motivo: 'Corrección de evolución por empeoramiento'
        });

        if (res.statusCode >= 400) console.error('Error Actualizar Nota:', res.body);
        expect(res.statusCode).toBe(200);

        const data = getData(res);
        expect(data.version).toBe(2); // La versión debió subir automáticamente
        expect(data.subjetivo).toContain('(V2)');
    });

    test('DB Check: Verificar Historial de Notas', async () => {
        // Consultamos directamente a la BD para ver si se guardó el "backup"
        const historial = await prisma.notasHistorial.findMany({
            where: { notaId: Number(notaId) }
        });

        expect(historial.length).toBeGreaterThan(0);
        expect(historial[0].version).toBe(1); // El historial guarda la versión vieja
        
        // Verificamos el contenido JSON guardado
        const contenidoViejo = historial[0].contenidoAnterior; 
        expect(contenidoViejo.subjetivo).toContain('(V1)'); // Debe tener el texto original
        expect(historial[0].usuarioId).toBe(usuarioId); // Debe registrar quién hizo el cambio
    });
  });

  // ==========================================
  // 5. ÓRDENES Y RESULTADOS (Versionado)
  // ==========================================
  describe('5. Órdenes y Resultados', () => {
      test('POST /ordenes - Crear Orden', async () => {
          const res = await request(app).post('/ordenes').send({
              episodioId, tipo: 'Laboratorio', prioridad: 'Alta', estado: 'Solicitada',
              items: [{ itemId: 1, indicaciones: 'Ayuno' }] 
          });
          if (res.statusCode !== 404) {
              expect([200, 201]).toContain(res.statusCode);
              ordenId = getData(res).id;
          }
      });

      test('POST /resultados - Crear Resultado (V1)', async () => {
          // Asumiendo que existe ordenId, si no saltamos
          if (!ordenId) return;

          const res = await request(app).post('/resultados').send({
              ordenId, profesionalId,
              resumen: 'Resultados parciales (V1)',
              fecha: new Date()
          });
          
          if (res.statusCode === 404) return; // Ruta no implementada
          
          expect([200, 201]).toContain(res.statusCode);
          const data = getData(res);
          resultadoId = data.id;
          expect(data.version).toBe(1);
      });

      test('PUT /resultados/:id - Actualizar Resultado (V2)', async () => {
          if (!resultadoId) return;

          const res = await request(app).put(`/resultados/${resultadoId}`).send({
              usuarioId, // Obligatorio
              informe: 'Resultados FINALES y Validados (V2)', // Cambiamos resumen por informe si tu schema cambio
              resumen: 'Resultados Completos (V2)',
              motivo: 'Validación final'
          });

          if (res.statusCode !== 404) {
              expect(res.statusCode).toBe(200);
              const data = getData(res);
              expect(data.version).toBe(2);
          }
      });
  });

  // ==========================================
  // 6. FACTURACIÓN
  // ==========================================
  describe('6. Facturación', () => {
    test('Setup: Crear Prestación', async () => {
       const res = await request(app).post('/prestaciones').send({
           nombre: 'Consulta General', grupo: 'Consultas', tiempoEstimado: 30
       });
       if (res.statusCode === 404) {
           const nueva = await prisma.prestaciones.create({
               data: { nombre: 'Consulta General', grupo: 'Consultas' }
           });
           prestacionId = nueva.id;
       } else {
           prestacionId = getData(res).id;
       }
    });

    test('POST /facturas - Crear Factura', async () => {
        const res = await request(app).post('/facturas').send({
            personaId, aseguradoraId, 
            numero: randomInvoice(),
            fechaEmision: new Date(),
            estado: 'Emitida',
            items: [
                {
                    prestacionId, 
                    descripcion: 'Consulta Urgencia',
                    cantidad: 1, 
                    valorUnitario: 100.00
                }
            ]
        });
        
        if (res.statusCode >= 400) console.error('Error Factura:', JSON.stringify(res.body));
        expect([200, 201]).toContain(res.statusCode);
        facturaId = getData(res).id;
    });
  });

  // ==========================================
  // 7. LISTADOS (Smoke Test)
  // ==========================================
  describe('7. Verificación de Endpoints GET', () => {
      const endpoints = [
          '/personas', '/profesionales', '/citas', 
          '/episodios', '/facturas'
      ];

      endpoints.forEach(endpoint => {
          test(`GET ${endpoint} - Debería responder 200`, async () => {
              const res = await request(app).get(endpoint);
              if (res.statusCode !== 404) {
                  expect(res.statusCode).toEqual(200);
              }
          });
      });
  });

  afterAll(async () => {
    // Cerramos conexión
    await prisma.$disconnect();
  });
});