import { prisma } from '../prisma.js';
import AppError from '../utils/AppError.js';

const MAX_DURACION_HORAS = 4;

export const validarDisponibilidad = async (profesionalId, unidadId, inicio, fin, citaIdExcluir = null) => {
  const fechaInicio = new Date(inicio);
  const fechaFin = new Date(fin);

  const duracionMs = fechaFin - fechaInicio;
  const duracionHoras = duracionMs / (1000 * 60 * 60);

  if (duracionHoras > MAX_DURACION_HORAS) {
    throw new AppError(`La cita no puede exceder las ${MAX_DURACION_HORAS} horas.`, 400);
  }
  if (duracionHoras <= 0) {
    throw new AppError("La duración de la cita debe ser positiva.", 400);
  }

  const agendaBloque = await prisma.agenda.findFirst({
    where: {
      profesionalId,
      unidadId,
      estado: 'Abierto', 
      inicio: { lte: fechaInicio }, 
      fin: { gte: fechaFin }        
    }
  });

  if (!agendaBloque) {
    throw new AppError("No existe agenda abierta o disponible para el profesional en este horario y unidad.", 409);
  }


  const solapamiento = await prisma.citas.findFirst({
    where: {
      profesionalId, 
      estado: { notIn: ['Cancelada', 'NoAsistida'] }, 
      id: citaIdExcluir ? { not: citaIdExcluir } : undefined, 
      OR: [
        
        { AND: [{ inicio: { lte: fechaInicio } }, { fin: { gt: fechaInicio } }] },
        { AND: [{ inicio: { lt: fechaFin } }, { fin: { gte: fechaFin } }] },
        { AND: [{ inicio: { gte: fechaInicio } }, { fin: { lte: fechaFin } }] }
      ]
    }
  });

  if (solapamiento) {
    throw new AppError("El profesional ya tiene una cita agendada en este horario.", 409);
  }

  return true;
};

export const reprogramarCita = async (id, data) => {
  const citaActual = await prisma.citas.findUnique({ where: { id } });
  if (!citaActual) throw new AppError("Cita no encontrada", 404);

  if (data.inicio || data.fin) {
    const nuevoInicio = data.inicio ? new Date(data.inicio) : citaActual.inicio;
    const nuevoFin = data.fin ? new Date(data.fin) : citaActual.fin;
    
    await validarDisponibilidad(
        citaActual.profesionalId, 
        citaActual.unidadId, 
        nuevoInicio, 
        nuevoFin, 
        id
    );
  }

  return await prisma.citas.update({
    where: { id },
    data: {
        inicio: data.inicio ? new Date(data.inicio) : undefined,
        fin: data.fin ? new Date(data.fin) : undefined,
        estado: data.estado,
        motivo: data.motivo
    }
  });
};