/*
  Warnings:

  - You are about to drop the column `horario` on the `eventos` table. All the data in the column will be lost.
  - The `categoria` column on the `eventos` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The `preco` column on the `eventos` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- AlterTable
ALTER TABLE "eventos" DROP COLUMN "horario",
ALTER COLUMN "moedasCapibasDestribuidas" SET DEFAULT 10,
DROP COLUMN "categoria",
ADD COLUMN     "categoria" TEXT NOT NULL DEFAULT 'Geral',
DROP COLUMN "preco",
ADD COLUMN     "preco" DOUBLE PRECISION NOT NULL DEFAULT 0.0;

-- AlterTable
ALTER TABLE "usuarios" ADD COLUMN     "fotoUrl" TEXT;
