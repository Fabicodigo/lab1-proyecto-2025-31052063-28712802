import { prisma } from '../prisma.js';
import AppError from '../utils/AppError.js';

/**
 * Verifica que un registro exista en la base de datos.
 * @param {string} modelo - Nombre del modelo en Prisma (ej: 'usuarios', 'personasatendidas')
 * @param {number} id - ID a buscar
 * @param {string} nombreEntidad - Nombre amigable para el error
 */
export const existeOThrow = async (modelo, id, nombreEntidad) => {
  if (!id) return; // Si es opcional y viene null, pasamos
  
  // @ts-ignore (Si usaras TS)
  const existe = await prisma[modelo].findUnique({
    where: { id: Number(id) }
  });

  if (!existe) {
    throw new AppError(`${nombreEntidad} con ID ${id} no existe.`, 404);
  }
};

// Validaciones compuestas comunes
export const validarRelacionesCita = async (personaId, profesionalId, unidadId) => {
    await Promise.all([
        existeOThrow('personasatendidas', personaId, 'Paciente'),
        existeOThrow('profesionales', profesionalId, 'Profesional'),
        existeOThrow('unidadesatencion', unidadId, 'Unidad de Atención')
    ]);
};