/*
  Warnings:

  - A unique constraint covering the columns `[codigoAcesso]` on the table `caravanas` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `codigoAcesso` to the `caravanas` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "caravanas" ADD COLUMN     "codigoAcesso" TEXT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "caravanas_codigoAcesso_key" ON "caravanas"("codigoAcesso");
