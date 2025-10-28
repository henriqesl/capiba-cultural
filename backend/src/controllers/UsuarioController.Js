const UsuarioService = require('../services/UsuarioService');

class UsuarioController {
    constructor() {
        this.usuarioService = new UsuarioService();
    }
    
    criarUsuario(nome, email, senha) {
        try {
            const usuario = this.usuarioService.criarUsuario(nome, email, senha);
            console.log(`Usuário ${usuario.nome} criado com sucesso!`);
            return usuario;
        } catch (error) {
            console.error("Erro ao criar usuário:", error.message);
        }
    }

    listarUsuarios() {
        try {
            const usuarios = this.usuarioService.listarUsuarios();
            console.log("Usuários cadastrados:");
            usuarios.forEach(u => {
                console.log(`Nome: ${u.nome}, E-mail: ${u.email}`);
            });
            return usuarios;
        } catch (error) {
            console.error("Erro ao listar os usuários:", error.message);
        }
    }

    obterPorId(id) {
        try {
            const usuario = this.usuarioService.obterPorId(id);
            console.log(`Usuário encontrado: ${usuario.nome}`);
            return usuario;
        } catch (error) {
            console.error("Erro ao encontrar usuário por ID:", error.message);
        }
    }
    
    adicionarMoedas(usuarioId, quantidade) {
        try {
            const usuario = this.usuarioService.adicionarMoedas(usuarioId, quantidade);
            console.log(`Adicionadas ${quantidade} moedas ao usuário ${usuario.nome}`);
            return usuario;
        } catch (error) {
            console.error("Erro ao adicionar moedas ao usuário:", error.message);
        }
    }

    gastarMoedas(usuarioId, quantidade) {
        try {
            const usuario = this.usuarioService.gastarMoedas(usuarioId, quantidade);
            console.log(`Usuário ${usuario.nome} gastou ${quantidade} moedas`);
            return usuario;
        } catch (error) {
            console.error("Erro ao gastar moedas:", error.message);
        }
    }

    removerUsuario(id) {
        try {
            const usuario = this.usuarioService.removerUsuario(id);
            console.log(`Usuário ${usuario.nome} removido com sucesso.`);
            return usuario;
        } catch (error) {
            console.error("Erro ao remover usuário:", error.message);
        }
    }
}

module.exports = UsuarioController;