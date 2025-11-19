/*
  Warnings:

  - The primary key for the `_MembrosDaCaravana` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The primary key for the `_MembrosDoGrupo` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - A unique constraint covering the columns `[A,B]` on the table `_MembrosDaCaravana` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[A,B]` on the table `_MembrosDoGrupo` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "_MembrosDaCaravana" DROP CONSTRAINT "_MembrosDaCaravana_AB_pkey";

-- AlterTable
ALTER TABLE "_MembrosDoGrupo" DROP CONSTRAINT "_MembrosDoGrupo_AB_pkey";

-- CreateTable
CREATE TABLE "eventos" (
    "id" SERIAL NOT NULL,
    "nome" TEXT NOT NULL,
    "data" TIMESTAMP(3) NOT NULL,
    "local" TEXT NOT NULL,
    "moedasDistribuidas" INTEGER NOT NULL DEFAULT 10,

    CONSTRAINT "eventos_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "checkins" (
    "id" SERIAL NOT NULL,
    "data" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "usuarioId" INTEGER NOT NULL,
    "eventoId" INTEGER NOT NULL,

    CONSTRAINT "checkins_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "checkins_usuarioId_eventoId_key" ON "checkins"("usuarioId", "eventoId");

-- CreateIndex
CREATE UNIQUE INDEX "_MembrosDaCaravana_AB_unique" ON "_MembrosDaCaravana"("A", "B");

-- CreateIndex
CREATE UNIQUE INDEX "_MembrosDoGrupo_AB_unique" ON "_MembrosDoGrupo"("A", "B");

-- AddForeignKey
ALTER TABLE "checkins" ADD CONSTRAINT "checkins_usuarioId_fkey" FOREIGN KEY ("usuarioId") REFERENCES "usuarios"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "checkins" ADD CONSTRAINT "checkins_eventoId_fkey" FOREIGN KEY ("eventoId") REFERENCES "eventos"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
