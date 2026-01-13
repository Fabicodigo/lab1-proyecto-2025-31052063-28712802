import { prisma } from '../prisma.js';
import { mapEntity } from '../utils/responseMapper.js';
import parsePositiveInt from '../utils/ParsePositive.js';


export const listarBitacora = async (req, res, next) => {
  try {
    const page = parsePositiveInt(req.query.page, 1);
    const pageSize = parsePositiveInt(req.query.pageSize, 50); 
    const { usuarioId, accion, recurso } = req.query;

    const where = {};
    if (usuarioId) where.usuarioId = Number(usuarioId);
    if (accion) where.accion = accion;
    if (recurso) where.recurso = { contains: recurso };

    const rawData = await prisma.bitacoraAccesos.findMany({
      where,
      skip: (page - 1) * pageSize,
      take: pageSize,
      orderBy: { fecha: 'desc' } 
    });

    const data = rawData.map(d => mapEntity(d));
    res.json({ page, pageSize, data });
  } catch (error) {
    next(error);
  }
};


export const registrarAcceso = async (req, res, next) => {
  try {
    const { usuarioId, recurso, accion, ip, userAgent } = req.body;
    
    const created = await prisma.bitacoraAccesos.create({
      data: {
        usuarioId: usuarioId ? Number(usuarioId) : null,
        recurso,
        accion,
        ip: ip || req.ip,
        userAgent: userAgent || req.headers['user-agent'],
        fecha: new Date()
      }
    });

    res.status(201).json(mapEntity(created));
  } catch (error) {
    next(error);
  }
};


export const bitacoraPorId = async (req, res, next) => {
  try {
    const id = Number(req.params.id);
    const log = await prisma.bitacoraAccesos.findUnique({
      where: { id }
    });

    if (!log) {
      const error = new Error('Registro de bitácora no encontrado');
      error.statusCode = 404;
      throw error; 
    }

    res.json(mapEntity(log));
  } catch (err) {
    next(err);
  }
};