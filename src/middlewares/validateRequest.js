import AppError from '../utils/AppError.js';

export const validate = (schema) => {
  return (req, res, next) => {
    // abortEarly: false permite ver TODOS los errores del formulario, no solo el primero
    const { error, value } = schema.validate(req.body, { 
      abortEarly: false, 
      stripUnknown: true // ¡IMPORTANTE! Elimina campos que no estén en el esquema (evita "Unknown argument")
    });

    if (error) {
      const errorMessage = error.details.map((detail) => detail.message).join(', ');
      // Lanzamos un 400 Bad Request
      return next(new AppError(`Error de validación: ${errorMessage}`, 400));
    }

    // Reemplazamos req.body con los datos "limpios" y tipados
    req.body = value;
    next();
  };
};