const Usuario = require('../models/Usuario');

class UsuarioService {
    constructor() {
        this.usuarioRepository = new Usuario;
    }

    async criarUsuario(nome, email, senha) {
        if (!nome || !email || !senha) throw new Error("Todos os campos são obrigatórios");
        if (this.usuarioRepository.buscarEmail(email)) {
            throw new Error("E-mail já cadastrado");

        }
        const usuario = this.usuarioRepository.novoUsuario(nome, email, senha);
        return usuario;
    }

    async listarUsuarios() {
        return await this.usuarioRepository.listar();
    }

    async obterPorId(id) {
        const usuario = await this.usuarioRepository.buscarId(id);
        if (!usuario) {
            throw new Error('Usuário não encontrado');
        }
        return usuario;
    }

    async adicionarMoedas(usuarioId, quantidade) {
        const usuario = this.obterPorId(usuarioId);
        if (quantidade <= 0) throw new Error("Valor adicionado não pode ser zero ou negativo");

        const saldoAtual = this.usuario.getSaldo(usuarioId);
        const novoSaldo = saldoAtual + quantidade;
        return await this.usuarioRepository.setSaldo(usuarioId, novoSaldo);
    }

    async gastarMoedas(usuarioId, quantidade) {
        const saldoAtual = await this.usuarioRepository.getSaldo(usuarioId);

        if (quantidade <= 0) throw new Error("Quantidade não pode ser zero ou negativa");
        if (quantidade > saldoAtual) throw new Error("Usuário não pode gastar mais moedas do que tem");

        const novoSaldo = saldoAtual - quantidade;
        return await this.usuarioRepository.setSaldo(usuarioId, novoSaldo);
    }

    async removerUsuario(id) {
        const usuario = this.usuarioRepository.buscarId(id);
        if (!usuario) {
            throw new Error(`Usuário com ID ${id} não encontrado.`);
        }

        return await this.usuarioRepository.removerUsuario(id);
    }
}

module.exports = new UsuarioService();