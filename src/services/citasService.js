import { prisma } from '../prisma.js';
import AppError from '../utils/AppError.js';

const validarDisponibilidad = async (profesionalId, unidadId, inicio, fin, excluirCitaId = null) => {
  const fechaInicio = new Date(inicio);
  const fechaFin = new Date(fin);

  // 1. Validar Coherencia
  if (fechaInicio >= fechaFin) throw new AppError("Fecha inicio mayor a fin", 400);
  if (fechaInicio < new Date()) throw new AppError("No se puede agendar en el pasado", 400);

  // 2. Validar que el profesional y paciente estén Activos (Opcional, recomendado)
  /* const profesional = await prisma.profesionales.findUnique({ where: { id: profesionalId } });
     if (profesional.estado !== 'Activo') throw new AppError("Profesional no activo", 400); */

  // 3. Validar CONTENCIÓN (Debe haber agenda abierta)
  const agendaDisponible = await prisma.agenda.findFirst({
    where: {
      profesionalId,
      unidadId,
      estado: 'Activo',
      inicio: { lte: fechaInicio },
      fin: { gte: fechaFin }
    }
  });

  if (!agendaDisponible) {
    throw new AppError("El médico no tiene agenda abierta en esta sede para este horario.", 409);
  }

  // 4. Validar SOLAPAMIENTO (No chocar con otra cita)
  const conflicto = await prisma.citas.findFirst({
    where: {
      profesionalId,
      estado: { notIn: ['Cancelada', 'Desactivado'] }, // Ignorar canceladas
      id: excluirCitaId ? { not: excluirCitaId } : undefined, // Para updates
      // Lógica de intersección de intervalos: (StartA < EndB) && (EndA > StartB)
      inicio: { lt: fechaFin },
      fin: { gt: fechaInicio }
    }
  });

  if (conflicto) {
    throw new AppError(`Horario ocupado. Conflicto con cita ID ${conflicto.id}`, 409);
  }
};

export const agendarCita = async (data) => {
  const profesionalId = Number(data.profesionalId);
  const unidadId = Number(data.unidadId);
  const personaId = Number(data.personaId);
  
  // Validaciones
  await validarDisponibilidad(profesionalId, unidadId, data.inicio, data.fin);

  // Creación
  return await prisma.citas.create({
    data: {
      personaId,
      profesionalId,
      unidadId,
      inicio: new Date(data.inicio),
      fin: new Date(data.fin),
      motivo: data.motivo,
      canal: data.canal || 'Presencial',
      estado: 'Agendada'
    }
  });
};

export const reprogramarCita = async (id, data) => {
  const citaActual = await prisma.citas.findUnique({ where: { id } });
  if (!citaActual) throw new AppError("Cita no encontrada", 404);

  // Si cambian las fechas, re-validamos disponibilidad
  if (data.inicio || data.fin) {
    const nuevoInicio = data.inicio ? new Date(data.inicio) : citaActual.inicio;
    const nuevoFin = data.fin ? new Date(data.fin) : citaActual.fin;
    
    // Validar excluyendo la cita actual (para que no choque consigo misma)
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