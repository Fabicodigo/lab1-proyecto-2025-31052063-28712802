import { prisma } from '../prisma.js';
import { mapEntity } from '../utils/responseMapper.js';
import parsePositiveInt from '../utils/ParsePositive.js';


const resultadoInclude = {

};


export const listarResultados = async (req, res, next) => {
  try {
    const page = parsePositiveInt(req.query.page, 1);
    const pageSize = parsePositiveInt(req.query.pageSize, 20);

    const rawData = await prisma.resultados.findMany({
        skip: (page - 1) * pageSize,
        take: pageSize,
        orderBy: { fecha: 'desc' }, 
        include: resultadoInclude 
    });
    
   
    const data = rawData.map(p => mapEntity(p, {
      dateFields: ['fecha'],
    }));

    res.json({ page, pageSize, data });
  } catch (error) {
    console.error('Error listing resultados:', error);
    next(error);
  }
};


export const crearResultado = async (req, res, next) => {
  try {
    const data = req.body;
    
    const created = await prisma.resultados.create({ 
        data: {
            ordenId: data.ordenId ? Number(data.ordenId) : null,
            archivoId: data.archivoId ? Number(data.archivoId) : null,
            
            resumen: data.resumen || null,
            version: data.version ? Number(data.version) : 1, 
            fecha: data.fecha ? new Date(data.fecha) : new Date(), 
        }
    });
    res.status(201).json(created);
  } catch (error) {
    console.error('CreateResultado error', error);
    next(error);
  }
};


export const obtenerHistorialResultado = async (req, res, next) => {
    try {
        const id = Number(req.params.id);
        const historial = await prisma.resultadosHistorial.findMany({
            where: { resultadoId: id },
            orderBy: { version: 'desc' },
            include: { usuario: { select: { username: true } } }
        });
        res.json(historial);
    } catch(error) { next(error); }
};

export const ResultadoPorId = async (req, res, next) => {
  try {
    const id = Number(req.params.id);
    const item = await prisma.resultados.findUnique({ 
        where: { id },
        include: resultadoInclude
    });
    
    if (!item){
      const error = new Error("Resultado no encontrado");
      error.statusCode = 404;
      throw error;
    }
   
    return res.json(mapEntity(item, { dateFields: ['fecha'] })); 
  } catch (err) {
    console.error('getResultado error', err);
    return next(err);
  }
};

export const actualizarResultado = async (req, res, next) => {
  const id = Number(req.params.id);
  const { informe, conclusiones, usuarioId, motivo } = req.body; // Extraemos usuario y motivo

  try {
    const actualizar = {};
    
    // Mapeo de campos normales
    if (informe !== undefined) actualizar.informe = informe;
    if (conclusiones !== undefined) actualizar.conclusiones = conclusiones;
    
    // 👇 INYECCIÓN PARA EL MIDDLEWARE (prisma.js)
    // Esto es lo que dispara la creación automática del historial
    actualizar._usuarioId = usuarioId;
    actualizar._motivo = motivo;

    // Eliminamos lógica manual de versiones (prisma.js lo hace solo)
    // if (data.version !== undefined) ... <-- ELIMINADO

    const actualizado = await prisma.resultados.update({ 
        where: { id }, 
        data: actualizar 
    });
    
    return res.json(mapEntity(actualizado));
  } catch (error) {
    console.error('updateResultado error', error);
    next(error);
  }
};

export const eliminarResultado = async (req, res, next) => {
  try {
    const id = Number(req.params.id);
    await prisma.resultados.delete({ where: { id } }); 
    
    return res.status(204).send();
  } catch (err) {
    console.error('eliminarResultado error', err);
    return next(err);
  }
};