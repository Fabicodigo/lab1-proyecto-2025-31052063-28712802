import { prisma } from '../prisma.js';
import { mapEntity } from '../utils/responseMapper.js';
import parsePositiveInt from '../utils/ParsePositive.js';
import * as citasService from '../services/citasService.js';

const citaInclude = {
    profesionales: { select: { nombres: true, apellidos: true } },
    personasAtendidas: { select: { nombres: true, apellidos: true, numeroDocumento: true } },
    unidadesAtencion: { select: { nombre: true } }
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
    const created = await citasService.agendarCita(req.body);
    res.status(201).json(created);
  } catch (error) {
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
  try {
    const id = Number(req.params.id);
    const updated = await citasService.reprogramarCita(id, req.body);
    res.json(updated);
  } catch (error) {
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