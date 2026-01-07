import { prisma } from '../prisma.js';
import { mapEntity } from '../utils/responseMapper.js';
import parsePositiveInt from '../utils/ParsePositive.js';


export const listarAfiliaciones = async (req, res, next) => {
  try {
    const page = parsePositiveInt(req.query.page, 1);
    const pageSize = parsePositiveInt(req.query.pageSize, 20);
    
    const personaId = req.query.personaId ? Number(req.query.personaId) : undefined;
    const planId = req.query.planId ? Number(req.query.planId) : undefined;

    const where = {};
    if (personaId) where.personaId = personaId;
    if (planId) where.planId = planId;

    const rawData = await prisma.afiliaciones.findMany({
      where: where,
      skip: (page - 1) * pageSize,
      take: pageSize,
      include: { 
        planesCobertura: true 
      },
      orderBy: { vigenteDesde: 'desc' }
    });

    const data = rawData.map(d => mapEntity(d));
    res.json({ page, pageSize, data });
  } catch (error) {
    next(error);
  }
};


export const crearAfiliacion = async (req, res, next) => {
  try {
    const data = req.body;
    
    const created = await prisma.afiliaciones.create({
      data: {
        personaId: Number(data.personaId),
        planId: Number(data.planId),
        numeroPoliza: data.numeroPoliza,
        vigenteDesde: new Date(data.vigenteDesde),
        vigenteHasta: data.vigenteHasta ? new Date(data.vigenteHasta) : null,
        copago: Number(data.copago) || 0,
        cuotaModeradora: Number(data.cuotaModeradora) || 0
      }
    });

    res.status(201).json(mapEntity(created));
  } catch (error) {
    next(error);
  }
};


export const afiliacionPorId = async (req, res, next) => {
  try {
    const id = Number(req.params.id);
    const afiliacion = await prisma.afiliaciones.findUnique({
      where: { id },
      include: { planesCobertura: true }
    });

    if (!afiliacion) {
      const error = new Error('Registro de afiliación no encontrado');
      error.statusCode = 404;
      throw error; 
    }

    res.json(mapEntity(afiliacion));
  } catch (err) {
    next(err);
  }
};


export const actualizarAfiliacion = async (req, res, next) => {
  try {
    const id = Number(req.params.id);
    const data = req.body;

    const updateData = {};
    if (data.numeroPoliza) updateData.numeroPoliza = data.numeroPoliza;
    if (data.vigenteDesde) updateData.vigenteDesde = new Date(data.vigenteDesde);
    if (data.vigenteHasta) updateData.vigenteHasta = new Date(data.vigenteHasta);
    if (data.copago !== undefined) updateData.copago = Number(data.copago);
    if (data.cuotaModeradora !== undefined) updateData.cuotaModeradora = Number(data.cuotaModeradora);
    if (data.planId) updateData.planId = Number(data.planId);

    const actualizado = await prisma.afiliaciones.update({ 
      where: { id }, 
      data: updateData
    });
    
    res.json(mapEntity(actualizado));
  } catch (err) {
    next(err);
  }
};


export const eliminarAfiliacion = async (req, res, next) => {
  try {
    const id = Number(req.params.id);
    await prisma.afiliaciones.delete({ where: { id } });
    res.status(204).send(); 
  } catch (err) {
    next(err);
  }
};
