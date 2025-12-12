-- CreateEnum
CREATE TYPE "CategoriaEvento" AS ENUM ('ROCK', 'SAMBA', 'FREVO', 'ARTE_VISUAL', 'TEATRO', 'GASTRONOMIA', 'OUTRO');

-- CreateEnum
CREATE TYPE "TipoMissao" AS ENUM ('COUNT_CHECKINS', 'UNIQUE_LOCATIONS', 'SPECIFIC_TAG');

-- AlterTable
ALTER TABLE "eventos" ADD COLUMN     "categoria" "CategoriaEvento" NOT NULL DEFAULT 'OUTRO',
ADD COLUMN     "faixaEtaria" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "horario" TEXT,
ADD COLUMN     "imagemUrl" TEXT,
ADD COLUMN     "precisaInscricao" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "preco" TEXT;

-- CreateTable
CREATE TABLE "missoes" (
    "id" SERIAL NOT NULL,
    "titulo" TEXT NOT NULL,
    "descricao" TEXT NOT NULL,
    "recompensaCapibas" INTEGER NOT NULL,
    "tipoRequisito" "TipoMissao" NOT NULL,
    "valorRequisito" INTEGER NOT NULL,
    "tagRequisito" TEXT,

    CONSTRAINT "missoes_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "status_usuario" (
    "id" SERIAL NOT NULL,
    "progressoAtual" INTEGER NOT NULL DEFAULT 0,
    "concluida" BOOLEAN NOT NULL DEFAULT false,
    "dataConclusao" TIMESTAMP(3),
    "usuarioId" INTEGER NOT NULL,
    "missaoId" INTEGER NOT NULL,

    CONSTRAINT "status_usuario_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "status_usuario_usuarioId_missaoId_key" ON "status_usuario"("usuarioId", "missaoId");

-- AddForeignKey
ALTER TABLE "status_usuario" ADD CONSTRAINT "status_usuario_usuarioId_fkey" FOREIGN KEY ("usuarioId") REFERENCES "usuarios"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "status_usuario" ADD CONSTRAINT "status_usuario_missaoId_fkey" FOREIGN KEY ("missaoId") REFERENCES "missoes"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
