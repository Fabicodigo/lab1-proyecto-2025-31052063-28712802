import { prisma } from '../prisma.js';
import { mapEntity } from '../utils/responseMapper.js';
import parsePositiveInt from '../utils/ParsePositive.js';

// Configuración de los includes (asumiendo que la relación con Facturas se llama 'facturas')
const pagoInclude = {
    // Si tu relación en schema.prisma se llama diferente, ajusta aquí (ej: 'factura')
    facturas: { select: { id: true /* Puedes añadir más campos de la Factura */ } } 
};

// --- Funciones CRUD ---

export const listarPagos = async (req, res, next) => {
  try {
    const page = parsePositiveInt(req.query.page, 1);
    const pageSize = parsePositiveInt(req.query.pageSize, 20);

    const rawData = await prisma.pagos.findMany({
        skip: (page - 1) * pageSize,
        take: pageSize,
        orderBy: { fecha: 'desc' }, // Ordenamos por fecha del pago más reciente
        include: pagoInclude
    });
    
    // Mapeamos los datos, incluyendo el campo de fecha
    const data = rawData.map(p => mapEntity(p, {
      dateFields: ['fecha'], 
    }));

    res.json({ page, pageSize, data });
  } catch (error) {
    console.error('Error listing pagos:', error);
    next(error);
  }
};

export const crearPago = async (req, res, next) => {
  try {
    const data = req.body;
    
    if (!data.facturaId || !data.fecha || !data.monto || !data.medio) {
        const error = new Error("Faltan campos obligatorios (facturaId, fecha, monto, medio).");
        error.statusCode = 400;
        throw error;
    }

    const created = await prisma.pagos.create({ 
        data: {
            facturaId: Number(data.facturaId),
            monto: Number(data.monto),
            fecha: new Date(data.fecha), 

            medio: data.medio,
            referencia: data.referencia || null,
            estado: data.estado || 'Pagado', 
        }
    });
    res.status(201).json(created);
  } catch (error) {
    console.error('Error creating pago:', error);
    next(error);
  }
};

export const PagoPorId = async (req, res, next) => {
  try {
    const id = Number(req.params.id);
    const item = await prisma.pagos.findUnique({ 
        where: { id },
        include: pagoInclude
    });
    
    if (!item){
      const error = new Error("Registro de Pago no encontrado");
      error.statusCode = 404;
      throw error;
    }
    return res.json(mapEntity(item, { dateFields: ['fecha'] }));
  } catch (err) {
    console.error('getPago error', err);
    return next(err);
  }
};

export const actualizarPago = async (req, res, next) => {
  const id = Number(req.params.id);
  const data = req.body;

  try {
    // Restricción de borrado suave
    if (data.estado === "Anulado" || data.estado === "Desactivado") {
        const error = new Error("No está permitido cambiar el estado a 'Anulado' o 'Desactivado' por PATCH. Use DELETE (desactivarPago).");
        error.statusCode = 400;
        throw error;
    }

    const actualizar = {};

    if (data.facturaId !== undefined) actualizar.facturaId = Number(data.facturaId);
    if (data.monto !== undefined) actualizar.monto = Number(data.monto);
    
    if (data.fecha) actualizar.fecha = new Date(data.fecha); 

    if (data.medio) actualizar.medio = data.medio;
    if (data.referencia) actualizar.referencia = data.referencia;
    if (data.estado) actualizar.estado = data.estado;

    const actualizado = await prisma.pagos.update({ where: { id }, data: actualizar });
    return res.json(actualizado);
  } catch (error) {
    console.error('updatePago error', error);
   next(error);
  }
};

export const desactivarPago = async (req, res, next) => {
  try {
    const id = Number(req.params.id);
    // Borrado suave (soft delete) cambiando el estado a 'Anulado'
    await prisma.pagos.update({ where: { id }, data: { estado: 'Anulado' } });
    return res.status(204).send();
  } catch (err) {
    console.error('desactivarPago error', err);
    return next(err);
  }
};