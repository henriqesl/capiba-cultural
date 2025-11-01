const GrupoService = require('../services/GrupoService');

class GrupoController{
    constructor(){
        this.GrupoService = new GrupoService ();
    }

    async criarGrupo(nome, dataInicio, dataFim){
        try{
            const grupo = await this.GrupoService.criarGrupo(nome, dataInicio, dataFim);
            console.log(`Grupo ${grupo.nome} criado com sucesso!`);
            return grupo;
        } catch (error) {
            console.error("Erro ao criar grupo: ", error.message);
        }
    }

    async listarGrupo(){
        try{
            const grupos = await this.GrupoService.listarGrupos();
            console.log(`Grupos Cadastradao: `);
            grupos.forEach(g => {
                console.log(`Nome: ${g.nome}, Data de Início: ${g.dataInicio}, Data de Fim: ${g.dataFim}`);
            });
            return grupos;
        } catch (error) {
            console.error("Erro ao listar grupos: ", error.message);
        }
    }

    async obterPorId(id) {
        try {
            const grupo = await this.GrupoService.obterPorId(id);
            console.log(`Procurando Grupo por ID: ${id}`);
            return grupo;
        } catch (error) {
            console.error("Erro ao encontrar Grupo por ID: ", error.message)
        }
    }

    async adicionarMembro(id, usuario){
        try{
            const grupo = await this.GrupoService.adicionarMembro(id, usuario);
            console.log(`Adicionando usuário ${usuario.nome} no grupo ${grupo.nome}`);
            return grupo;
        } catch (error){
            console.error("Erro ao adicionar membro ao Grupo: ", error.message)
        }
    }

   async atualizarPontuacoes() {
        try {
            const gruposAtualizados = this.GrupoService.atualizarPontuacoes();
            console.log("Pontuações atualizadas com sucesso!");
            return gruposAtualizados;
        } catch (error) {
            console.error("Erro ao atualizar pontuação:", error.message);
            throw error;
        }
    }

    async encerrarGrupo(id){
        try{
            const grupo = await this.GrupoService.encerrarGrupo(id);
            console.log(`Grupo ${grupo.nome} encerrado com sucesso!`);
            return grupo;
        } catch(error){
            console.error("Erro ao encerrar grupo: ", error.message);
        }
    }

    async verificarGruposExpirados(){
        try{
            const grupo = await this.GrupoService.verificarGruposExpirados();
            console.log("Grupos expirados: ");
            return grupo;
        } catch (error) {
            console.error("Erro ao verificar grupos expirados: ", error.message);
        }
    }

    async removerGrupo(id){
        try{
            const grupo = await this.GrupoService.removerGrupo(id);
            console.log(`Grupo ${grupo.nome} removido com sucesso!`);
            return grupo;
        } catch (error){
            console.error("Erro ao remover grupo: ", error.message);
        }
    }
}

module.exports = GrupoController;