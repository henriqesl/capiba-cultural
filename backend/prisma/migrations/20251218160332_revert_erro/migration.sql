/*
  Warnings:

  - A unique constraint covering the columns `[codigoAcesso]` on the table `caravanas` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "caravanas" ADD COLUMN     "codigoAcesso" TEXT,
ADD COLUMN     "criadorId" INTEGER,
ADD COLUMN     "imagemUrl" TEXT;

-- AlterTable
ALTER TABLE "eventos" ALTER COLUMN "reportadoPorUsuario" SET DEFAULT true;

-- CreateIndex
CREATE UNIQUE INDEX "caravanas_codigoAcesso_key" ON "caravanas"("codigoAcesso");
