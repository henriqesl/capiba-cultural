/*
  Warnings:

  - A unique constraint covering the columns `[telefone]` on the table `usuarios` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "usuarios" ADD COLUMN     "dataNascimento" TIMESTAMP(3) NOT NULL DEFAULT '2000-01-01 00:00:00 +00:00',
ADD COLUMN     "imagemUrl" TEXT,
ADD COLUMN     "telefone" TEXT NOT NULL DEFAULT 'temp_user',
ADD COLUMN     "username" TEXT NOT NULL DEFAULT '00000000000';

-- CreateIndex
CREATE UNIQUE INDEX "usuarios_telefone_key" ON "usuarios"("telefone");
