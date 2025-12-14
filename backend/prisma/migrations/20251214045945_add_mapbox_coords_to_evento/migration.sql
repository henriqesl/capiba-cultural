/*
  Warnings:

  - You are about to drop the column `codigoAcesso` on the `caravanas` table. All the data in the column will be lost.
  - The `categoria` column on the `eventos` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - You are about to drop the column `dataNascimento` on the `usuarios` table. All the data in the column will be lost.
  - You are about to drop the column `imagemUrl` on the `usuarios` table. All the data in the column will be lost.
  - You are about to drop the column `telefone` on the `usuarios` table. All the data in the column will be lost.
  - You are about to drop the column `username` on the `usuarios` table. All the data in the column will be lost.

*/
-- DropIndex
DROP INDEX "caravanas_codigoAcesso_key";

-- DropIndex
DROP INDEX "usuarios_username_key";

-- AlterTable
ALTER TABLE "caravanas" DROP COLUMN "codigoAcesso";

-- AlterTable
ALTER TABLE "eventos" ADD COLUMN     "horario" TEXT,
ALTER COLUMN "moedasCapibasDestribuidas" SET DEFAULT 0,
DROP COLUMN "categoria",
ADD COLUMN     "categoria" "CategoriaEvento" NOT NULL DEFAULT 'OUTRO',
ALTER COLUMN "preco" DROP NOT NULL,
ALTER COLUMN "preco" DROP DEFAULT,
ALTER COLUMN "preco" SET DATA TYPE TEXT;

-- AlterTable
ALTER TABLE "usuarios" DROP COLUMN "dataNascimento",
DROP COLUMN "imagemUrl",
DROP COLUMN "telefone",
DROP COLUMN "username";
