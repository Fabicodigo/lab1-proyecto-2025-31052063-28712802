import Joi from 'joi';

// ==========================================
// 🛠️ UTILIDADES Y REUTILIZABLES
// ==========================================

const idSchema = Joi.number().integer().positive().required().messages({
  'number.base': 'El ID debe ser un número entero',
  'any.required': 'El ID es obligatorio'
});

const idOpcional = Joi.number().integer().positive().optional().allow(null);

const textoBasico = Joi.string().min(1).max(255).trim();
const textoLargo = Joi.string().allow('').optional();
const fecha = Joi.date().iso();
const moneda = Joi.number().precision(2).min(0);

// ==========================================
// 1. MÓDULO DE IDENTIDADES
// ==========================================

export const personaSchema = Joi.object({
  tipoDocumento: Joi.string().valid('CC', 'TI', 'CE', 'PASAPORTE', 'RC').required(),
  numeroDocumento: textoBasico.required(),
  nombres: textoBasico.required(),
  apellidos: textoBasico.required(),
  fechaNacimiento: fecha.less('now').required(),
  sexo: Joi.string().valid('M', 'F', 'Otro').optional(),
  correo: Joi.string().email().required(),
  telefono: Joi.string().pattern(/^[0-9+ -]{7,20}$/).required(),
  direccion: textoBasico.optional(),
  alergias: textoLargo,
  contactoEmergencia: textoBasico.optional(),
  estado: Joi.string().valid('Activo', 'Inactivo').default('Activo')
});

export const profesionalSchema = Joi.object({
  usuarioId: idSchema,
  nombres: textoBasico.required(),
  apellidos: textoBasico.required(),
  registroProfesional: textoBasico.required(),
  especialidad: textoBasico.required(),
  correo: Joi.string().email().required(),
  telefono: textoBasico.optional(),
  estado: Joi.string().valid('Activo', 'Inactivo').default('Activo')
});

export const unidadSchema = Joi.object({
  nombre: textoBasico.required(),
  tipo: textoBasico.optional(), // Consultorio, Hospital, etc.
  direccion: textoBasico.optional(),
  telefono: textoBasico.optional(),
  estado: Joi.string().default('Activo')
});

// ==========================================
// 2. CONFIGURACIÓN Y SEGUROS (Admin)
// ==========================================

export const aseguradoraSchema = Joi.object({
  nombre: textoBasico.required(),
  contacto: textoBasico.optional(),
  estado: Joi.string().default('Activo')
});

export const planCoberturaSchema = Joi.object({
  aseguradoraId: idSchema,
  nombre: textoBasico.required(),
  condicionesGenerales: textoLargo
});

export const afiliacionSchema = Joi.object({
  personaId: idSchema,
  planId: idSchema,
  aseguradoraId: idSchema,
  numeroPoliza: textoBasico.required(),
  vigenteDesde: fecha.required(),
  vigenteHasta: fecha.greater(Joi.ref('vigenteDesde')).required(),
  copago: moneda.default(0),
  cuotaModeradora: moneda.default(0)
});

export const arancelSchema = Joi.object({
  prestacionId: idSchema,
  planId: idSchema,
  valorBase: moneda.required(),
  impuestos: moneda.default(0),
  vigenteDesde: fecha.required(),
  vigenteHasta: fecha.greater(Joi.ref('vigenteDesde')).optional()
});

export const prestacionSchema = Joi.object({
  nombre: textoBasico.required(),
  grupo: textoBasico.optional(), // Consulta, Laboratorio, Imagenología
  requisitos: textoLargo,
  tiempoEstimado: Joi.number().integer().min(5).optional() // En minutos
});

// ==========================================
// 3. AGENDAMIENTO
// ==========================================

export const agendaSchema = Joi.object({
  profesionalId: idSchema,
  unidadId: idSchema,
  inicio: fecha.required(),
  fin: fecha.greater(Joi.ref('inicio')).required(),
  capacidad: Joi.number().integer().min(1).default(1),
  estado: Joi.string().default('Activo')
});

export const citaSchema = Joi.object({
  personaId: idSchema,
  profesionalId: idSchema,
  unidadId: idSchema,
  inicio: fecha.required(),
  fin: fecha.greater(Joi.ref('inicio')).required(),
  motivo: textoLargo,
  canal: Joi.string().valid('Presencial', 'Virtual').default('Presencial'),
  observaciones: textoLargo
});

// ==========================================
// 4. REGISTRO CLÍNICO
// ==========================================

