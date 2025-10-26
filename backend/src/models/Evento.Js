const Usuario = require('./Usuario');
const Caravana = require('./Caravana');

class Evento {
  constructor(
    id,
    nome,
    local,
    data,
    descricao = '',
    pequenoPorte = false,
    reportadoPorUsuario = false,
    ativo = true,
    aoVivo = false,
    moedasCapibasDistribuidas = 0,
    confirmacoes = 0,
    participantes = [],
    caravanas = []
  ) {
    this.id = id;
    this.nome = nome;
    this.local = local;
    this.data = data instanceof Date ? data : new Date(data);
    this.descricao = descricao;
    this.pequenoPorte = pequenoPorte;
    this.reportadoPorUsuario = reportadoPorUsuario;
    this.ativo = ativo;
    this.aoVivo = aoVivo;
    this.moedasCapibasDistribuidas = moedasCapibasDistribuidas;
    this.confirmacoes = confirmacoes;
    this.participantes = participantes;
    this.caravanas = caravanas;
  }

  static fromPrisma(prismaData) {
    if (!prismaData) return null;
    return new Evento(
      prismaData.id,
      prismaData.nome,
      prismaData.local,
      prismaData.data,
      prismaData.descricao,
      prismaData.pequenoPorte,
      prismaData.reportadoPorUsuario,
      prismaData.ativo,
      prismaData.aoVivo,
      prismaData.moedasCapibasDestribuidas, // ou "Distribuidas" se você corrigir o nome no Prisma
      prismaData.confirmacoes,
      prismaData.participantes,
      prismaData.caravanas
    );
  }

  adicionarParticipante(usuario) {
    if (!usuario) throw new Error('Usuário inválido.');
    this.participantes.push(usuario);
  }

  adicionarConfirmacao() {
    this.confirmacoes++;
    if (this.confirmacoes >= 3) {
      this.aoVivo = true;
    }
  }
}

module.exports = Evento;