/*
  Warnings:

  - A unique constraint covering the columns `[username]` on the table `usuarios` will be added. If there are existing duplicate values, this will fail.

*/
-- DropIndex
DROP INDEX "usuarios_telefone_key";

-- AlterTable
ALTER TABLE "usuarios" ALTER COLUMN "telefone" SET DEFAULT '00000000000',
ALTER COLUMN "username" SET DEFAULT 'temp_user';

-- CreateIndex
CREATE UNIQUE INDEX "usuarios_username_key" ON "usuarios"("username");
