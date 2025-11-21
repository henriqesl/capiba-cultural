const GrupoCompeticao = require('../models/GrupoCompeticao');

class GrupoService {
    constructor() {
      this.grupoRepository = new GrupoCompeticao();
    }
    
    async criarGrupo(nome, dataInicio, dataFim, encerrado = false, pontuacaoTotal = 0) {
         if (!nome) throw new Error("Nome do grupo é obrigatório"); 7
         if (!dataInicio || !dataFim) throw new Error("Datas de início e fim são obrigatórias"); 
         
         return await this.grupoRepository.novoGrupoCompeticao(nome, dataInicio, dataFim, encerrado, pontuacaoTotal); 
        }


    async listarGrupos() {
        return await this.grupoRepository.listar();
    }

    async obterPorId(id) {
        const grupo = await this.grupoRepository.obterPorId(id);
        if (!grupo) throw new Error("Grupo não encontrado.");
        return grupo;
    }

    async adicionarMembro(grupoId, usuarioId) {
        const grupo = await this.grupoRepository.obterPorId(grupoId);
        if (!grupo) throw new Error("Grupo não encontrado.");
        if (grupo.getEncerrado(grupoId)) throw new Error("Não é possível adicionar membros a um grupo encerrado.");

        const membros = await this.grupoRepository.getMembros(grupoId);
        if (membros.some(m => m.id === usuarioId)) {
            throw new Error("Usuário já faz parte do grupo.");
        }


        await this.grupoRepository.adicionarMembro(grupoId, usuarioId);
        await this.atualizarPontuacao(grupoId);
        return await this.grupoRepository.obterPorId(grupoId);

    }

    async atualizarPontuacao(id) {
        const membros = await this.grupoRepository.getMembros(id);
        const total = membros.reduce((acc, membro) => acc + (membro.saldoMoedaCapiba || 0), 0);
        await this.grupoRepository.setPontuacaoTotal(id, total);
    }

    async atualizarPontuacoes(id) {
        const grupos = await this.grupoRepository.listar();
        for (const grupo of grupos) {
            await this.atualizarPontuacao(grupo.id);
        }   
        
        return grupos;
    }

    async obterVencedor(grupoId) {
        const membros = await this.grupoRepository.getMembros(grupoId);

        if (membros.length === 0) return null;

        const vencedor = membros.reduce(
            (max, u) => (u.saldoMoedaCapiba > (max?.saldoMoedaCapiba || 0) ? u : max),
            null
        );
        await this.grupoRepository.setVencedor(grupoId, vencedor.id);
        return vencedor;
    }

    async encerrarGrupo(grupoId) {
        const grupo = await this.grupoRepository.obterPorId(grupoId);

        if (grupo.encerrado)
            throw new Error("O grupo já foi encerrado.");

        const vencedor = await this.obterVencedor(grupoId);
        await this.grupoRepository.setEncerrado(grupoId, true);
        await this.grupoRepository.setVencedor(grupoId, vencedor?.id || null);

        return {
            id: grupo.id,
            nome: grupo.nome,
            vencedor: vencedor ? vencedor.nome : null,
            pontuacaoTotal: grupo.pontuacaoTotal,
            encerrado: true,
        };
    }

    async verificarGruposExpirados() {
        const agora = new Date();
        const grupos = this.grupoRepository.listar();
        for (const grupo of grupos) {
            if (!grupo.encerrado && new Date(grupo.dataFim) < agora) {
            await this.encerrarGrupo(grupo.id);
            console.log(`Grupo "${grupo.nome}" foi encerrado automaticamente.`);
            }
        }
    }

    async removerGrupo(id) {
        return await this.grupoRepository.removerGrupo(id);
    }
}
    

module.exports = GrupoService;