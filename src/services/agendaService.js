import { prisma } from '../prisma.js';
import AppError from '../utils/AppError.js';

export const crearBloqueAgenda = async (data) => {
  const { profesionalId, unidadId, inicio, fin } = data;
  const fechaInicio = new Date(inicio);
  const fechaFin = new Date(fin);

  // Validación 1: Fechas coherentes
  if (fechaInicio >= fechaFin) {
    throw new AppError("La fecha de inicio debe ser anterior a la de fin.", 400);
  }

  // Validación 2: No permitir crear agendas en el pasado
  if (fechaInicio < new Date()) {
    throw new AppError("No se puede crear agenda en fechas pasadas.", 400);
  }

  // Validación 3: Solapamiento de Agendas (El médico no puede estar en dos lugares)
  const solapamiento = await prisma.agenda.findFirst({
    where: {
      profesionalId: Number(profesionalId),
      estado: 'Activo', // Asumiendo que solo verificamos agendas activas
      OR: [
        {
          inicio: { lt: fechaFin },
          fin: { gt: fechaInicio }
        }
      ]
    }
  });

  if (solapamiento) {
    throw new AppError(`El profesional ya tiene una agenda creada en ese horario (ID: ${solapamiento.id}).`, 409);
  }

  // Creación
  return await prisma.agenda.create({
    data: {
      profesionalId: Number(profesionalId),
      unidadId: Number(unidadId),
      inicio: fechaInicio,
      fin: fechaFin,
      capacidad: data.capacidad || 1,
      estado: 'Activo'
    }
  });
};