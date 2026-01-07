import { prisma } from '../prisma.js';
import { mapEntity } from '../utils/responseMapper.js';
import parsePositiveInt from '../utils/ParsePositive.js';


export const listarMensajes = async (req, res, next) => {
  try {
    const page = parsePositiveInt(req.query.page, 1);
    const pageSize = parsePositiveInt(req.query.pageSize, 20);
    const { tipo, estado, destinatario } = req.query;

    const where = {};
    if (tipo) where.tipo = tipo;
    if (estado) where.estado = estado;
    if (destinatario) where.destinatario = { contains: destinatario };

    const rawData = await prisma.mensajeria.findMany({
      where,
      skip: (page - 1) * pageSize,
      take: pageSize,
      orderBy: { timestamp: 'desc' }
    });

    const data = rawData.map(d => mapEntity(d));
    res.json({ page, pageSize, data });
  } catch (error) {
    next(error);
  }
};


export const registrarMensaje = async (req, res, next) => {
  try {
    const { tipo, plantilla, destinatario, payload, estado, reintentos } = req.body;
    
    const created = await prisma.mensajeria.create({
      data: {
        tipo, 
        plantilla, 
        destinatario,
        payload: payload ? JSON.stringify(payload) : null,
        estado: estado || 'enviado',
        reintentos: reintentos ? Number(reintentos) : 0,
        timestamp: new Date()
      }
    });

    res.status(201).json(mapEntity(created));
  } catch (error) {
    next(error);
  }
};


export const mensajePorId = async (req, res, next) => {
  try {
    const id = Number(req.params.id);
    const mensaje = await prisma.mensajeria.findUnique({
      where: { id }
    });

    if (!mensaje) {
      const error = new Error('Registro de mensaje no encontrado');
      error.statusCode = 404;
      throw error; 
    }

    res.json(mapEntity(mensaje));
  } catch (err) {
    next(err);
  }
};


export const actualizarEstadoMensaje = async (req, res, next) => {
  try {
    const id = Number(req.params.id);
    const { estado, reintentos } = req.body;

    const actualizado = await prisma.mensajeria.update({ 
      where: { id }, 
      data: { 
        estado,
        reintentos: reintentos !== undefined ? Number(reintentos) : undefined
      }
    });
    
    res.json(mapEntity(actualizado));
  } catch (err) {
    next(err);
  }
};