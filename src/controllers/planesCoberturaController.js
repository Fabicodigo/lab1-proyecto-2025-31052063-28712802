import { prisma } from '../prisma.js';
import { mapEntity } from '../utils/responseMapper.js';
import parsePositiveInt from '../utils/ParsePositive.js';


export const listarPlanesCobertura = async (req, res, next) => {
  try {
    const page = parsePositiveInt(req.query.page, 1);
    const pageSize = parsePositiveInt(req.query.pageSize, 20);
    
    const aseguradoraId = req.query.aseguradoraId ? Number(req.query.aseguradoraId) : undefined;
    const where = aseguradoraId ? { aseguradoraId } : {};

    const rawData = await prisma.planesCobertura.findMany({
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


export const crearPlanCobertura = async (req, res, next) => {
  try {
    const { aseguradoraId, nombre, condicionesGenerales } = req.body;
    
    const created = await prisma.planesCobertura.create({
      data: {
        aseguradoraId: Number(aseguradoraId),
        nombre,
        condicionesGenerales
      }
    });

    res.status(201).json(mapEntity(created));
  } catch (error) {
    next(error);
  }
};


export const planCoberturaPorId = async (req, res, next) => {
  try {
    const id = Number(req.params.id);
    const plan = await prisma.planesCobertura.findUnique({
      where: { id }
    });

    if (!plan) {
      const error = new Error('Plan de cobertura no encontrado');
      error.statusCode = 404;
      throw error; 
    }

    res.json(mapEntity(plan));
  } catch (err) {
    next(err);
  }
};


export const actualizarPlanCobertura = async (req, res, next) => {
  try {
    const id = Number(req.params.id);
    const data = req.body;

    const actualizado = await prisma.planesCobertura.update({ 
      where: { id }, 
      data: {
        nombre: data.nombre,
        condicionesGenerales: data.condicionesGenerales,
        aseguradoraId: data.aseguradoraId ? Number(data.aseguradoraId) : undefined
      }
    });
    
    res.json(mapEntity(actualizado));
  } catch (err) {
    next(err);
  }
};


export const eliminarPlanCobertura = async (req, res, next) => {
  try {
    const id = Number(req.params.id);
    await prisma.planesCobertura.delete({ where: { id } });
    res.status(204).send(); 
  } catch (err) {
    next(err);
  }
};