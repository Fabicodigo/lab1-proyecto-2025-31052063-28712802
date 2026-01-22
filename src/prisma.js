import { PrismaClient } from '@prisma/client';

const prismaOriginal = new PrismaClient();

// Función auxiliar para manejar la lógica de auditoría
const auditMiddleware = async (modelName, historyModel, fkField, args, query) => {
  const { _usuarioId, _motivo, ...realData } = args.data || {};

  // 1. Validación de Auditoría: Si intentan actualizar sin decir QUIÉN, bloqueamos.
  // Esto cumple tu regla "sea como sea", obligando al desarrollador a pasar el usuario.
  if (!_usuarioId && Object.keys(realData).length > 0) {
     throw new Error(`AUDITORÍA OBLIGATORIA: No se puede actualizar ${modelName} sin pasar '_usuarioId'.`);
  }

  // Si no hay datos reales para cambiar, pasamos (evitar overhead)
  if (Object.keys(realData).length === 0) return query(args);

  // 2. Tomar la "Foto" (Snapshot) del estado actual ANTES del cambio
  // Usamos prismaOriginal para evitar bucles infinitos
  const currentData = await prismaOriginal[modelName].findUnique({
    where: args.where
  });

  if (currentData) {
    // 3. Guardar en el Historial
    await prismaOriginal[historyModel].create({
      data: {
        [fkField]: currentData.id,
        version: currentData.version,
        usuarioId: Number(_usuarioId),
        motivoCambio: _motivo || 'Actualización automática del sistema',
        fechaModificacion: new Date(),
        // Guardamos todo el objeto viejo como JSON
        contenidoAnterior: currentData 
      }
    });
  }

  // 4. Inyectar el incremento de versión y limpiar los campos "fake" (_usuarioId)
  args.data = {
    ...realData,
    version: { increment: 1 }
  };

  // 5. Ejecutar la actualización real
  return query(args);
};

// Exportamos el cliente EXTENDIDO
export const prisma = prismaOriginal.$extends({
  query: {
    notasclinicas: {
      async update({ model, operation, args, query }) {
        return auditMiddleware('notasclinicas', 'notasHistorial', 'notaId', args, query);
      }
    },
    resultados: {
      async update({ model, operation, args, query }) {
        return auditMiddleware('resultados', 'resultadosHistorial', 'resultadoId', args, query);
      }
    }
  }
});