export const episodioSchema = Joi.object({
  personaId: idSchema,
  profesionalId: idSchema,
  unidadId: idSchema,
  motivo: textoBasico.required(),
  tipo: Joi.string().valid('Consulta', 'Urgencia', 'Ambulatorio', 'Hospitalizacion').required(),
  estado: Joi.string().default('Abierto'),
  fechaApertura: fecha.default(() => new Date())
});

export const notaSchema = Joi.object({
  profesionalId: idSchema,
  episodioId: idSchema,
  subjetivo: textoLargo.required(), // S
  objetivo: textoLargo.required(),  // O
  analisis: textoLargo.required(),  // A
  plan: textoLargo.required()       // P
});

export const diagnosticoSchema = Joi.object({
  episodioId: idSchema,
  codigo: textoBasico.required(), // CIE-10
  descripcion: textoBasico.required(),
  tipo: Joi.string().valid('Principal', 'Relacionado', 'Descarte').default('Principal'),
  principal: Joi.boolean().default(false)
});

// ==========================================
// 5. ÓRDENES Y RESULTADOS
// ==========================================

const itemOrdenSchema = Joi.object({
  itemId: idSchema, // ID del catálogo de items (medicamento/examen)
  descripcion: textoBasico.optional(),
  indicaciones: textoLargo
});

export const ordenSchema = Joi.object({
  episodioId: idSchema,
  tipo: Joi.string().valid('Laboratorio', 'Imagen', 'Procedimiento', 'Interconsulta').required(),
  prioridad: Joi.string().valid('Alta', 'Media', 'Baja').default('Media'),
  estado: Joi.string().default('Solicitada'),
  items: Joi.array().items(itemOrdenSchema).min(1).required() // Orden debe tener items
});

export const resultadoSchema = Joi.object({
  ordenId: idSchema,
  archivoId: idOpcional, // Si suben un PDF/Imagen
  resumen: textoLargo.required(),
  fecha: fecha.default(() => new Date())
});

// ==========================================
// 6. PRESCRIPCIONES (RECETAS)
// ==========================================

const itemPrescripcionSchema = Joi.object({
  itemId: idSchema,
  dosis: textoBasico.required(),
  via: textoBasico.required(), // Oral, IV, IM
  frecuencia: textoBasico.required(), // Cada 8 horas
  duracion: textoBasico.required() // Por 5 días
});

export const prescripcionSchema = Joi.object({
  episodioId: idSchema,
  observaciones: textoLargo,
  items: Joi.array().items(itemPrescripcionSchema).min(1).required()
});

// ==========================================
// 7. FACTURACIÓN Y PAGOS
// ==========================================

const itemFacturaSchema = Joi.object({
  prestacionId: idSchema,
  descripcion: textoBasico.optional(),
  cantidad: Joi.number().integer().min(1).required(),
  valorUnitario: moneda.required(),
  impuestos: moneda.default(0)
});

export const facturaSchema = Joi.object({
  personaId: idSchema,
  aseguradoraId: idOpcional,
  numero: textoBasico.required(),
  fechaEmision: fecha.default(() => new Date()),
  moneda: Joi.string().default('USD'),
  items: Joi.array().items(itemFacturaSchema).min(1).required(),
  total: moneda.optional(), // Se calcula en backend, pero validamos formato si viene
  estado: Joi.string().valid('Borrador', 'Emitida', 'Anulada', 'Pagada').default('Emitida')
});

export const pagoSchema = Joi.object({
  facturaId: idSchema,
  monto: moneda.required(),
  medio: Joi.string().valid('Efectivo', 'Tarjeta', 'Transferencia', 'Seguro').required(),
  referencia: textoBasico.optional(), // Voucher #
  fecha: fecha.default(() => new Date()),
  estado: Joi.string().default('Completado')
});

// ==========================================
// 8. AUTORIZACIONES Y OTROS
// ==========================================

export const autorizacionSchema = Joi.object({
  ordenId: idSchema,
  codigoAutorizacion: textoBasico.required(),
  aseguradoraId: idSchema,
  fechaAprobacion: fecha.default(() => new Date()),
  observaciones: textoLargo
});

export const notificacionSchema = Joi.object({
  usuarioId: idOpcional,
  facturaId: idOpcional,
  tipo: Joi.string().valid('Email', 'SMS', 'Push').required(),
  destinatario: Joi.string().required(), // Email o teléfono
  plantilla: textoBasico.optional(),
  payload: textoLargo // JSON string o texto del mensaje
});