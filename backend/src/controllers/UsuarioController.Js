const usuarioService = require('../services/UsuarioService');
const GrupoService = require('../services/GrupoService');

class UsuarioController {
    constructor() {
        this.usuarioService = usuarioService;
        this.grupoService = new GrupoService();
    }

    async criarUsuario(nome, email, senha, cpf) {
        try {
            const usuario = await this.usuarioService.criarUsuario(nome, email, senha, cpf);
            console.log(`Usuário ${usuario.nome} criado com sucesso!`);
            return usuario;
        } catch (error) {
            console.error("Erro ao criar usuário:", error.message);
            throw error;
        }
    }

    async login(email, senha) {
        try {
            const resultado = await this.usuarioService.autenticarUsuario(email, senha);
            return resultado;
        } catch (error) {
            console.error("Erro no Login:", error.message);
            throw error;
        }
    }
    
    async listarUsuarios() {
        try {
            const usuarios = await this.usuarioService.listarUsuarios();
            console.log("Usuários cadastrados:");
            usuarios.forEach(u => {
                console.log(`Nome: ${u.nome}, E-mail: ${u.email}`);
            });
            return usuarios;
        } catch (error) {
            console.error("Erro ao listar os usuários:", error.message);
            throw error;
        }
    }

    async obterPorId(id) {
        try {
            const usuario = await this.usuarioService.obterPorId(id);
            console.log(`Usuário encontrado: ${usuario.nome}`);
            return usuario;
        } catch (error) {
            console.error("Erro ao encontrar usuário por ID:", error.message);
            throw error;
        }
    }
    
    async adicionarMoedas(usuarioId, quantidade) {
        try {
            const usuario = await this.usuarioService.adicionarMoedas(usuarioId, quantidade);
            console.log(`Adicionadas ${quantidade} moedas ao usuário ${usuario.nome}`);
            return usuario;
        } catch (error) {
            console.error("Erro ao adicionar moedas ao usuário:", error.message);
            throw error;
        }
    }

    async gastarMoedas(usuarioId, quantidade) {
        try {
            const usuario = await this.usuarioService.gastarMoedas(usuarioId, quantidade);
            console.log(`Usuário ${usuario.nome} gastou ${quantidade} moedas`);
            return usuario;
        } catch (error) {
            console.error("Erro ao gastar moedas:", error.message);
            throw error;
        }
    }

    async removerUsuario(id) {
        try {
            const usuario = await this.usuarioService.removerUsuario(id);
            console.log(`Usuário ${usuario.nome} removido com sucesso.`);
            return usuario;
        } catch (error) {
            console.error("Erro ao remover usuário:", error.message);
            throw error; 
        }
    }

}


module.exports = UsuarioController;