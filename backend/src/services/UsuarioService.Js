const Usuario = require('../models/Usuario');

class UsuarioService {
    constructor() {
        this.usuarios = [];
        this.nextId = 1;
    }

    criarUsuario(nome, email, senha) {
        if (this.usuarios.some(u => u.email === email)) {
            throw new Error("E-mail já cadastrado");
        }

        const usuario = new Usuario(nome, email, senha);
        usuario.id = this.nextId++;
        this.usuarios.push(usuario);

        return usuario;
    }

    listarUsuarios() {
        return this.usuarios;
    }

    obterPorId(id) {
        const usuario = this.usuarios.find(u => u.id === id);
        if (!usuario) throw new Error("Usuário não encontrado");
        return usuario;
    }

    adicionarMoedas(usuarioId, quantidade) {
        const usuario = this.obterPorId(usuarioId);
        usuario.adicionarMoedas(quantidade);
    }

    gastarMoedas(usuarioId, quantidade) {
        const usuario = this.obterPorId(usuarioId);
        return usuario.gastarMoedas(quantidade);
    }

    removerUsuario(id) {
        const index = this.usuarios.findIndex(u => u.id === id);
        if (index === -1) return false;
        this.usuarios.splice(index, 1);
        return true;
    }
}

module.exports = UsuarioService;