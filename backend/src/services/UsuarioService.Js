const Usuario = require('../models/Usuario');

class UsuarioService {
    constructor() {
        this.usuarios = [];
        this.nextId = 1;
    }

    criarUsuario(nome, email, senha) {
        if (!nome || !email || !senha) throw new Error("Todos os campos são obrigatórios");
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
        if (quantidade <= 0) throw new Error("Valor adicionado não pode ser zero ou negativo");
        usuario.adicionarMoedas(quantidade);
        return usuario;
    }

    gastarMoedas(usuarioId, quantidade) {
        const usuario = this.obterPorId(usuarioId);
        if (quantidade > usuario.saldoMoedaCapiba) throw new Error("Usuário não pode gastar mais moedas capibas do que já tem");
        return usuario.gastarMoedas(quantidade);
        return usuario;
    }

    removerUsuario(id) {
        const index = this.usuarios.findIndex(u => u.id === id);
        if (index === -1) return false;
        this.usuarios.splice(index, 1);
        return true;
    }
}

module.exports = UsuarioService;