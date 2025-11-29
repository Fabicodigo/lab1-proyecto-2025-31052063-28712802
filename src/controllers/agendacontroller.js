import { prisma } from '../prisma.js';
import { mapEntity } from '../utils/responseMapper.js';
import parsePositiveInt from '../utils/ParsePositive.js';

// Configuración de los includes para devolver datos completos
const agendaInclude = {
    profesionales: { select: { nombres: true, apellidos: true } },
    unidadesatencion: { select: { nombre: true } }
};

// --- Funciones CRUD ---

export const listarAgenda = async (req, res, next) => {
  try {
    const page = parsePositiveInt(req.query.page, 1);
    const pageSize = parsePositiveInt(req.query.pageSize, 20);

    const rawData = await prisma.agenda.findMany({
        skip: (page - 1) * pageSize,
        take: pageSize,
        orderBy: { inicio: 'asc' }, 
        include: agendaInclude // Incluimos las relaciones
    });
    
    // Mapeamos los datos, incluyendo los campos de fecha
    const data = rawData.map(p => mapEntity(p, {
      dateFields: ['inicio', 'fin'], 
    }));

    res.json({ page, pageSize, data });
  } catch (error) {
    console.error('Error listing agenda:', error);
    next(error);
  }
};

export const crearAgenda = async (req, res, next) => {
  try {
    const data = req.body;
    
    // Validar que los campos obligatorios para agendar existan
    if (!data.profesionalId || !data.unidadId || !data.inicio || !data.fin) {
      const error = new Error("Faltan campos obligatorios (profesionalId, unidadId, inicio, fin).");
      error.statusCode = 400;
      throw error;
    }

    const created = await prisma.agenda.create({ 
        data: {
            profesionalId: Number(data.profesionalId),
            unidadId: Number(data.unidadId),
            
            // Conversión de fechas
            inicio: new Date(data.inicio), 
            fin: new Date(data.fin), 

            // Campos de texto y estado
            capacidad: data.capacidad ? Number(data.capacidad) : null,
            estado: data.estado || 'Disponible', 
        }
    });
    res.status(201).json(created);
  } catch (error) {
    console.error('Error creating agenda:', error);
    next(error);
  }
};

export const AgendaPorId = async (req, res, next) => {
  try {
    const id = Number(req.params.id);
    const item = await prisma.agenda.findUnique({ 
        where: { id },
        include: agendaInclude
    });
    
    if (!item){
      const error = new Error("Registro de Agenda no encontrado");
      error.statusCode = 404;
      throw error;
    }
    // Mapeamos el resultado
    return res.json(mapEntity(item, { dateFields: ['inicio', 'fin'] }));
  } catch (err) {
    console.error('getAgenda error', err);
    return next(err);
  }
};

export const actualizarAgenda = async (req, res, next) => {
  const id = Number(req.params.id);
  const data = req.body;

  try {
    // Implementamos la restricción de "Desactivado" del controlador de personas
    if (data.estado === "Desactivado") {
        const error = new Error("No está permitido cambiar el estado a 'Desactivado' por PATCH. Use DELETE.");
        error.statusCode = 400;
        throw error;
    }

    const actualizar = {};

    // Mapeo condicional de campos
    if (data.profesionalId !== undefined) actualizar.profesionalId = data.profesionalId ? Number(data.profesionalId) : null;
    if (data.unidadId !== undefined) actualizar.unidadId = data.unidadId ? Number(data.unidadId) : null;
    
    if (data.inicio) actualizar.inicio = new Date(data.inicio); 
    if (data.fin) actualizar.fin = new Date(data.fin); 
    if (data.capacidad !== undefined) actualizar.capacidad = data.capacidad ? Number(data.capacidad) : null;
    if (data.estado) actualizar.estado = data.estado;

    const actualizado = await prisma.agenda.update({ where: { id }, data: actualizar });
    return res.json(actualizado);
  } catch (error) {
    console.error('updateAgenda error', error);
   next(error);
  }
};

export const desactivarAgenda = async (req, res, next) => {
  try {
    const id = Number(req.params.id);
    // Borrado suave (soft delete)
    await prisma.agenda.update({ where: { id }, data: { estado: 'Desactivado' } });
    return res.status(204).send();
  } catch (err) {
    console.error('desactivarAgenda error', err);
    return next(err);
  }
};