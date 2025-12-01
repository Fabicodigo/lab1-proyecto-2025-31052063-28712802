import { prisma } from '../prisma.js';
import { mapEntity } from '../utils/responseMapper.js';
import parsePositiveInt from '../utils/ParsePositive.js';

const citaInclude = {
    profesionales: { select: { nombres: true, apellidos: true } },
    personasatendidas: { select: { nombres: true, apellidos: true, numeroDocumento: true } },
    unidadesatencion: { select: { nombre: true } }
};

export const listarCitas = async (req, res, next) => {
  try {
    const page = parsePositiveInt(req.query.page, 1);
    const pageSize = parsePositiveInt(req.query.pageSize, 20);

    const rawData = await prisma.citas.findMany({
        skip: (page - 1) * pageSize,
        take: pageSize,
        orderBy: { inicio: 'asc' },
        include: citaInclude 
    });
    
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
            personaId: data.personaId ? Number(data.personaId) : null,
            profesionalId: data.profesionalId ? Number(data.profesionalId) : null,
            unidadId: data.unidadId ? Number(data.unidadId) : null,
            
            inicio: data.inicio ? new Date(data.inicio) : null, 
            fin: data.fin ? new Date(data.fin) : null,

            motivo: data.motivo || null,
            canal: data.canal || 'Presencial', 
            observaciones: data.observaciones || null,
            estado: data.estado || 'Agendada', 
        }
    });
    res.status(201).json(created);
  } catch (error) {
    console.error('CreateDate error', error);
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
    if (data.estado === "Desactivado") {
        const error = new Error("No está permitido cambiar el estado a 'Desactivado' por PATCH. Use DELETE.");
        error.statusCode = 400;
        throw error;
    }

    const actualizar = {};

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
    await prisma.citas.update({ where: { id }, data: { estado: 'Desactivado' } });
    return res.status(204).send();
  } catch (err) {
    console.error('desactivarCita error', err);
    return next(err);
  }
};