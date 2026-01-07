import { prisma } from '../prisma.js';
import { mapEntity } from '../utils/responseMapper.js';
import parsePositiveInt from '../utils/ParsePositive.js';


export const listarPagos = async (req, res, next) => {
  try {
    const page = parsePositiveInt(req.query.page, 1);
    const pageSize = parsePositiveInt(req.query.pageSize, 20);
    const { facturaId, medio } = req.query;

    const where = {};
    if (facturaId) where.facturaId = Number(facturaId);
    if (medio) where.medio = medio;

    const rawData = await prisma.pagos.findMany({
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


export const registrarPago = async (req, res, next) => {
  try {
    const { facturaId, monto, medio, referencia, estado, fecha } = req.body;
    

    const created = await prisma.pagos.create({
      data: {
        facturaId: Number(facturaId),
        monto: Number(monto),
        medio: medio, 
        referencia: referencia || null,
        estado: estado || 'completado',
        fecha: fecha ? new Date(fecha) : new Date()
      }
    });

    
    res.status(201).json(mapEntity(created));
  } catch (error) {
    next(error);
  }
};


export const pagoPorId = async (req, res, next) => {
  try {
    const id = Number(req.params.id);
    const pago = await prisma.pagos.findUnique({
      where: { id },
      include: { factura: true }
    });

    if (!pago) {
      const error = new Error('Registro de pago no encontrado');
      error.statusCode = 404;
      throw error; 
    }

    res.json(mapEntity(pago));
  } catch (err) {
    next(err);
  }
};


export const actualizarEstadoPago = async (req, res, next) => {
  try {
    const id = Number(req.params.id);
    const { estado } = req.body;

    const actualizado = await prisma.pagos.update({ 
      where: { id }, 
      data: { estado }
    });
    
    res.json(mapEntity(actualizado));
  } catch (err) {
    next(err);
  }
};


export const eliminarPago = async (req, res, next) => {
  try {
    const id = Number(req.params.id);
    await prisma.pagos.delete({ where: { id } });
    res.status(204).send(); 
  } catch (err) {
    next(err);
  }
};