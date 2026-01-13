import { prisma } from '../prisma.js';
import { mapEntity } from '../utils/responseMapper.js';
import parsePositiveInt from '../utils/ParsePositive.js';


export const listarAseguradoras = async (req, res, next) => {
  try {
    const page = parsePositiveInt(req.query.page, 1);
    const pageSize = parsePositiveInt(req.query.pageSize, 20);
    const estado = req.query.estado; 

    const where = estado ? { estado } : {};

    const rawData = await prisma.aseguradoras.findMany({
      where: where,
      skip: (page - 1) * pageSize,
      take: pageSize,
      orderBy: { nombre: 'asc' }
    });

    const data = rawData.map(d => mapEntity(d));

    res.json({ page, pageSize, data });
  } catch (error) {
    next(error);
  }
};


export const crearAseguradora = async (req, res, next) => {
  try {
    const { nombre, nit, contacto, estado } = req.body;
    
    const created = await prisma.aseguradoras.create({
      data: {
        nombre,
        nit,
        contacto,
        estado: estado || 'Activo'
      }
    });

    res.status(201).json(mapEntity(created));
  } catch (error) {
    next(error);
  }
};


export const aseguradoraPorId = async (req, res, next) => {
  try {
    const id = Number(req.params.id);

    const aseguradora = await prisma.aseguradoras.findUnique({
      where: { id }
    });

    if (!aseguradora) {
      const error = new Error('Aseguradora no encontrada');
      error.statusCode = 404;
      throw error; 
    }

    res.json(mapEntity(aseguradora));
  } catch (err) {
    next(err);
  }
};


export const actualizarAseguradora = async (req, res, next) => {
  try {
    const id = Number(req.params.id);
    const data = req.body;

    const actualizado = await prisma.aseguradoras.update({ 
      where: { id }, 
      data: {
        nombre: data.nombre,
        nit: data.nit,
        contacto: data.contacto,
        estado: data.estado
      }
    });
    
    res.json(mapEntity(actualizado));
  } catch (err) {
    next(err);
  }
};


export const eliminarAseguradora = async (req, res, next) => {
  try {
    const id = Number(req.params.id);
    
    await prisma.aseguradoras.delete({
      where: { id }
    });

    res.status(204).send(); 
  } catch (err) {
    next(err);
  }
};