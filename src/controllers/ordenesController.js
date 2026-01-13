import { prisma } from '../prisma.js';
import { mapEntity } from '../utils/responseMapper.js';
import parsePositiveInt from '../utils/ParsePositive.js';


const ordenInclude = {

};


export const listarOrdenes = async (req, res, next) => {
  try {
    const page = parsePositiveInt(req.query.page, 1);
    const pageSize = parsePositiveInt(req.query.pageSize, 20);

    const rawData = await prisma.ordenes.findMany({
        skip: (page - 1) * pageSize,
        take: pageSize,
        orderBy: { id: 'asc' },
        include: ordenInclude 
    });
    
  
    const data = rawData.map(p => mapEntity(p, {
  
    }));

    res.json({ page, pageSize, data });
  } catch (error) {
    console.error('Error listing ordenes:', error);
    next(error);
  }
};


export const crearOrden = async (req, res, next) => {
  try {
    const data = req.body;
    
    const created = await prisma.ordenes.create({ 
        data: {
            episodioId: data.episodioId ? Number(data.episodioId) : null, 
            tipo: data.tipo || 'General', 
            prioridad: data.prioridad || 'Media', 
            estado: data.estado || 'Pendiente', 
        }
    });
    res.status(201).json(created);
  } catch (error) {
    console.error('CreateOrden error', error);
    next(error);
  }
};


export const OrdenPorId = async (req, res, next) => {
  try {
    const id = Number(req.params.id);
    const item = await prisma.ordenes.findUnique({ 
        where: { id },
        include: ordenInclude
    });
    
    if (!item){
      const error = new Error("Orden no encontrada");
      error.statusCode = 404;
      throw error;
    }
    
    return res.json(mapEntity(item, { /* dateFields: [] */ })); 
  } catch (err) {
    console.error('getOrden error', err);
    return next(err);
  }
};

export const actualizarOrden = async (req, res, next) => {
  const id = Number(req.params.id);
  const data = req.body;

  try {
    if (data.estado === "Cancelada") { 
       
        const error = new Error("No está permitido cancelar/desactivar el estado por PATCH. Use DELETE o un endpoint específico.");
        error.statusCode = 400;
        throw error;
    }

    const actualizar = {};

    if (data.episodioId !== undefined) actualizar.episodioId = data.episodioId ? Number(data.episodioId) : null;
    if (data.tipo) actualizar.tipo = data.tipo;
    if (data.prioridad) actualizar.prioridad = data.prioridad;
    if (data.estado) actualizar.estado = data.estado;

    const actualizado = await prisma.ordenes.update({ where: { id }, data: actualizar });
    return res.json(actualizado);
  } catch (error) {
    console.error('updateOrden error', error);
   next(error);
  }
};


export const desactivarOrden = async (req, res, next) => {
  try {
    const id = Number(req.params.id);
    
    await prisma.ordenes.update({ where: { id }, data: { estado: 'Cancelada' } }); 
    return res.status(204).send();
  } catch (err) {
    console.error('desactivarOrden error', err);
    return next(err);
  }
};