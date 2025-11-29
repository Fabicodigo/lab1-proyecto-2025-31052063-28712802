import { prisma } from '../prisma.js';
import { mapEntity } from '../utils/responseMapper.js';
import parsePositiveInt from '../utils/ParsePositive.js';

// Configuración de los includes para devolver datos completos
// NOTA: Se usan nombres plurales para las relaciones según lo requiere Prisma
const citaInclude = {
    profesionales: { select: { nombres: true, apellidos: true } },
    personasatendidas: { select: { nombres: true, apellidos: true, numeroDocumento: true } },
    unidadesatencion: { select: { nombre: true } }
};

// --- Funciones CRUD ---

export const listarCitas = async (req, res, next) => {
  try {
    const page = parsePositiveInt(req.query.page, 1);
    const pageSize = parsePositiveInt(req.query.pageSize, 20);

    const rawData = await prisma.citas.findMany({
        skip: (page - 1) * pageSize,
        take: pageSize,
        orderBy: { inicio: 'asc' }, // Ordenamos por el campo de inicio
        include: citaInclude 
    });
    
    // Mapeamos los datos, incluyendo los campos de fecha
    const data = rawData.map(p => mapEntity(p, {
      dateFields: ['inicio', 'fin'], 
    }));

    res.json({ page, pageSize, data });
  } catch (error) {
    console.error('Error listing citas:', error);
    next(error);
  }
};

export const crearCita = async (req, res, next) => {
  try {
    const data = req.body;
    
    const created = await prisma.citas.create({ 
        data: {
            // Conversión de IDs a números, permitiendo null
            personaId: data.personaId ? Number(data.personaId) : null,
            profesionalId: data.profesionalId ? Number(data.profesionalId) : null,
            unidadId: data.unidadId ? Number(data.unidadId) : null,
            
            // Conversión de fechas
            inicio: data.inicio ? new Date(data.inicio) : null, 
            fin: data.fin ? new Date(data.fin) : null,

            // Campos de texto y estado
            motivo: data.motivo || null,
            canal: data.canal || 'Presencial', 
            observaciones: data.observaciones || null,
            estado: data.estado || 'Agendada', 
        }
    });
    res.status(201).json(created);
  } catch (error) {
    console.error('Error creating cita:', error);
    next(error);
  }
};

export const CitaPorId = async (req, res, next) => {
  try {
    const id = Number(req.params.id);
    const item = await prisma.citas.findUnique({ 
        where: { id },
        include: citaInclude
    });
    
    if (!item){
      const error = new Error("Cita no encontrada");
      error.statusCode = 404;
      throw error;
    }
    // Mapeamos el resultado
    return res.json(mapEntity(item, { dateFields: ['inicio', 'fin'] }));
  } catch (err) {
    console.error('getCita error', err);
    return next(err);
  }
};

export const actualizarCita = async (req, res, next) => {
  const id = Number(req.params.id);
  const data = req.body;

  try {
    // Implementamos la restricción para el borrado suave (soft delete)
    if (data.estado === "Desactivado") {
        const error = new Error("No está permitido cambiar el estado a 'Desactivado' por PATCH. Use DELETE.");
        error.statusCode = 400;
        throw error;
    }

    const actualizar = {};

    // Mapeo condicional de campos
    if (data.personaId !== undefined) actualizar.personaId = data.personaId ? Number(data.personaId) : null;
    if (data.profesionalId !== undefined) actualizar.profesionalId = data.profesionalId ? Number(data.profesionalId) : null;
    if (data.unidadId !== undefined) actualizar.unidadId = data.unidadId ? Number(data.unidadId) : null;
    
    if (data.inicio) actualizar.inicio = new Date(data.inicio); 
    if (data.fin) actualizar.fin = new Date(data.fin); 

    if (data.motivo) actualizar.motivo = data.motivo;
    if (data.canal) actualizar.canal = data.canal;
    if (data.observaciones) actualizar.observaciones = data.observaciones;
    if (data.estado) actualizar.estado = data.estado;


    const actualizado = await prisma.citas.update({ where: { id }, data: actualizar });
    return res.json(actualizado);
  } catch (error) {
    console.error('updateCita error', error);
   next(error);
  }
};

export const desactivarCita = async (req, res, next) => {
  try {
    const id = Number(req.params.id);
    // Borrado suave (soft delete)
    await prisma.citas.update({ where: { id }, data: { estado: 'Desactivado' } });
    return res.status(204).send();
  } catch (err) {
    console.error('desactivarCita error', err);
    return next(err);
  }
};