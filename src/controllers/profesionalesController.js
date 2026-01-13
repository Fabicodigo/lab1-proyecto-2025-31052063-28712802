import { prisma } from '../prisma.js';
import { mapEntity } from '../utils/responseMapper.js';
import parsePositiveInt from '../utils/ParsePositive.js';

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
    if (!data.usuarioId) {
        throw { statusCode: 400, message: "El usuarioId es obligatorio" };
    }
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
