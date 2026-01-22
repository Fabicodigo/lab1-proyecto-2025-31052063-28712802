import { prisma } from '../prisma.js';
import { mapEntity } from '../utils/responseMapper.js';
import parsePositiveInt from '../utils/ParsePositive.js';

export const listarFacturas = async (req, res, next) => {
  try {
    const page = parsePositiveInt(req.query.page, 1);
    const pageSize = parsePositiveInt(req.query.pageSize, 20);
    const { estado, personaId, aseguradoraId } = req.query;

    const where = {};
    if (estado) where.estado = estado;
    if (personaId) where.personaId = Number(personaId);
    if (aseguradoraId) where.aseguradoraId = Number(aseguradoraId);

    const rawData = await prisma.facturas.findMany({
      where,
      skip: (page - 1) * pageSize,
      take: pageSize,
    
      include: { facturaItem: true }, 
      orderBy: { fechaEmision: 'desc' }
    });

    const data = rawData.map(d => mapEntity(d));
    res.json({ page, pageSize, data });
  } catch (error) {
    next(error);
  }
};

export const crearFactura = async (req, res, next) => {
  try {
    const { 
      numero, personaId, aseguradoraId, moneda, items, estado, total 
    } = req.body;

  
    const listaItems = Array.isArray(items) ? items : [];

    let subtotalAcumulado = 0;
    let totalAcumulado = 0;

    const itemsProcesados = listaItems.map(item => {
      const cantidad = Number(item.cantidad) || 1;
      const valorUnitario = Number(item.valorUnitario) || 0;
      const impuestos = Number(item.impuestos) || 0;
      const totalItem = (valorUnitario * cantidad) + impuestos;

      subtotalAcumulado += (valorUnitario * cantidad);
      totalAcumulado += totalItem;

      return {
     
        prestacionId: item.prestacionId ? Number(item.prestacionId) : null, 
        descripcion: item.descripcion,
        cantidad: cantidad,
        valorUnitario: valorUnitario,
        impuestos: impuestos,
        total: totalItem
      };
    });

  
    if (itemsProcesados.length === 0 && total) {
        totalAcumulado = Number(total);
        subtotalAcumulado = Number(total); 
    }

    const created = await prisma.facturas.create({
      data: {
        numero,
        fechaEmision: new Date(),
        personaId: personaId ? Number(personaId) : null,
        aseguradoraId: aseguradoraId ? Number(aseguradoraId) : null,
        moneda: moneda || 'USD',
        subtotal: subtotalAcumulado,
        total: totalAcumulado,
        estado: estado || 'emitida',
      
        facturaitem: {
          create: itemsProcesados
        }
      },
    
      include: { facturaitem: true } 
    });

    res.status(201).json(mapEntity(created));
  } catch (error) {
    console.error('Error creando factura:', error);
    next(error);
  }
};

export const facturaPorId = async (req, res, next) => {
  try {
    const id = Number(req.params.id);
    const factura = await prisma.facturas.findUnique({
      where: { id },
   
      include: { facturaitem: true } 
    });

    if (!factura) {
      const error = new Error('Factura no encontrada');
      error.statusCode = 404;
      throw error;
    }

    res.json(mapEntity(factura));
  } catch (err) {
    next(err);
  }
};

export const actualizarEstadoFactura = async (req, res, next) => {
  try {
    const id = Number(req.params.id);
    const { estado } = req.body;

    const actualizado = await prisma.facturas.update({
      where: { id },
      data: { estado }
    });

    res.json(mapEntity(actualizado));
  } catch (err) {
    next(err);
  }
};

export const anularFactura = async (req, res, next) => {
  try {
    const id = Number(req.params.id);

    const anulada = await prisma.facturas.update({
      where: { id },
      data: { estado: 'anulada' }
    });
    res.json(mapEntity(anulada));
  } catch (err) {
    next(err);
  }
};