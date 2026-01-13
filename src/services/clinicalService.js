import { prisma } from '../prisma.js';
import AppError from '../utils/AppError.js';

export const crearEpisodio = async (data) => {
    // Validar si el paciente existe, etc.
    return await prisma.episodiosatencion.create({
        data: {
            personaId: Number(data.personaId),
            unidadId: Number(data.unidadId), // Asumiendo que agregaste este campo
            profesionalId: Number(data.profesionalId), // Y este
            motivo: data.motivo,
            tipo: data.tipo,
            fechaApertura: new Date(),
            estado: 'Abierto'
        }
    });
};

export const cerrarEpisodio = async (episodioId) => {
    // 1. Verificar órdenes pendientes
    const ordenesPendientes = await prisma.ordenes.count({
        where: {
            episodioId: episodioId,
            estado: { notIn: ['Finalizada', 'Cancelada'] }
        }
    });

    if (ordenesPendientes > 0) {
        throw new AppError(`No se puede cerrar: Hay ${ordenesPendientes} órdenes abiertas.`, 409);
    }

    return await prisma.episodiosatencion.update({
        where: { id: episodioId },
        data: { estado: 'Cerrado' }
    });
};

export const agregarDiagnostico = async (data) => {
    return await prisma.$transaction(async (tx) => {
        // Regla: Solo un diagnóstico principal
        if (data.principal) {
            await tx.diagnosticos.updateMany({
                where: { episodioId: data.episodioId, principal: true },
                data: { principal: false }
            });
        }
        return await tx.diagnosticos.create({ data });
    });
};