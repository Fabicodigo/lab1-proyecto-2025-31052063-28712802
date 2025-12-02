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

export const listarProfesionales = async (req, res, next) => {
  try {
    const page = parsePositiveInt(req.query.page, 1);
    const pageSize = parsePositiveInt(req.query.pageSize, 20);

    const rows = await prisma.profesionales.findMany({
            skip: (page - 1) * pageSize,
            take: pageSize,
            orderBy: [{ apellidos: 'asc' }, { nombres: 'asc' }]
    });
    const items = rows.map(row => mapEntity(row));
    return res.json({ total: rows.length, page, pageSize, items });

  } catch (err) {
    console.error('listarProfesionales error', err);
    return next(err);
  }
};

export const crearProfesional = async (req, res, next) => {
  try {
    const data = req.body;
    const created = await prisma.profesionales.create({
      data: {
        usuarioId: Number(data.usuarioId),
        nombres: data.nombres,
        apellidos: data.apellidos,
        registroProfesional: data.registroProfesional,
        correo: data.correo,
        telefono: data.telefono,
        especialidad: data.especialidad,
        estado: data.estado
      }
    });
    res.status(201).json(created);
  } catch (err) {
    return next(err);
  }
};

export const actualizarProfesional = async (req, res, next) => {
  const id = Number(req.params.id);
  const data = req.body;
  try {
    const actualizar = {};
    
    if (data.usuarioId) actualizar.usuarioId = Number(data.usuarioId);
    if (data.nombres) actualizar.nombres = data.nombres;
    if (data.apellidos) actualizar.apellidos = data.apellidos;
    if (data.registroProfesional) actualizar.registroProfesional = data.registroProfesional;
    if (data.correo) actualizar.correo = data.correo;
    if (data.telefono) actualizar.telefono = data.telefono;
    if (data.especialidad) actualizar.especialidad = data.especialidad;
    if (data.estado) actualizar.estado = data.estado;

    const actualizado = await prisma.profesionales.update({ where: { id }, data: actualizar });
    return res.json(actualizado);
  } catch (err) {
    return next(err);
  }
};

export const desactivarProfesional = async (req, res, next) => {
  try {
    const id = Number(req.params.id);
    await prisma.profesionales.update({ where: { id }, data: { estado: 'Desactivado' } });
    return res.status(204).send();
  } catch (err) {
    console.error('desactivarProfesional error', err);
    return next(err);
  }
};

export const listarUnidades = async (req, res, next) => {
  try {
    const page = parsePositiveInt(req.query.page, 1);
    const pageSize = parsePositiveInt(req.query.pageSize, 20);

    const rows = await prisma.unidadesatencion.findMany({
        skip: (page - 1) * pageSize,
        take: pageSize,
        orderBy: { nombre: 'asc' }
    });

    const items = rows.map(row => mapEntity(row));
    return res.json({ total: rows.length, page, pageSize, items });

  } catch (err) {
    console.error('listarUnidades error', err);
    return next(err);
  }
};
export const crearUnidad = async (req, res, next) => {
  try {
    const data = req.body;
    const created = await prisma.unidadesatencion.create({
      data: {
        nombre: data.nombre,
        direccion: data.direccion,
        telefono: data.telefono,
        correo: data.correo,
        estado: data.estado
      }
    });
    res.status(201).json(created);
  } catch (err) {
    console.error('crearUnidad error', err);
    return next(err);
  }
};

export const actualizarUnidad = async (req, res, next) => {
  const id = Number(req.params.id);
  const data = req.body;
  try {
    const actualizar = {};
    
    if (data.nombre) actualizar.nombre = data.nombre;
    if (data.direccion) actualizar.direccion = data.direccion;
    if (data.telefono) actualizar.telefono = data.telefono;
    if (data.correo) actualizar.correo = data.correo;
    if (data.estado) actualizar.estado = data.estado;

    const actualizado = await prisma.unidadesatencion.update({ where: { id }, data: actualizar });
    return res.json(actualizado);
  } catch (err) {
    return next(err);
  }
};

export const desactivarUnidad = async (req, res, next) => {
  try {
    const id = Number(req.params.id);
    await prisma.unidadesatencion.update({ where: { id }, data: { estado: 'Desactivado' } });
    return res.status(204).send();
  } catch (err) {
    console.error('desactivarUnidad error', err);
    return next(err);
  }
};