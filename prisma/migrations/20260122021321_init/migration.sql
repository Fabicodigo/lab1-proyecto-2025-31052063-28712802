/*
  Warnings:

  - You are about to drop the column `version` on the `resultados` table. All the data in the column will be lost.
  - You are about to drop the `bitacoraaccesos` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE `bitacoraaccesos` DROP FOREIGN KEY `bitacoraaccesos_ibfk_1`;

-- AlterTable
ALTER TABLE `episodiosatencion` ADD COLUMN `profesionalId` INTEGER NULL,
    ADD COLUMN `unidadId` INTEGER NULL;

-- AlterTable
ALTER TABLE `resultados` DROP COLUMN `version`;

-- DropTable
DROP TABLE `bitacoraaccesos`;
