const errorHandler = (err, req, res, next) => {
    console.error(err.stack);

    if (res.headersSent) {
        return next(err);
    }
        // P2002: Violación de restricción única
    if (err.code === 'P2002') {
        const target = err.meta?.target ? `en el campo: ${err.meta.target}` : '';
        return res.status(409).json({
            status: 'fail',
            message: `El valor ingresado ya existe ${target}.`,
            code: err.code
        });
    }
    // P2025: Registro no encontrado
    if (err.code === 'P2025') {
        return res.status(404).json({
            status: 'fail',
            message: 'No se encontró el registro solicitado para realizar la operación.',
            code: err.code
        });
    }

    // P2003: Error de llave foránea
    if (err.code === 'P2003') {
        return res.status(400).json({
            status: 'fail',
            message: 'Estás intentando referenciar un registro que no existe (Error de relación).',
            code: err.code
        });
    }

    // P2001: Registro no encontrado (variante)
    if (err.code === 'P2001') {
        return res.status(404).json({
            status: 'fail',
            message: 'El registro buscado no existe.',
            code: err.code
        });
    }
    // PrismaClientValidationError: Error de formato/tipado en el request
    if (err.constructor.name === 'PrismaClientValidationError') {
        return res.status(400).json({
            status: 'fail',
            message: 'Error en el formato de los datos enviados.',
            details: process.env.NODE_ENV === 'production' ? null : err.message
        });
    }

    // 2. Errores Operacionales Personalizados (Lógica de negocio)
    // ----------------------------------------------------
    // Si tú lanzaste el error manualmente con un status (ej. el bloqueo de "Desactivado")
    if (err.statusCode) {
        return res.status(err.statusCode).json({
            status: err.status || 'error',
            message: err.message
        });
    }
    return res.status(500).json({
        status: 'error',
        message: 'Ocurrió un error interno en el servidor.',
        error: process.env.NODE_ENV === 'production' ? {} : err.stack,
    });
};

export default errorHandler;
