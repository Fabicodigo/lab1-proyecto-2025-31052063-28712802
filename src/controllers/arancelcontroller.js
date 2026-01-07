import { prisma } from '../prisma.js';
import { mapEntity } from '../utils/responseMapper.js';
import parsePositiveInt from '../utils/ParsePositive.js';


export const listarAranceles = async (req, res, next) => {
  try {
    const page = parsePositiveInt(req.query.page, 1);
    const pageSize = parsePositiveInt(req.query.pageSize, 20);
    
    const prestacionCodigo = req.query.prestacionCodigo;
    const planId = req.query.planId ? Number(req.query.planId) : undefined;

    const where = {};
    if (prestacionCodigo) where.prestacionCodigo = prestacionCodigo;
    if (planId !== undefined) where.planId = planId;

    const rawData = await prisma.arancel.findMany({
      where,
      skip: (page - 1) * pageSize,
      take: pageSize,
      orderBy: { vigenteDesde: 'desc' }
    });

    const data = rawData.map(d => mapEntity(d));
    res.json({ page, pageSize, data });
  } catch (error) {
    next(error);
  }
};


export const crearArancel = async (req, res, next) => {
  try {
    const data = req.body;
    
    const created = await prisma.arancel.create({
      data: {
        prestacionCodigo: data.prestacionCodigo,
        planId: data.planId ? Number(data.planId) : null,
        valorBase: Number(data.valorBase),
        impuestos: Number(data.impuestos) || 0,
        vigenteDesde: new Date(data.vigenteDesde),
        vigenteHasta: data.vigenteHasta ? new Date(data.vigenteHasta) : null
      }
    });

    res.status(201).json(mapEntity(created));
  } catch (error) {
    next(error);
  }
};


export const arancelPorId = async (req, res, next) => {
  try {
    const id = Number(req.params.id);
    const tarifa = await prisma.arancel.findUnique({
      where: { id }
    });

    if (!tarifa) {
      const error = new Error('Tarifa no encontrada en el arancel');
      error.statusCode = 404;
      throw error; 
    }

    res.json(mapEntity(tarifa));
  } catch (err) {
    next(err);
  }
};


export const actualizarArancel = async (req, res, next) => {
  try {
    const id = Number(req.params.id);
    const data = req.body;

    const updateData = {};
    if (data.valorBase !== undefined) updateData.valorBase = Number(data.valorBase);
    if (data.impuestos !== undefined) updateData.impuestos = Number(data.impuestos);
    if (data.vigenteDesde) updateData.vigenteDesde = new Date(data.vigenteDesde);
    if (data.vigenteHasta) updateData.vigenteHasta = new Date(data.vigenteHasta);
    if (data.planId !== undefined) updateData.planId = data.planId ? Number(data.planId) : null;

    const actualizado = await prisma.arancel.update({ 
      where: { id }, 
      data: updateData
    });
    
    res.json(mapEntity(actualizado));
  } catch (err) {
    next(err);
  }
};


export const eliminarArancel = async (req, res, next) => {
  try {
    const id = Number(req.params.id);
    await prisma.arancel.delete({ where: { id } });
    res.status(204).send(); 
  } catch (err) {
    next(err);
  }
};