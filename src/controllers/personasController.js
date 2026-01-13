import { prisma } from '../prisma.js';
import { mapEntity } from '../utils/responseMapper.js';
import parsePositiveInt from '../utils/ParsePositive.js';

export const listarPersonas = async (req, res, next) => {
  try {
    const page = parsePositiveInt(req.query.page, 1);
    const pageSize = parsePositiveInt(req.query.pageSize, 20);

    const rawData = await prisma.personasatendidas.findMany();
    
    const data = rawData.map(p => mapEntity(p, {
      dateFields: ['fechaNacimiento'],
      listFields: ['alergias']
    }));

    res.json({ page, pageSize, data });
  } catch (error) {
    next(error);
  }
};

export const crearPersona = async (req, res, next) => {
  try {
    const data = req.body;
    const created = await prisma.personasatendidas.create({
      data: {
        tipoDocumento: data.tipoDocumento,
        numeroDocumento: data.numeroDocumento,
        nombres: data.nombres,
        apellidos: data.apellidos,
        fechaNacimiento: data.fechaNacimiento ? new Date(data.fechaNacimiento) : null,
        sexo: data.sexo,
        correo: data.correo,
        telefono: data.telefono,
        contactoEmergencia: data.contactoEmergencia,
        direccion: data.direccion,
        alergias: Array.isArray(data.alergias) ? data.alergias.join(", ") : data.alergias,
        estado: data.estado
      }
    });
    res.json(created);
  } catch (error) {
    console.error('createPersona error', error);
    next(error);
  }
};

export const PersonaporId = async (req, res, next) => {
  try {
    const id = Number(req.params.id);
    const item = await prisma.personasatendidas.findUnique({ where: { id } });
    if (!item){
      const error = new Error("Persona no encontrada");
      error.statusCode = 404;
      throw error;
    }
    return res.json(mapEntity(item, { dateFields: ['fechaNacimiento'], listFields: ['alergias'] }));
  } catch (err) {
    console.error('getPersona error', err);
    return next(err);
  }
};

export const actualizarPersona = async (req, res, next) => {
  const id = Number(req.params.id);
  const data = req.body;

  try {
    if (data.estado === "Desactivado") {
      const error = new Error("No está permitido cambiar el estado a 'Desactivado' por PATCH. Use DELETE.");
      error.statusCode = 400;
      throw error;
    }

    const actualizar = {};

    if (data.tipoDocumento) actualizar.tipoDocumento = data.tipoDocumento;
    if (data.numeroDocumento) actualizar.numeroDocumento = data.numeroDocumento;
    if (data.nombres) actualizar.nombres = data.nombres;
    if (data.apellidos) actualizar.apellidos = data.apellidos;
    if (data.sexo) actualizar.sexo = data.sexo;
    if (data.correo) actualizar.correo = data.correo;
    if (data.telefono) actualizar.telefono = data.telefono;
    if (data.contactoEmergencia) actualizar.contactoEmergencia = data.contactoEmergencia;
    if (data.direccion) actualizar.direccion = data.direccion;
    if (data.estado) actualizar.estado = data.estado;
    if (data.fechaNacimiento) {
      actualizar.fechaNacimiento = new Date(data.fechaNacimiento);
    }
    if (data.alergias) {
      actualizar.alergias = Array.isArray(data.alergias) 
        ? data.alergias.join(", ") 
        : data.alergias;
    }

    const actualizado = await prisma.personasatendidas.update({ where: { id }, data: actualizar });
    return res.json(actualizado);
  } catch (error) {
    console.error('updatePersona error', error);
   next(error);
  }
};

export const desactivarPersona = async (req, res, next) => {
  try {
    const id = Number(req.params.id);
    await prisma.personasatendidas.update({ where: { id }, data: { estado: 'Desactivado' } });
    return res.status(204).send();
  } catch (err) {
    console.error('desactivarPersona error', err);
    return next(err);
  }
};