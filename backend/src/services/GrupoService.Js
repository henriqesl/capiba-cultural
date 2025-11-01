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
        grupo.setId(this.nextId++);
        this.grupos.push(grupo);

        return grupo;
    }

    listarGrupos() {
        return this.grupos;
    }

    obterPorId(id) {
        const grupo = this.grupos.find(g => g.getId() === id);
        if (!grupo) throw new Error("Grupo não encontrado.");
        return grupo;
    }

    adicionarMembro(grupoId, usuario) {
        const grupo = this.obterPorId(grupoId);

        if (grupo.getEncerrado()) throw new Error("Não é possível adicionar membros a um grupo encerrado.");

        const membros = grupo.getMembros();
        if (membros.some(m => m.getId() === usuario.getId())) {
            throw new Error("Usuário já faz parte do grupo.");
        }

        membros.push(usuario);
        grupo.setMembros(membros);

        this.atualizarPontuacao(grupo);
        return grupo;
    }

    atualizarPontuacao(grupo) {
        const total = grupo.getMembros().reduce(
            (acc, membro) => acc + (membro.saldoMoedaCapiba || 0),
            0
        );
        grupo.setPontuacaoTotal(total);
    }

    atualizarPontuacoes() {
        this.grupos.forEach(grupo => this.atualizarPontuacao(grupo));
        return this.grupos;
    }

    obterVencedor(grupo) {
        if (grupo.getMembros().length === 0) return null;

        const vencedor = grupo.getMembros().reduce(
            (max, u) => (u.saldoMoedaCapiba > (max?.saldoMoedaCapiba || 0) ? u : max),
            null
        );
        grupo.setVencedor(vencedor);
        return vencedor;
    }

    encerrarGrupo(grupoId) {
        const grupo = this.obterPorId(grupoId);

        if (grupo.getEncerrado())
            throw new Error("O grupo já foi encerrado.");

        grupo.setEncerrado(true);
        grupo.setVencedor(this.obterVencedor(grupo));

        return {
            id: grupo.getId(),
            nome: grupo.getNome(),
            vencedor: grupo.getVencedor() || null,
            pontuacaoTotal: grupo.getPontuacaoTotal(),
            encerrado: grupo.getEncerrado()
        };
    }

    verificarGruposExpirados() {
        const agora = new Date();
        this.grupos.forEach(grupo => {
            if (!grupo.getEncerrado() && grupo.getDataFim() < agora) {
                this.encerrarGrupo(grupo.getId());
                console.log(`Grupo "${grupo.getNome()}" foi encerrado automaticamente.`);
            }
        });
    }

    removerGrupo(id) {
        const index = this.grupos.findIndex(g => g.getId() === id);
        if (index === -1) return false;
        this.grupos.splice(index, 1);
        return true;
    }
}

module.exports = GrupoService;