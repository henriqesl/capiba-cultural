-- CreateTable
CREATE TABLE "usuarios" (
    "id" SERIAL NOT NULL,
    "nome" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "senha" TEXT NOT NULL,
    "saldoMoedaCapiba" INTEGER NOT NULL DEFAULT 0,
    "dataCadastro" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "usuarios_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "grupos_competicao" (
    "id" SERIAL NOT NULL,
    "nome" TEXT NOT NULL,
    "dataInicio" TIMESTAMP(3) NOT NULL,
    "dataFim" TIMESTAMP(3) NOT NULL,
    "encerrado" BOOLEAN NOT NULL DEFAULT false,
    "pontuacaoTotal" INTEGER NOT NULL DEFAULT 0,
    "vencedorId" INTEGER,

    CONSTRAINT "grupos_competicao_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "caravanas" (
    "id" SERIAL NOT NULL,
    "nome" TEXT NOT NULL,
    "data" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "caravanas_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "_MembrosDoGrupo" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL,

    CONSTRAINT "_MembrosDoGrupo_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateTable
CREATE TABLE "_MembrosDaCaravana" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL,

    CONSTRAINT "_MembrosDaCaravana_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateIndex
CREATE UNIQUE INDEX "usuarios_email_key" ON "usuarios"("email");

-- CreateIndex
CREATE INDEX "_MembrosDoGrupo_B_index" ON "_MembrosDoGrupo"("B");

-- CreateIndex
CREATE INDEX "_MembrosDaCaravana_B_index" ON "_MembrosDaCaravana"("B");

-- AddForeignKey
ALTER TABLE "grupos_competicao" ADD CONSTRAINT "grupos_competicao_vencedorId_fkey" FOREIGN KEY ("vencedorId") REFERENCES "usuarios"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_MembrosDoGrupo" ADD CONSTRAINT "_MembrosDoGrupo_A_fkey" FOREIGN KEY ("A") REFERENCES "grupos_competicao"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_MembrosDoGrupo" ADD CONSTRAINT "_MembrosDoGrupo_B_fkey" FOREIGN KEY ("B") REFERENCES "usuarios"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_MembrosDaCaravana" ADD CONSTRAINT "_MembrosDaCaravana_A_fkey" FOREIGN KEY ("A") REFERENCES "caravanas"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_MembrosDaCaravana" ADD CONSTRAINT "_MembrosDaCaravana_B_fkey" FOREIGN KEY ("B") REFERENCES "usuarios"("id") ON DELETE CASCADE ON UPDATE CASCADE;
