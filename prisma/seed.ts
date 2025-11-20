import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('Iniciando el seeder...');

  // 1.1 Roles
  const rolAdmin = await prisma.roles.create({
    data: { nombre: 'Administrador', descripcion: 'Acceso total al sistema' }
  });
  const rolMedico = await prisma.roles.create({
    data: { nombre: 'Medico', descripcion: 'Personal de salud' }
  });

  // 1.2 Permisos
  const permisoLectura = await prisma.permisos.create({
    data: { clave: 'READ_ALL', descripcion: 'Puede leer registros' }
  });
  const permisoEscritura = await prisma.permisos.create({
    data: { clave: 'WRITE_ALL', descripcion: 'Puede crear/editar registros' }
  });

  // 1.3 Items (Insumos/Medicamentos)
  const itemJeringa = await prisma.items.create({
    data: { nombre: 'Jeringa 5ml', descripcion: 'Insumo descartable' }
  });
  const itemParacetamol = await prisma.items.create({
    data: { nombre: 'Paracetamol 500mg', descripcion: 'Medicamento analgésico' }
  });

  // 1.4 Prestaciones (Servicios Médicos)
  const prestacionConsulta = await prisma.prestaciones.create({
    data: { nombre: 'Consulta General', grupo: 'Consulta', tiempoEstimado: 20, requisitos: 'Ninguno' }
  });
  const prestacionHemograma = await prisma.prestaciones.create({
    data: { nombre: 'Hemograma Completo', grupo: 'Laboratorio', tiempoEstimado: 10, requisitos: 'Ayuno 8hrs' }
  });

  // 1.5 Unidades de Atención
  const unidadCentro = await prisma.unidadesatencion.create({
    data: { 
      nombre: 'Sede Central', 
      tipo: 'Clinica', 
      direccion: 'Av. Principal 123', 
      estado: 'Activo',
      metodo: 'Presencial'
    }
  });
  const unidadNorte = await prisma.unidadesatencion.create({
    data: { 
      nombre: 'Sede Norte', 
      tipo: 'Consultorio', 
      direccion: 'Calle Norte 45', 
      estado: 'Activo',
      metodo: 'Telemedicina'
    }
  });

  // 1.6 Archivos
  const archivoConsentimiento = await prisma.archivo.create({
    data: { fecha: new Date(), tipo: 'PDF', requisitos: 'Firma digital' }
  });
  const archivoResultado = await prisma.archivo.create({
    data: { fecha: new Date(), tipo: 'PDF', requisitos: 'Validación lab' }
  });

  // 1.7 Aseguradoras
  const seguroSaludTotal = await prisma.aseguradoras.create({
    data: { nombre: 'Salud Total S.A.', contacto: 'contacto@saludtotal.com', estado: 'Activo' }
  });
  const seguroVidaSana = await prisma.aseguradoras.create({
    data: { nombre: 'Vida Sana Seguros', contacto: 'soporte@vidasana.com', estado: 'Activo' }
  });


  // 2.1 Usuarios
  const usuarioAdmin = await prisma.usuarios.create({
    data: {
      username: 'admin_sys',
      email: 'admin@clinica.com',
      passwordHash: 'hash_secreto_123',
      estado: 'Activo',
      fechaCreacion: new Date()
    }
  });
  const usuarioDrHouse = await prisma.usuarios.create({
    data: {
      username: 'dr_house',
      email: 'house@clinica.com',
      passwordHash: 'hash_secreto_456',
      estado: 'Activo',
      fechaCreacion: new Date()
    }
  });

  // 2.2 Relación Usuario-Rol
  await prisma.usuariorol.create({ data: { usuarioId: usuarioAdmin.id, rolId: rolAdmin.id } });
  await prisma.usuariorol.create({ data: { usuarioId: usuarioDrHouse.id, rolId: rolMedico.id } });

  // 2.3 Profesionales (Vinculado a Usuario)
  const profesionalHouse = await prisma.profesionales.create({
    data: {
      usuarioId: usuarioDrHouse.id,
      nombres: 'Gregory',
      apellidos: 'House',
      registroProfesional: 'MED-99999',
      especialidad: 'Diagnóstico',
      correo: 'house@clinica.com',
      estado: 'Activo'
    }
  });
  
  // Profesional con usuario
  const usuarioDraGrey = await prisma.usuarios.create({
    data: { username: 'dra_grey', email: 'grey@clinica.com', passwordHash: '123', estado: 'Activo' }
  });
  const profesionalGrey = await prisma.profesionales.create({
    data: {
      usuarioId: usuarioDraGrey.id,
      nombres: 'Meredith',
      apellidos: 'Grey',
      registroProfesional: 'MED-55555',
      especialidad: 'Cirugía',
      correo: 'grey@clinica.com',
      estado: 'Activo'
    }
  });

  // 2.4 Relación Profesional-Unidad
  await prisma.profesionalunidad.create({
    data: {
      unidadId: unidadCentro.id,
      profesionalId: profesionalHouse.id,
      nombre: 'Consultorio A',
      condicionesGenerales: 'Turno Mañana'
    }
  });

  // 3.1 Planes de Cobertura
  const planGold = await prisma.planescobertura.create({
    data: {
      aseguradoraId: seguroSaludTotal.id,
      nombre: 'Plan Gold',
      condicionesGenerales: 'Cubre 100% consultas'
    }
  });
  const planSilver = await prisma.planescobertura.create({
    data: {
      aseguradoraId: seguroVidaSana.id,
      nombre: 'Plan Silver',
      condicionesGenerales: 'Copago del 10%'
    }
  });

  // 3.2 Aranceles (Precios)
  await prisma.arancel.create({
    data: {
      prestacionId: prestacionConsulta.id,
      planId: planGold.id,
      valorBase: 50.00,
      impuestos: 10.50,
      vigenteDesde: new Date()
    }
  });

  // 4.1 Personas Atendidas
  const pacienteJuan = await prisma.personasatendidas.create({
    data: {
      nombres: 'Juan',
      apellidos: 'Perez',
      tipoDocumento: 'DNI',
      numeroDocumento: '12345678',
      fechaNacimiento: new Date('1990-01-01'),
      sexo: 'M',
      correo: 'juan@mail.com',
      estado: 'Activo'
    }
  });
  const pacienteMaria = await prisma.personasatendidas.create({
    data: {
      nombres: 'Maria',
      apellidos: 'Gomez',
      tipoDocumento: 'DNI',
      numeroDocumento: '87654321',
      fechaNacimiento: new Date('1995-05-15'),
      sexo: 'F',
      correo: 'maria@mail.com',
      estado: 'Activo'
    }
  });

  // 4.2 Afiliaciones
  await prisma.afiliaciones.create({
    data: {
      numeroPoliza: 'POL-001',
      vigenteDesde: new Date(),
      
      personasatendidas: {
        connect: { id: pacienteJuan.id }
      },
      planescobertura: {
        connect: { id: planGold.id }
      },
      aseguradoras: {
        connect: { id: seguroSaludTotal.id }
      }
    }
  });

  // 5.1 Agenda
  await prisma.agenda.create({
    data: {
      profesionalId: profesionalHouse.id,
      unidadId: unidadCentro.id,
      inicio: new Date('2023-12-01T08:00:00Z'),
      fin: new Date('2023-12-01T12:00:00Z'),
      capacidad: 10,
      estado: 'Disponible'
    }
  });

  // 5.2 Citas
  await prisma.citas.create({
    data: {
      personaId: pacienteJuan.id,
      profesionalId: profesionalHouse.id,
      unidadId: unidadCentro.id,
      inicio: new Date('2023-12-01T09:00:00Z'),
      fin: new Date('2023-12-01T09:30:00Z'),
      motivo: 'Dolor de cabeza',
      estado: 'Programada'
    }
  });

  // 5.3 Episodio de Atención (El encuentro médico)
  const episodioJuan = await prisma.episodiosatencion.create({
    data: {
      personaId: pacienteJuan.id,
      fechaApertura: new Date(),
      motivo: 'Cefalea intensa',
      tipo: 'Ambulatorio',
      estado: 'En Progreso'
    }
  });

  // 5.4 Notas Clínicas
  await prisma.notasclinicas.create({
    data: {
      episodioId: episodioJuan.id,
      profesionalId: profesionalHouse.id,
      fecha: new Date(),
      subjetivo: 'Paciente refiere dolor 8/10',
      objetivo: 'Presión arterial normal',
      analisis: 'Posible migraña',
      plan: 'Reposo y medicación'
    }
  });

  // 5.5 Diagnósticos
  await prisma.diagnosticos.create({
    data: {
      episodioId: episodioJuan.id,
      codigo: 'CIE-001',
      descripcion: 'Migraña',
      tipo: 'Principal',
      principal: true
    }
  });

  // 5.6 Ordenes (Exámenes)
  const ordenLab = await prisma.ordenes.create({
    data: {
      episodioId: episodioJuan.id,
      tipo: 'Laboratorio',
      prioridad: 'Media',
      estado: 'Solicitada'
    }
  });
  // Items de la orden
  await prisma.ordenitems.create({
    data: {
      ordenId: ordenLab.id,
      itemId: itemJeringa.id, 
      descripcion: 'Extracción de sangre'
    }
  });

  // 5.7 Prescripciones (Recetas)
  const recetaJuan = await prisma.prescripciones.create({
    data: {
      episodioId: episodioJuan.id,
      observaciones: 'Tomar con alimentos'
    }
  });
  await prisma.itemsprescripcion.create({
    data: {
      prescripcionId: recetaJuan.id,
      itemId: itemParacetamol.id,
      dosis: '500mg',
      frecuencia: 'Cada 8 horas',
      duracion: '3 días'
    }
  });

  // 6.1 Factura
  const facturaJuan = await prisma.facturas.create({
    data: {
      personaId: pacienteJuan.id,
      aseguradoraId: seguroSaludTotal.id,
      numero: 'FAC-0001',
      fechaEmision: new Date(),
      subtotal: 50.00,
      impuestos: 10.50,
      total: 60.50,
      estado: 'Emitida',
      moneda: 'USD'
    }
  });

  // 6.2 Items de Factura
  await prisma.facturaitem.create({
    data: {
      facturaId: facturaJuan.id,
      prestacionId: prestacionConsulta.id,
      cantidad: 1,
      valorUnitario: 50.00,
      total: 50.00,
      descripcion: 'Consulta General'
    }
  });

  // 6.3 Pagos
  await prisma.pagos.create({
    data: {
      facturaId: facturaJuan.id,
      fecha: new Date(),
      monto: 60.50,
      medio: 'Tarjeta Credito',
      estado: 'Aprobado'
    }
  });

  console.log('Seeding completado exitosamente.');
}

main()
  .catch((e) => {
    console.error('Error durante el seeding:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });