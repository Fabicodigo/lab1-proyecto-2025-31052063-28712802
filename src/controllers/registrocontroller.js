import { prisma } from '../prisma.js';
import { mapEntity } from '../utils/responseMapper.js';
import parsePositiveInt from '../utils/ParsePositive.js';

export const listarEpisodios = async (req, res, next) => {
  try {
    const page = parsePositiveInt(req.query.page, 1);
    const pageSize = parsePositiveInt(req.query.pageSize, 20);

    const rows = await prisma.episodiosatencion.findMany({
        skip: (page - 1) * pageSize,
        take: pageSize,
        orderBy: { fechaApertura: 'desc' }
    });
    const items = rows.map(row => mapEntity(row));
    res.json({ items, page, pageSize });
  } catch (error) {
    console.error('Error listing episodios:', error);
    next(error);
  }
};

export const crearEpisodio = async (req, res, next) => {
  try {
    const data = req.body;
    const created = await prisma.episodiosatencion.create({ 
        data: {...data,
            personaId: Number(data.personaId),
            fechaApertura: data.fechaApertura ? new Date(data.fechaApertura) : null,
        }
    });
    res.status(201).json(created);
  } catch (error) {
    console.error('Error creating episodio:', error);
    next(error);
  }
};

export const notasEnEpisodio = async (req, res, next) => {
    try {
        const episodioId = Number(req.params.id);
        const notas = await prisma.notasclinicas.findMany({
            where: { episodioId }
        });
        res.json(notas);
    } catch (error) {
        console.error('Error fetching notas in episodio:', error);
        next(error);
    }
};

export const crearNotaEnEpisodio = async (req, res, next) => {
  try {
    const data = req.body;
    const created = await prisma.notasclinicas.create({ data });
    res.status(201).json(created);
  } catch (error) {
    console.error('Error creating nota:', error);
    next(error);
  }
};

export const diagnosticosEnEpisodio = async (req, res, next) => {
    try {
        const episodioId = Number(req.params.id);
        const diagnosticos = await prisma.diagnosticos.findMany({
            where: { episodioId }
        });
        res.json(diagnosticos);
    } catch (error) {
        console.error('Error fetching diagnosticos in episodio:', error);
        next(error);
    }
};

export const crearDiagnosticoEnEpisodio = async (req, res, next) => {
  try {
    const data = req.body;
    const created = await prisma.diagnosticos.create({ data });
    res.status(201).json(created);
  } catch (error) {
    console.error('Error creating diagnostico:', error);
    next(error);
  }
};

export const consentimientosEnEpisodio = async (req, res, next) => {
    try {
        const personaId = Number(req.params.id);
        const consentimientos = await prisma.consentimientos.findMany({
            where: { personaId }
        });
        res.json(consentimientos);
    } catch (error) {
        console.error('Error fetching consentimientos in episodio:', error);
        next(error);
    }
};

export const crearConsentimientoEnEpisodio = async (req, res, next) => {
  try {
    const data = req.body;
    const created = await prisma.consentimientos.create({ data });
    res.status(201).json(created);
  } catch (error) {
    console.error('Error creating consentimiento:', error);
    next(error);
  }
};