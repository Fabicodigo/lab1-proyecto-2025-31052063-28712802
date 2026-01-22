import AppError from '../utils/AppError.js';

export const validate = (schema) => {
  return (req, res, next) => {
    const { error, value } = schema.validate(req.body, { 
      abortEarly: false, 
      stripUnknown: true 
    });
    if (error) {
      const errorMessage = error.details.map((detail) => detail.message).join(', ');
      return next(new AppError(`Error de validación: ${errorMessage}`, 400));
    }

    req.body = value;
    next();
  };
};