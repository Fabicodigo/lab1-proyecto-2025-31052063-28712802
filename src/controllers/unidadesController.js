import { prisma } from '../prisma.js';
import { mapEntity } from '../utils/responseMapper.js';
import parsePositiveInt from '../utils/ParsePositive.js';

export const listarUnidades = async (req, res, next) => {
  try {
    const page = parsePositiveInt(req.query.page, 1);
    const pageSize = parsePositiveInt(req.query.pageSize, 20);

    const rows = await prisma.unidadesAtencion.findMany({
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
    const created = await prisma.unidadesAtencion.create({
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

    const actualizado = await prisma.unidadesAtencion.update({ where: { id }, data: actualizar });
    return res.json(actualizado);
  } catch (err) {
    return next(err);
  }
};

export const desactivarUnidad = async (req, res, next) => {
  try {
    const id = Number(req.params.id);
    await prisma.unidadesAtencion.update({ where: { id }, data: { estado: 'Desactivado' } });
    return res.status(204).send();
  } catch (err) {
    console.error('desactivarUnidad error', err);
    return next(err);
  }
};