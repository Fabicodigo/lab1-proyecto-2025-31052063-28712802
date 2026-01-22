import { prisma } from '../prisma.js';
import { mapEntity } from '../utils/responseMapper.js';
import parsePositiveInt from '../utils/ParsePositive.js';


export const crearEpisodio = async (req, res, next) => {
  try {
    const data = req.body;
    

    const created = await prisma.episodiosatencion.create({ 
        data: {
            personaId: Number(data.personaId),
            profesionalId: data.profesionalId ? Number(data.profesionalId) : null,
            unidadId: data.unidadId ? Number(data.unidadId) : null,
            
            motivo: data.motivo,
            tipo: data.tipo,
            estado: data.estado || 'Abierto',
            fechaApertura: data.fechaApertura ? new Date(data.fechaApertura) : new Date(),
        }
    });
    res.status(201).json(mapEntity(created));
  } catch (error) {
    console.error('Error creating episodio:', error);
    next(error);
  }
};

export const listarEpisodios = async (req, res, next) => {
  try {
    const page = parsePositiveInt(req.query.page, 1);
    const pageSize = parsePositiveInt(req.query.pageSize, 20);
    const { personaId, estado } = req.query;

    const where = {};
    if (personaId) where.personaId = Number(personaId);
    if (estado) where.estado = estado;

    const rawData = await prisma.episodiosatencion.findMany({
        where,
        skip: (page - 1) * pageSize,
        take: pageSize,
        orderBy: { fechaApertura: 'desc' },
        include: {
            personasatendidas: {
                select: { nombres: true, apellidos: true, numeroDocumento: true }
            }
        }
    });
    
    const data = rawData.map(e => mapEntity(e));
    res.json({ page, pageSize, data });
  } catch (error) {
    next(error);
  }
};

export const obtenerEpisodio = async (req, res, next) => {
    try {
        const id = Number(req.params.id);
        const episodio = await prisma.episodiosatencion.findUnique({
            where: { id },
            include: {
                notasclinicas: true,
                diagnosticos: true,
                ordenes: true
            }
        });

        if (!episodio) {
            const error = new Error('Episodio no encontrado');
            error.statusCode = 404;
            throw error;
        }

        res.json(mapEntity(episodio));
    } catch (error) {
        next(error);
    }
};



export const notasEnEpisodio = async (req, res, next) => {
  try {
    const page = parsePositiveInt(req.query.page, 1);
    const pageSize = parsePositiveInt(req.query.pageSize, 20);

    const episodioId = Number(req.params.id);
    const notas = await prisma.notasclinicas.findMany({
        where: { episodioId },
        orderBy: { fecha: 'desc' }
    });
    const data = notas.map(n => mapEntity(n));
    res.json({ page, pageSize, data });
  } catch (error) {
    next(error);
  }
};

export const crearNotaEnEpisodio = async (req, res, next) => {
  try {
    const data = req.body;
    const episodioId = req.params.id ? Number(req.params.id) : Number(data.episodioId);

    if (!episodioId) {
        const err = new Error("El episodioId es obligatorio");
        err.statusCode = 400;
        throw err;
    }

    const Nota = await prisma.notasclinicas.create({
        data: {
            episodioId,
            profesionalId: Number(data.profesionalId),
            fecha: new Date(),
            subjetivo: data.subjetivo,
            objetivo: data.objetivo,
            analisis: data.analisis,
            plan: data.plan
        }
    });

    res.status(201).json(mapEntity(Nota));
  } catch (error) {
    console.error('Error creando nota:', error);
    next(error);
  }
};


export const diagnosticosEnEpisodio = async (req, res, next) => {
    try {
        const page = parsePositiveInt(req.query.page, 1);
        const pageSize = parsePositiveInt(req.query.pageSize, 20);

        const episodioId = Number(req.params.id);
        const diagnosticos = await prisma.diagnosticos.findMany({
            where: { episodioId },
            orderBy: { id: 'asc' }
        });
        const data = diagnosticos.map(d => mapEntity(d));
        res.json({ page, pageSize, data });
    } catch (error) {
        next(error);
    }
};

export const crearDiagnosticoEnEpisodio = async (req, res, next) => {
    try {
        const data = req.body;
        const episodioId = req.params.id ? Number(req.params.id) : Number(data.episodioId);

        if (!episodioId) {
            const err = new Error("El episodioId es obligatorio");
            err.statusCode = 400;
            throw err;
        }

      
        if (data.principal) {
            await prisma.diagnosticos.updateMany({
                where: { episodioId, principal: true },
                data: { principal: false }
            });
        }

        const diagnostico = await prisma.diagnosticos.create({
            data: {
                episodioId,
                codigo: data.codigo,
                descripcion: data.descripcion,
                tipo: data.tipo || 'Relacionado',
                principal: data.principal || false
            }
        });

        res.status(201).json(mapEntity(diagnostico));
    } catch (error) {
        next(error);
    }
};



export const consentimientosEnEpisodio = async (req, res, next) => {
    try {
        const page = parsePositiveInt(req.query.page, 1);
        const pageSize = parsePositiveInt(req.query.pageSize, 20);

        const episodioId = Number(req.params.id);
        const consentimientos = await prisma.consentimientos.findMany({
            where: { episodioId },
            orderBy: { fecha: 'desc' }
        });
        const data = consentimientos.map(c => mapEntity(c));
        res.json({ page, pageSize, data });
    } catch (error) {
        next(error);
    }
};

export const crearConsentimientoEnEpisodio = async (req, res, next) => {
    try {
        const data = req.body;
        const episodioId = Number(req.params.id);

        if (!episodioId) {
            const err = new Error("El episodioId es obligatorio");
            err.statusCode = 400;
            throw err;
        }

        const consentimiento = await prisma.consentimientos.create({
            data: {
                episodioId,
                tipoProcedimiento: data.tipoProcedimiento,
                nombre: data.nombre,
                fecha: data.fecha ? new Date(data.fecha) : new Date(),
            }
        });

        res.status(201).json(mapEntity(consentimiento));
    } catch (error) {
        next(error);
    }
};