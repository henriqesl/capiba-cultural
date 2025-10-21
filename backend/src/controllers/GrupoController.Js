const GrupoService = require('../services/GrupoService');

class GrupoController{
    constructor(){
        this.GrupoService = new GrupoService ();
    }

    criarGrupo(nome, dataInicio, dataFim){
        try{
            const grupo = this.GrupoService.criarGrupo(nome, dataInicio, dataFim);
            console.log(`Grupo ${grupo.nome} criado com sucesso!`);
            return grupo;
        } catch (error) {
            console.error("Erro ao criar grupo: ", error.message);
        }
    }

    listarGrupo(){
        try{
            const grupos = this.GrupoService.listarGrupos();
            console.log(`Grupos Cadastradao: `);
            grupos.forEach(g => {
                console.log(`Nome: ${g.nome}, Data de Início: ${g.dataInicio}, Data de Fim: ${g.dataFim}`);
            });
            return grupos;
        } catch (error) {
            console.error("Erro ao listar grupos: ", error.message);
        }
    }

    obterPorId(id) {
        try {
            const grupo = this.GrupoService.obterPorId(id);
            console.log(`Procurando Grupo por ID: ${id}`);
            return grupo;
        } catch (error) {
            console.error("Erro ao encontrar Grupo por ID: ", error.message)
        }
    }

    adicionarMembro(id, usuario){
        try{
            const grupo = this.GrupoService.adicionarMembro(id, usuario);
            console.log(`Adicionando usuário ${usuario.nome} no grupo ${grupo.nome}`);
            return grupo;
        } catch (error){
            console.error("Erro ao adicionar membro ao Grupo: ", error.message)
        }
    }

    atualizarPontuacoes(){
        try{
            const grupo = this.GrupoService.atualizarPontuacoes();
            console.log("Pontuação atualizada com sucesso!");
            return grupo;
        } catch (error) {
            console.error("Erro ao atualizar pontuação: ", error.message);
        }
    }

    encerrarGrupo(id){
        try{
            const grupo = this.GrupoService.encerrarGrupo(id);
            console.log(`Grupo ${grupo.nome} encerrado com sucesso!`);
            return grupo;
        } catch(error){
            console.error("Erro ao encerrar grupo: ", error.message);
        }
    }

    verificarGruposExpirados(){
        try{
            const grupo = this.GrupoService.verificarGruposExpirados();
            console.log("Grupos expirados: ");
            return grupo;
        } catch (error) {
            console.error("Erro ao verificar grupos expirados: ", error.message);
        }
    }

    removerGrupo(id){
        try{
            const grupo = this.GrupoService.removerGrupo(id);
            console.log(`Grupo ${grupo.nome} removido com sucesso!`);
            return grupo;
        } catch (error){
            console.error("Erro ao remover grupo: ", error.message);
        }
    }
}

module.exports = GrupoController;