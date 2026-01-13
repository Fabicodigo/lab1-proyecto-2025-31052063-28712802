import { prisma } from '../prisma.js';
import { mapEntity } from '../utils/responseMapper.js';
import parsePositiveInt from '../utils/ParsePositive.js';


const prescripcionInclude = {
  
};


export const listarPrescripciones = async (req, res, next) => {
  try {
    const page = parsePositiveInt(req.query.page, 1);
    const pageSize = parsePositiveInt(req.query.pageSize, 20);

    const rawData = await prisma.prescripciones.findMany({
        skip: (page - 1) * pageSize,
        take: pageSize,
        orderBy: { id: 'desc' }, 
        include: prescripcionInclude 
    });
    
    
    const data = rawData.map(p => mapEntity(p, {
      
    }));

    res.json({ page, pageSize, data });
  } catch (error) {
    console.error('Error listing prescripciones:', error);
    next(error);
  }
};


export const crearPrescripcion = async (req, res, next) => {
  try {
    const data = req.body;
    

    const created = await prisma.prescripciones.create({ 
        data: {
            episodioId: data.episodioId ? Number(data.episodioId) : null,
            observaciones: data.observaciones || null,
        }
    });
    res.status(201).json(created);
  } catch (error) {
    console.error('CreatePrescripcion error', error);
    next(error);
  }
};


export const PrescripcionPorId = async (req, res, next) => {
  try {
    const id = Number(req.params.id);
    const item = await prisma.prescripciones.findUnique({ 
        where: { id },
        include: prescripcionInclude
    });
    
    if (!item){
      const error = new Error("Prescripción no encontrada");
      error.statusCode = 404;
      throw error;
    }
  
    return res.json(mapEntity(item, { /* dateFields: [] */ })); 
  } catch (err) {
    console.error('getPrescripcion error', err);
    return next(err);
  }
};


export const actualizarPrescripcion = async (req, res, next) => {
  const id = Number(req.params.id);
  const data = req.body;

  try {
    const actualizar = {};

    if (data.episodioId !== undefined) actualizar.episodioId = data.episodioId ? Number(data.episodioId) : null;
    if (data.observaciones !== undefined) actualizar.observaciones = data.observaciones;

    const actualizado = await prisma.prescripciones.update({ where: { id }, data: actualizar });
    return res.json(actualizado);
  } catch (error) {
    console.error('updatePrescripcion error', error);
   next(error);
  }
};


export const eliminarPrescripcion = async (req, res, next) => {
  try {
    const id = Number(req.params.id);
    await prisma.prescripciones.delete({ where: { id } }); 
   
    return res.status(204).send();
  } catch (err) {
    console.error('eliminarPrescripcion error', err);
    return next(err);
  }
};