import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Iniciando el seeder...');

  // --- VARIABLES DE TIEMPO DINÁMICAS ---
  const hoy = new Date();
  
  // Mañana a las 08:00 AM (Inicio Bloque Abierto)
  const mananaInicio = new Date(hoy); mananaInicio.setDate(hoy.getDate() + 1); mananaInicio.setHours(8, 0, 0, 0);
  
  // Mañana a las 12:00 PM (Fin Bloque Abierto)
  const mananaFin = new Date(hoy); mananaFin.setDate(hoy.getDate() + 1); mananaFin.setHours(12, 0, 0, 0);
  
  // Mañana a las 02:00 PM (Inicio Bloque Cerrado)
  const mananaTardeInicio = new Date(hoy); mananaTardeInicio.setDate(hoy.getDate() + 1); mananaTardeInicio.setHours(14, 0, 0, 0);
  
  // Mañana a las 06:00 PM (Fin Bloque Cerrado)
  const mananaTardeFin = new Date(hoy); mananaTardeFin.setDate(hoy.getDate() + 1); mananaTardeFin.setHours(18, 0, 0, 0);

  // Fecha para la Cita (Dentro del bloque abierto: 09:00 - 09:30)
  const citaInicio = new Date(mananaInicio); citaInicio.setHours(9, 0, 0, 0);
  const citaFin = new Date(mananaInicio); citaFin.setHours(9, 30, 0, 0);


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
    data: { nombre: 'Hemograma Completo', grupo: 'Laboratorio', tiempoEstimado: 15, requisitos: 'Ayuno 8h' }
  });

  // 2.1 Usuarios Base
  const usuarioAdmin = await prisma.usuarios.create({
    data: {
      username: 'admin',
      email: 'admin@hospital.com',
      passwordHash: 'hashed_password_123', // En prod usar bcrypt
      estado: 'Activo',
      fechaCreacion: new Date()
    }
  });

  const usuarioMedico = await prisma.usuarios.create({
    data: {
      username: 'drhouse',
      email: 'house@hospital.com',
      passwordHash: 'hashed_password_123',
      estado: 'Activo',
      fechaCreacion: new Date()
    }
  });

  // 2.2 Profesionales y Unidades
  const profesionalJuan = await prisma.profesionales.create({
    data: {
      usuarioId: usuarioMedico.id,
      nombres: 'Gregory',
      apellidos: 'House',
      registroProfesional: 'RM-123456',
      especialidad: 'Diagnóstico',
      correo: 'house@hospital.com',
      telefono: '555-0199',
      estado: 'Activo'
    }
  });

  const unidadCentral = await prisma.unidadesAtencion.create({
    data: {
      nombre: 'Unidad Central de Diagnóstico',
      tipo: 'Consultorio',
      direccion: 'Av. Principal 123',
      telefono: '555-9000',
      estado: 'Activo'
    }
  });

  // Relación Profesional-Unidad
  await prisma.profesionalUnidad.create({
    data: {
      unidadId: unidadCentral.id,
      profesionalId: profesionalJuan.id,
      nombre: 'Turno Mañana',
      condicionesGenerales: 'Lunes a Viernes'
    }
  });

  // 3.1 Paciente
  const pacienteJuan = await prisma.personasAtendidas.create({
    data: {
      tipoDocumento: 'CC',
      numeroDocumento: '123456789',
      nombres: 'Juan',
      apellidos: 'Pérez',
      fechaNacimiento: new Date('1985-06-15'),
      sexo: 'Masculino',
      correo: 'juan.perez@email.com',
      telefono: '300-1234567',
      direccion: 'Calle 10 # 5-20',
      estado: 'Activo'
    }
  });

  // 3.2 Aseguradora y Plan
  const seguroSaludTotal = await prisma.aseguradoras.create({
    data: { nombre: 'Salud Total S.A.', contacto: 'contacto@saludtotal.com', estado: 'Activo' }
  });
  
  const planBasico = await prisma.planesCobertura.create({
    data: { 
      aseguradoraId: seguroSaludTotal.id, 
      nombre: 'Plan Básico', 
      condicionesGenerales: 'Cobertura 80% en consultas' 
    }
  });

  await prisma.afiliaciones.create({
    data: {
      personaId: pacienteJuan.id,
      planId: planBasico.id,
      aseguradoraId: seguroSaludTotal.id,
      numeroPoliza: 'POL-998877',
      vigenteDesde: new Date('2025-01-01'),
      vigenteHasta: new Date('2025-12-31'),
      copago: 10.00,
      cuotaModeradora: 5.00
    }
  });

  // --- 3.3 AGENDAS (NUEVO: Bloques Abiertos y Cerrados) ---
  
  // Bloque 1: Mañana (ABIERTO para citas)
  await prisma.agenda.create({
    data: {
      profesionalId: profesionalJuan.id,
      unidadId: unidadCentral.id,
      inicio: mananaInicio,
      fin: mananaFin,
      capacidad: 8, // 8 turnos de 30min
      estado: 'Abierto'
    }
  });

  // Bloque 2: Tarde (CERRADO - Prueba de validación)
  await prisma.agenda.create({
    data: {
      profesionalId: profesionalJuan.id,
      unidadId: unidadCentral.id,
      inicio: mananaTardeInicio,
      fin: mananaTardeFin,
      capacidad: 0, 
      estado: 'Cerrado' // No debería permitir citas aquí
    }
  });

  // --- 4.1 CITAS (NUEVO: Cita válida en bloque abierto) ---
  const citaJuan = await prisma.citas.create({
    data: {
      personaId: pacienteJuan.id,
      profesionalId: profesionalJuan.id,
      unidadId: unidadCentral.id,
      inicio: citaInicio, // 09:00 AM
      fin: citaFin,       // 09:30 AM
      motivo: 'Dolor de cabeza constante',
      estado: 'Solicitada',
      canal: 'Presencial'
    }
  });

  // 5.1 Registro Clínico (Episodio)
  const episodioJuan = await prisma.episodiosAtencion.create({
    data: {
      personaId: pacienteJuan.id,
      profesionalId: profesionalJuan.id,
      unidadId: unidadCentral.id,
      fechaApertura: citaInicio, // Se abre con la cita
      motivo: 'Cefalea tensional',
      tipo: 'Consulta',
      estado: 'Abierto'
    }
  });

  // 5.2 Nota Clínica
  await prisma.notasClinicas.create({
    data: {
      episodioId: episodioJuan.id,
      profesionalId: profesionalJuan.id,
      fecha: new Date(),
      subjetivo: 'Paciente refiere dolor 7/10',
      objetivo: 'TA 120/80, sin signos neurológicos focales',
      analisis: 'Cefalea probablemente tensional por estrés',
      plan: 'Paracetamol 500mg y descanso'
    }
  });

  // 5.3 Diagnóstico
  await prisma.diagnosticos.create({
    data: {
      episodioId: episodioJuan.id,
      codigo: 'G44.2',
      descripcion: 'Cefalea tensional',
      tipo: 'Definitivo',
      principal: true
    }
  });

  // 5.4 Orden Médica
  const ordenLab = await prisma.ordenes.create({
    data: {
      episodioId: episodioJuan.id,
      tipo: 'Laboratorio',
      prioridad: 'Normal',
      estado: 'Solicitada'
    }
  });
  
  await prisma.ordenItems.create({
    data: {
      ordenId: ordenLab.id,
      itemId: 1, // Referencia simbólica, idealmente buscar ID de item
      descripcion: 'Hemograma',
      indicaciones: 'Ayuno'
    }
  });

  // 5.6 Resultado
  await prisma.resultados.create({
    data: {
      ordenId: ordenLab.id,
      fecha: new Date(),
      resumen: 'Valores normales. Hemoglobina 14 g/dL.'
    }
  });

  // 5.7 Prescripciones (Recetas)
  const recetaJuan = await prisma.prescripciones.create({
    data: {
      episodioId: episodioJuan.id,
      observaciones: 'Tomar con alimentos'
    }
  });
  
  await prisma.itemsPrescripcion.create({
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
      numero: `FAC-${Math.floor(Math.random() * 10000)}`,
      fechaEmision: new Date(),
      subtotal: 50.00,
      impuestos: 10.50,
      total: 60.50,
      estado: 'Emitida',
      moneda: 'USD'
    }
  });

  // 6.2 Items de Factura
  await prisma.facturaItem.create({
    data: {
      facturaId: facturaJuan.id,
      prestacionId: prestacionConsulta.id,
      cantidad: 1,
      valorUnitario: 50.00,
      total: 50.00,
      descripcion: 'Consulta General'
    }
  });

  // 6.3 Pago
  await prisma.pagos.create({
    data: {
      facturaId: facturaJuan.id,
      fecha: new Date(),
      monto: 60.50,
      medio: 'Tarjeta Débito',
      referencia: 'TX-987654',
      estado: 'Aprobado'
    }
  });

  console.log('✅ Seeding completado con éxito.');
}

main()
  .catch((e) => {
    console.error('❌ Error en el seeder:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });