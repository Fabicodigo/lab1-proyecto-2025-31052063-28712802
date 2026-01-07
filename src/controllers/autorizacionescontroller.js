import { prisma } from '../prisma.js';
import { mapEntity } from '../utils/responseMapper.js';
import parsePositiveInt from '../utils/ParsePositive.js';


export const listarAutorizaciones = async (req, res, next) => {
  try {
    const page = parsePositiveInt(req.query.page, 1);
    const pageSize = parsePositiveInt(req.query.pageSize, 20);
    const estado = req.query.estado; 
    const planId = req.query.planId ? Number(req.query.planId) : undefined;

    const where = {};
    if (estado) where.estado = estado;
    if (planId) where.planId = planId;

    const rawData = await prisma.autorizaciones.findMany({
      where,
      skip: (page - 1) * pageSize,
      take: pageSize,
      orderBy: { fechaSolicitud: 'desc' }
    });

    const data = rawData.map(d => mapEntity(d));
    res.json({ page, pageSize, data });
  } catch (error) {
    next(error);
  }
};


export const crearAutorizacion = async (req, res, next) => {
  try {
    const data = req.body;
    
    const created = await prisma.autorizaciones.create({
      data: {
        ordenId: data.ordenId ? Number(data.ordenId) : null,
        procedimientoCodigo: data.procedimientoCodigo,
        planId: Number(data.planId),
        estado: data.estado || 'solicitada',
        fechaSolicitud: data.fechaSolicitud ? new Date(data.fechaSolicitud) : new Date(),
        numeroAutorizacion: data.numeroAutorizacion || null,
        observaciones: data.observaciones
      }
    });

    res.status(201).json(mapEntity(created));
  } catch (error) {
    next(error);
  }
};


export const autorizacionPorId = async (req, res, next) => {
  try {
    const id = Number(req.params.id);
    const auth = await prisma.autorizaciones.findUnique({
      where: { id },
      include: { planesCobertura: true }
    });

    if (!auth) {
      const error = new Error('Autorización no encontrada');
      error.statusCode = 404;
      throw error; 
    }

    res.json(mapEntity(auth));
  } catch (err) {
    next(err);
  }
};


export const actualizarAutorizacion = async (req, res, next) => {
  try {
    const id = Number(req.params.id);
    const data = req.body;

    
    const updateData = { ...data };
    
    if (data.estado && data.estado !== 'solicitada' && !data.fechaRespuesta) {
      updateData.fechaRespuesta = new Date();
    } else if (data.fechaRespuesta) {
      updateData.fechaRespuesta = new Date(data.fechaRespuesta);
    }

    if (data.planId) updateData.planId = Number(data.planId);
    if (data.ordenId) updateData.ordenId = Number(data.ordenId);

    const actualizado = await prisma.autorizaciones.update({ 
      where: { id }, 
      data: updateData
    });
    
    res.json(mapEntity(actualizado));
  } catch (err) {
    next(err);
  }
};


export const eliminarAutorizacion = async (req, res, next) => {
  try {
    const id = Number(req.params.id);
    await prisma.autorizaciones.delete({ where: { id } });
    res.status(204).send(); 
  } catch (err) {
    next(err);
  }
};