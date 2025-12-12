/*
  Warnings:

  - A unique constraint covering the columns `[titulo]` on the table `missoes` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "missoes_titulo_key" ON "missoes"("titulo");
