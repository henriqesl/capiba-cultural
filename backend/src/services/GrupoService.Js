const GrupoCompeticao = require('../models/GrupoCompeticao');

class GrupoService {
    constructor() {
        this.grupos = [];
        this.nextId = 1;
    }

    criarGrupo(nome, dataInicio, dataFim) {
        if (!nome) throw new Error("Nome do grupo é obrigatório");
        if (!dataInicio || !dataFim) throw new Error("Datas de início e fim são obrigatórias");

        const grupo = new GrupoCompeticao(nome, dataInicio, dataFim);
        grupo.id = this.nextId++;
        this.grupos.push(grupo);

        return grupo;
    }

    listarGrupos() {
        return this.grupos;
    }

    obterPorId(id) {
        const grupo = this.grupos.find(g => g.id === id);
        if (!grupo) throw new Error("Grupo não encontrado.");
        return grupo;
    }

    adicionarMembro(grupoId, usuario) {
        const grupo = this.obterPorId(grupoId);
        if (grupo.encerrado) throw new Error("Não é possível adicionar membros a um grupo encerrado.");
        grupo.adicionarMembro(usuario);
        return grupo;
    }

    atualizarPontuacoes() {
        this.grupos.forEach(grupo => grupo.atualizarPontuacao());
    }

    encerrarGrupo(grupoId) {
        const grupo = this.obterPorId(grupoId);
        grupo.encerrarGrupo();
        return {
            id: grupo.id,
            nome: grupo.nome,
            vencedor: grupo.vencedor?.nome || null,
            pontuacaoTotal: grupo.pontuacaoTotal,
            encerrado: grupo.encerrado
        };
    }

    verificarGruposExpirados() {
        const agora = new Date();
        this.grupos.forEach(grupo => {
            if (!grupo.encerrado && grupo.dataFim < agora) {
                grupo.encerrarGrupo();
                console.log(`Grupo "${grupo.nome}" foi encerrado automaticamente.`);
            }
        });
    }

    removerGrupo(id) {
        const index = this.grupos.findIndex(g => g.id === id);
        if (index === -1) return false;
        this.grupos.splice(index, 1);
        return true;
    }
}

module.exports = GrupoService;