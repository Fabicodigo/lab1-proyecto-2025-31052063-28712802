import { prisma } from '../prisma.js';
import { mapEntity } from '../utils/responseMapper.js';
import parsePositiveInt from '../utils/ParsePositive.js';


export const listarPrestaciones = async (req, res, next) => {
  try {
    const page = parsePositiveInt(req.query.page, 1);
    const pageSize = parsePositiveInt(req.query.pageSize, 20);
    const grupo = req.query.grupo;
    const where = grupo ? { grupo } : {};

    const rawData = await prisma.prestaciones.findMany({
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

export const crearPrestacion = async (req, res, next) => {
  try {
    const { codigo, nombre, grupo, requisitos, tiempoEstimado } = req.body;
    
    const created = await prisma.prestaciones.create({
      data: {
        codigo, 
        nombre,
        grupo,
        requisitos, 
        tiempoEstimado: tiempoEstimado ? Number(tiempoEstimado) : null
      }
    });

    res.status(201).json(mapEntity(created));
  } catch (error) {
    next(error);
  }
};


export const prestacionPorId = async (req, res, next) => {
  try {
    const id = Number(req.params.id);
    const prestacion = await prisma.prestaciones.findUnique({
      where: { id }
    });

    if (!prestacion) {
      const error = new Error('Prestación no encontrada en el catálogo');
      error.statusCode = 404;
      throw error; 
    }

    res.json(mapEntity(prestacion));
  } catch (err) {
    next(err);
  }
};


export const actualizarPrestacion = async (req, res, next) => {
  try {
    const id = Number(req.params.id);
    const data = req.body;

    const actualizado = await prisma.prestaciones.update({ 
      where: { id }, 
      data: {
        codigo: data.codigo,
        nombre: data.nombre,
        grupo: data.grupo,
        requisitos: data.requisitos,
        tiempoEstimado: data.tiempoEstimado ? Number(data.tiempoEstimado) : undefined
      }
    });
    
    res.json(mapEntity(actualizado));
  } catch (err) {
    next(err);
  }
};


export const eliminarPrestacion = async (req, res, next) => {
  try {
    const id = Number(req.params.id);
    await prisma.prestaciones.delete({ where: { id } });
    res.status(204).send(); 
  } catch (err) {
    next(err);
  }
};