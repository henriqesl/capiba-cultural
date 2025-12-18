const { PrismaClient, TipoMissao, CategoriaEvento } = require("@prisma/client");
const prisma = new PrismaClient();

async function main() {
  console.log("Iniciando o Seed de Missões...");

  const missoesIniciais = [
    {
      titulo: "Aventureiro de Primeira Viagem",
      descricao:
        "Faça check-in em 5 eventos (qualquer tipo) para começar sua jornada!",
      recompensaCapibas: 50,
      tipoRequisito: TipoMissao.COUNT_CHECKINS,
      valorRequisito: 5,
      tagRequisito: null,
    },
    {
      titulo: "Conhecedor de Lugares",
      descricao:
        "Visite 3 locais (eventos) diferentes para expandir seu horizonte cultural.",
      recompensaCapibas: 30,
      tipoRequisito: TipoMissao.UNIQUE_LOCATIONS,
      valorRequisito: 3,
      tagRequisito: null,
    },
    {
      titulo: "Mestre do Rock",
      descricao: "Faça check-in em 2 eventos da categoria ROCK.",
      recompensaCapibas: 20,
      tipoRequisito: TipoMissao.SPECIFIC_TAG,
      valorRequisito: 2,
      tagRequisito: CategoriaEvento.ROCK,
    },
    {
      titulo: "Apreciador de Arte",
      descricao: "Faça check-in em 1 evento de ARTE_VISUAL ou TEATRO.",
      recompensaCapibas: 15,
      tipoRequisito: TipoMissao.SPECIFIC_TAG,
      valorRequisito: 1,
      tagRequisito: CategoriaEvento.ARTE_VISUAL,
    },
    {
      titulo: "Folclore Brasileiro",
      descricao: "Faça check-in em 1 evento de SAMBA ou FREVO.",
      recompensaCapibas: 25,
      tipoRequisito: TipoMissao.SPECIFIC_TAG,
      valorRequisito: 1,
      tagRequisito: CategoriaEvento.SAMBA,
    },
  ];

  for (const missao of missoesIniciais) {
    await prisma.missao.upsert({
      where: { titulo: missao.titulo },
      update: missao,
      create: missao,
    });
  }

  console.log(
    `Seed de Missões concluído. ${missoesIniciais.length} missões carregadas.`,
  );
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
