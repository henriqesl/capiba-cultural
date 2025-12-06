/*
  Warnings:

  - You are about to drop the column `data` on the `caravanas` table. All the data in the column will be lost.
  - You are about to drop the column `moedasDistribuidas` on the `eventos` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[cpf]` on the table `usuarios` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `descricao` to the `eventos` table without a default value. This is not possible if the table is not empty.
  - Added the required column `cpf` to the `usuarios` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "caravanas" DROP COLUMN "data",
ADD COLUMN     "ativo" BOOLEAN NOT NULL DEFAULT true,
ADD COLUMN     "bonusPorParticipante" INTEGER NOT NULL DEFAULT 10,
ADD COLUMN     "descricao" TEXT NOT NULL DEFAULT 'Caravana sem descrição',
ADD COLUMN     "eventoId" INTEGER;

-- AlterTable
ALTER TABLE "eventos" DROP COLUMN "moedasDistribuidas",
ADD COLUMN     "aoVivo" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "ativo" BOOLEAN NOT NULL DEFAULT true,
ADD COLUMN     "confirmacoes" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "descricao" TEXT NOT NULL,
ADD COLUMN     "moedasCapibasDestribuidas" DOUBLE PRECISION NOT NULL DEFAULT 0,
ADD COLUMN     "pequenoPorte" BOOLEAN NOT NULL DEFAULT true,
ADD COLUMN     "reportadoPorUsuario" BOOLEAN NOT NULL DEFAULT false;

-- AlterTable
ALTER TABLE "usuarios" ADD COLUMN     "cpf" VARCHAR(11) NOT NULL;

-- CreateTable
CREATE TABLE "reportes_eventos" (
    "id" SERIAL NOT NULL,
    "descricao" TEXT,
    "dataReporte" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "qtdConfirmacoes" INTEGER NOT NULL DEFAULT 1,
    "eventoId" INTEGER NOT NULL,
    "reportanteId" INTEGER NOT NULL,

    CONSTRAINT "reportes_eventos_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "_ParticipantesDoEvento" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL
);

-- CreateTable
CREATE TABLE "_ConfirmadoresDoReporte" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "_ParticipantesDoEvento_AB_unique" ON "_ParticipantesDoEvento"("A", "B");

-- CreateIndex
CREATE INDEX "_ParticipantesDoEvento_B_index" ON "_ParticipantesDoEvento"("B");

-- CreateIndex
CREATE UNIQUE INDEX "_ConfirmadoresDoReporte_AB_unique" ON "_ConfirmadoresDoReporte"("A", "B");

-- CreateIndex
CREATE INDEX "_ConfirmadoresDoReporte_B_index" ON "_ConfirmadoresDoReporte"("B");

-- CreateIndex
CREATE UNIQUE INDEX "usuarios_cpf_key" ON "usuarios"("cpf");

-- AddForeignKey
ALTER TABLE "caravanas" ADD CONSTRAINT "caravanas_eventoId_fkey" FOREIGN KEY ("eventoId") REFERENCES "eventos"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "reportes_eventos" ADD CONSTRAINT "reportes_eventos_eventoId_fkey" FOREIGN KEY ("eventoId") REFERENCES "eventos"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "reportes_eventos" ADD CONSTRAINT "reportes_eventos_reportanteId_fkey" FOREIGN KEY ("reportanteId") REFERENCES "usuarios"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_ParticipantesDoEvento" ADD CONSTRAINT "_ParticipantesDoEvento_A_fkey" FOREIGN KEY ("A") REFERENCES "eventos"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_ParticipantesDoEvento" ADD CONSTRAINT "_ParticipantesDoEvento_B_fkey" FOREIGN KEY ("B") REFERENCES "usuarios"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_ConfirmadoresDoReporte" ADD CONSTRAINT "_ConfirmadoresDoReporte_A_fkey" FOREIGN KEY ("A") REFERENCES "reportes_eventos"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_ConfirmadoresDoReporte" ADD CONSTRAINT "_ConfirmadoresDoReporte_B_fkey" FOREIGN KEY ("B") REFERENCES "usuarios"("id") ON DELETE CASCADE ON UPDATE CASCADE;
