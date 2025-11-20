-- CreateTable
CREATE TABLE `afiliaciones` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `personaId` INTEGER NULL,
    `planId` INTEGER NULL,
    `aseguradoraId` INTEGER NULL,
    `numeroPoliza` VARCHAR(100) NULL,
    `vigenteDesde` DATE NULL,
    `vigenteHasta` DATE NULL,
    `copago` DECIMAL(10, 2) NULL,
    `cuotaModeradora` DECIMAL(10, 2) NULL,

    INDEX `aseguradoraId`(`aseguradoraId`),
    INDEX `personaId`(`personaId`),
    INDEX `planId`(`planId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `agenda` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `profesionalId` INTEGER NULL,
    `unidadId` INTEGER NULL,
    `inicio` DATETIME(0) NULL,
    `fin` DATETIME(0) NULL,
    `capacidad` INTEGER NULL,
    `estado` VARCHAR(20) NULL,

    INDEX `profesionalId`(`profesionalId`),
    INDEX `unidadId`(`unidadId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `arancel` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `prestacionId` INTEGER NULL,
    `planId` INTEGER NULL,
    `valorBase` DECIMAL(10, 2) NULL,
    `impuestos` DECIMAL(10, 2) NULL,
    `vigenteDesde` DATE NULL,
    `vigenteHasta` DATE NULL,

    INDEX `planId`(`planId`),
    INDEX `prestacionId`(`prestacionId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `archivo` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `fecha` DATETIME(0) NULL,
    `tipo` VARCHAR(50) NULL,
    `requisitos` TEXT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `aseguradoras` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `nombre` VARCHAR(500) NULL,
    `contacto` VARCHAR(255) NULL,
    `estado` VARCHAR(50) NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `bitacoraaccesos` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `usuarioId` INTEGER NOT NULL,
    `recurso` VARCHAR(50) NULL,
    `accion` VARCHAR(50) NULL,
    `ip` VARCHAR(50) NULL,
    `userAgent` VARCHAR(50) NULL,
    `fecha` DATETIME(0) NULL,

    INDEX `usuarioId`(`usuarioId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `citas` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `personaId` INTEGER NULL,
    `profesionalId` INTEGER NULL,
    `unidadId` INTEGER NULL,
    `inicio` DATETIME(0) NULL,
    `fin` DATETIME(0) NULL,
    `motivo` TEXT NULL,
    `canal` VARCHAR(20) NULL,
    `observaciones` TEXT NULL,
    `estado` VARCHAR(20) NULL,

    INDEX `personaId`(`personaId`),
    INDEX `profesionalId`(`profesionalId`),
    INDEX `unidadId`(`unidadId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `consentimientos` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `personaId` INTEGER NULL,
    `tipoProcedimiento` VARCHAR(150) NULL,
    `nombre` VARCHAR(150) NULL,
    `fecha` DATETIME(0) NULL,
    `archivoId` VARCHAR(100) NULL,

    INDEX `personaId`(`personaId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `diagnosticos` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `episodioId` INTEGER NULL,
    `codigo` VARCHAR(50) NULL,
    `descripcion` VARCHAR(255) NULL,
    `tipo` VARCHAR(50) NULL,
    `principal` BOOLEAN NULL,

    INDEX `episodioId`(`episodioId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `episodioprestacion` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `episodioId` INTEGER NOT NULL,
    `prestacionId` INTEGER NOT NULL,
    `profesionalId` INTEGER NULL,
    `fechaRealizacion` DATETIME(0) NULL,
    `cantidad` INTEGER NULL,
    `valorRegistrado` VARCHAR(50) NULL,

    INDEX `prestacionId`(`prestacionId`),
    INDEX `profesionalId`(`profesionalId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `episodiosatencion` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `personaId` INTEGER NULL,
    `fechaApertura` DATETIME(0) NULL,
    `motivo` TEXT NULL,
    `tipo` VARCHAR(50) NULL,
    `estado` VARCHAR(20) NULL,

    INDEX `personaId`(`personaId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `facturaitem` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `facturaId` INTEGER NULL,
    `prestacionId` INTEGER NULL,
    `descripcion` VARCHAR(50) NULL,
    `cantidad` INTEGER NULL,
    `valorUnitario` DECIMAL(10, 2) NULL,
    `impuestos` DECIMAL(10, 2) NULL,
    `total` DECIMAL(10, 2) NULL,

    INDEX `facturaId`(`facturaId`),
    INDEX `prestacionId`(`prestacionId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `facturas` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `personaId` INTEGER NULL,
    `aseguradoraId` INTEGER NULL,
    `numero` VARCHAR(50) NULL,
    `fechaEmision` DATETIME(0) NULL,
    `subtotal` DECIMAL(10, 2) NULL,
    `impuestos` DECIMAL(10, 2) NULL,
    `total` DECIMAL(10, 2) NULL,
    `estado` VARCHAR(50) NULL,
    `moneda` VARCHAR(10) NULL,

    UNIQUE INDEX `numero`(`numero`),
    INDEX `aseguradoraId`(`aseguradoraId`),
    INDEX `personaId`(`personaId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `items` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `nombre` VARCHAR(50) NULL,
    `descripcion` VARCHAR(50) NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `itemsprescripcion` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `prescripcionId` INTEGER NOT NULL,
    `itemId` INTEGER NOT NULL,
    `dosis` VARCHAR(50) NULL,
    `via` VARCHAR(50) NULL,
    `frecuencia` VARCHAR(50) NULL,
    `duracion` VARCHAR(50) NULL,

    INDEX `itemId`(`itemId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `notasclinicas` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `episodioId` INTEGER NULL,
    `profesionalId` INTEGER NULL,
    `fecha` DATETIME(0) NULL,
    `subjetivo` TEXT NULL,
    `objetivo` TEXT NULL,
    `analisis` TEXT NULL,
    `plan` TEXT NULL,

    INDEX `episodioId`(`episodioId`),
    INDEX `profesionalId`(`profesionalId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `notificaciones` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `usuarioId` INTEGER NULL,
    `facturaId` INTEGER NULL,
    `tipo` VARCHAR(50) NULL,
    `plantilla` VARCHAR(100) NULL,
    `destinatario` VARCHAR(255) NULL,
    `payload` TEXT NULL,
    `estado` VARCHAR(50) NULL,
    `timestamp` DATETIME(0) NULL,

    INDEX `facturaId`(`facturaId`),
    INDEX `usuarioId`(`usuarioId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `ordenes` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `episodioId` INTEGER NULL,
    `tipo` VARCHAR(50) NULL,
    `prioridad` VARCHAR(20) NULL,
    `estado` VARCHAR(50) NULL,

    INDEX `episodioId`(`episodioId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `ordenitems` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `ordenId` INTEGER NOT NULL,
    `itemId` INTEGER NOT NULL,
    `descripcion` VARCHAR(255) NULL,
    `indicaciones` TEXT NULL,

    INDEX `itemId`(`itemId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `pagos` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `facturaId` INTEGER NULL,
    `fecha` DATETIME(0) NULL,
    `monto` DECIMAL(10, 2) NULL,
    `medio` VARCHAR(50) NULL,
    `referencia` VARCHAR(50) NULL,
    `estado` VARCHAR(20) NULL,

    INDEX `facturaId`(`facturaId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `permisos` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `clave` VARCHAR(50) NULL,
    `descripcion` TEXT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `personasatendidas` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `tipoDocumento` VARCHAR(50) NULL,
    `numeroDocumento` VARCHAR(50) NULL,
    `nombres` VARCHAR(100) NULL,
    `apellidos` VARCHAR(100) NULL,
    `fechaNacimiento` DATE NULL,
    `sexo` VARCHAR(10) NULL,
    `correo` VARCHAR(150) NULL,
    `telefono` VARCHAR(50) NULL,
    `contactoEmergencia` VARCHAR(255) NULL,
    `direccion` VARCHAR(255) NULL,
    `alergias` VARCHAR(255) NULL,
    `estado` VARCHAR(20) NULL,

    UNIQUE INDEX `numeroDocumento`(`numeroDocumento`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `planescobertura` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `aseguradoraId` INTEGER NULL,
    `nombre` VARCHAR(100) NULL,
    `condicionesGenerales` TEXT NULL,

    INDEX `aseguradoraId`(`aseguradoraId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `prescripciones` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `episodioId` INTEGER NULL,
    `observaciones` TEXT NULL,

    INDEX `episodioId`(`episodioId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `prestaciones` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `nombre` VARCHAR(150) NULL,
    `grupo` VARCHAR(50) NULL,
    `requisitos` TEXT NULL,
    `tiempoEstimado` INTEGER NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `profesionales` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `usuarioId` INTEGER NOT NULL,
    `nombres` VARCHAR(100) NULL,
    `apellidos` VARCHAR(100) NULL,
    `registroProfesional` VARCHAR(255) NULL,
    `correo` VARCHAR(150) NULL,
    `telefono` VARCHAR(50) NULL,
    `especialidad` VARCHAR(100) NULL,
    `estado` VARCHAR(20) NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `profesionalunidad` (
    `Id` INTEGER NOT NULL AUTO_INCREMENT,
    `unidadId` INTEGER NOT NULL,
    `profesionalId` INTEGER NOT NULL,
    `nombre` VARCHAR(50) NULL,
    `condicionesGenerales` TEXT NULL,

    PRIMARY KEY (`Id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `resultados` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `ordenId` INTEGER NULL,
    `archivoId` INTEGER NULL,
    `resumen` TEXT NULL,
    `version` VARCHAR(20) NULL,
    `fecha` DATE NOT NULL,

    INDEX `archivoId`(`archivoId`),
    INDEX `ordenId`(`ordenId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `roles` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `nombre` VARCHAR(50) NULL,
    `descripcion` TEXT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `rolpermiso` (
    `rolId` INTEGER NOT NULL,
    `permisoId` INTEGER NOT NULL,

    INDEX `permisoId`(`permisoId`),
    PRIMARY KEY (`rolId`, `permisoId`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `unidadesatencion` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `nombre` VARCHAR(100) NULL,
    `tipo` VARCHAR(100) NULL,
    `metodo` VARCHAR(150) NULL,
    `direccion` VARCHAR(255) NULL,
    `telefono` VARCHAR(50) NULL,
    `estado` VARCHAR(20) NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `usuariorol` (
    `usuarioId` INTEGER NOT NULL,
    `rolId` INTEGER NOT NULL,

    INDEX `rolId`(`rolId`),
    PRIMARY KEY (`usuarioId`, `rolId`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `usuarios` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `username` VARCHAR(50) NULL,
    `email` VARCHAR(150) NULL,
    `passwordHash` VARCHAR(255) NULL,
    `estado` VARCHAR(20) NULL,
    `fechaCreacion` DATETIME(0) NULL,

    UNIQUE INDEX `username`(`username`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `afiliaciones` ADD CONSTRAINT `afiliaciones_ibfk_1` FOREIGN KEY (`personaId`) REFERENCES `personasatendidas`(`id`) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `afiliaciones` ADD CONSTRAINT `afiliaciones_ibfk_2` FOREIGN KEY (`planId`) REFERENCES `planescobertura`(`id`) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `afiliaciones` ADD CONSTRAINT `afiliaciones_ibfk_3` FOREIGN KEY (`aseguradoraId`) REFERENCES `aseguradoras`(`id`) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `agenda` ADD CONSTRAINT `agenda_ibfk_1` FOREIGN KEY (`profesionalId`) REFERENCES `profesionales`(`id`) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `agenda` ADD CONSTRAINT `agenda_ibfk_2` FOREIGN KEY (`unidadId`) REFERENCES `unidadesatencion`(`id`) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `arancel` ADD CONSTRAINT `arancel_ibfk_1` FOREIGN KEY (`prestacionId`) REFERENCES `prestaciones`(`id`) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `arancel` ADD CONSTRAINT `arancel_ibfk_2` FOREIGN KEY (`planId`) REFERENCES `planescobertura`(`id`) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `bitacoraaccesos` ADD CONSTRAINT `bitacoraaccesos_ibfk_1` FOREIGN KEY (`usuarioId`) REFERENCES `usuarios`(`id`) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `citas` ADD CONSTRAINT `citas_ibfk_1` FOREIGN KEY (`personaId`) REFERENCES `personasatendidas`(`id`) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `citas` ADD CONSTRAINT `citas_ibfk_2` FOREIGN KEY (`profesionalId`) REFERENCES `profesionales`(`id`) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `citas` ADD CONSTRAINT `citas_ibfk_3` FOREIGN KEY (`unidadId`) REFERENCES `unidadesatencion`(`id`) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `consentimientos` ADD CONSTRAINT `consentimientos_ibfk_1` FOREIGN KEY (`personaId`) REFERENCES `personasatendidas`(`id`) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `diagnosticos` ADD CONSTRAINT `diagnosticos_ibfk_1` FOREIGN KEY (`episodioId`) REFERENCES `episodiosatencion`(`id`) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `episodioprestacion` ADD CONSTRAINT `episodioprestacion_ibfk_1` FOREIGN KEY (`episodioId`) REFERENCES `episodiosatencion`(`id`) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `episodioprestacion` ADD CONSTRAINT `episodioprestacion_ibfk_2` FOREIGN KEY (`prestacionId`) REFERENCES `prestaciones`(`id`) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `episodioprestacion` ADD CONSTRAINT `episodioprestacion_ibfk_3` FOREIGN KEY (`profesionalId`) REFERENCES `profesionales`(`id`) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `episodiosatencion` ADD CONSTRAINT `episodiosatencion_ibfk_1` FOREIGN KEY (`personaId`) REFERENCES `personasatendidas`(`id`) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `facturaitem` ADD CONSTRAINT `facturaitem_ibfk_1` FOREIGN KEY (`facturaId`) REFERENCES `facturas`(`id`) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `facturaitem` ADD CONSTRAINT `facturaitem_ibfk_2` FOREIGN KEY (`prestacionId`) REFERENCES `prestaciones`(`id`) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `facturas` ADD CONSTRAINT `facturas_ibfk_1` FOREIGN KEY (`personaId`) REFERENCES `personasatendidas`(`id`) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `facturas` ADD CONSTRAINT `facturas_ibfk_2` FOREIGN KEY (`aseguradoraId`) REFERENCES `aseguradoras`(`id`) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `itemsprescripcion` ADD CONSTRAINT `itemsprescripcion_ibfk_1` FOREIGN KEY (`prescripcionId`) REFERENCES `prescripciones`(`id`) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `itemsprescripcion` ADD CONSTRAINT `itemsprescripcion_ibfk_2` FOREIGN KEY (`itemId`) REFERENCES `items`(`id`) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `notasclinicas` ADD CONSTRAINT `notasclinicas_ibfk_1` FOREIGN KEY (`episodioId`) REFERENCES `episodiosatencion`(`id`) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `notasclinicas` ADD CONSTRAINT `notasclinicas_ibfk_2` FOREIGN KEY (`profesionalId`) REFERENCES `profesionales`(`id`) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `notificaciones` ADD CONSTRAINT `notificaciones_ibfk_1` FOREIGN KEY (`usuarioId`) REFERENCES `usuarios`(`id`) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `notificaciones` ADD CONSTRAINT `notificaciones_ibfk_2` FOREIGN KEY (`facturaId`) REFERENCES `facturas`(`id`) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `ordenes` ADD CONSTRAINT `ordenes_ibfk_1` FOREIGN KEY (`episodioId`) REFERENCES `episodiosatencion`(`id`) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `ordenitems` ADD CONSTRAINT `ordenitems_ibfk_1` FOREIGN KEY (`ordenId`) REFERENCES `ordenes`(`id`) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `ordenitems` ADD CONSTRAINT `ordenitems_ibfk_2` FOREIGN KEY (`itemId`) REFERENCES `items`(`id`) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `pagos` ADD CONSTRAINT `pagos_ibfk_1` FOREIGN KEY (`facturaId`) REFERENCES `facturas`(`id`) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `planescobertura` ADD CONSTRAINT `planescobertura_ibfk_1` FOREIGN KEY (`aseguradoraId`) REFERENCES `aseguradoras`(`id`) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `prescripciones` ADD CONSTRAINT `prescripciones_ibfk_1` FOREIGN KEY (`episodioId`) REFERENCES `episodiosatencion`(`id`) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `profesionales` ADD CONSTRAINT `profesionales_usuarioId_fkey` FOREIGN KEY (`usuarioId`) REFERENCES `usuarios`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `profesionalunidad` ADD CONSTRAINT `profesionalunidad_ibfk_1` FOREIGN KEY (`profesionalId`) REFERENCES `profesionales`(`id`) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `profesionalunidad` ADD CONSTRAINT `profesionalunidad_unidadId_fkey` FOREIGN KEY (`unidadId`) REFERENCES `unidadesatencion`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `resultados` ADD CONSTRAINT `resultados_ibfk_1` FOREIGN KEY (`ordenId`) REFERENCES `ordenes`(`id`) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `resultados` ADD CONSTRAINT `resultados_ibfk_2` FOREIGN KEY (`archivoId`) REFERENCES `archivo`(`id`) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `rolpermiso` ADD CONSTRAINT `rolpermiso_ibfk_1` FOREIGN KEY (`rolId`) REFERENCES `roles`(`id`) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `rolpermiso` ADD CONSTRAINT `rolpermiso_ibfk_2` FOREIGN KEY (`permisoId`) REFERENCES `permisos`(`id`) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `usuariorol` ADD CONSTRAINT `usuariorol_ibfk_1` FOREIGN KEY (`usuarioId`) REFERENCES `usuarios`(`id`) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `usuariorol` ADD CONSTRAINT `usuariorol_ibfk_2` FOREIGN KEY (`rolId`) REFERENCES `roles`(`id`) ON DELETE NO ACTION ON UPDATE NO ACTION;
