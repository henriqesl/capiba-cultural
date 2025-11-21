const Usuario = require('../models/Usuario');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

class UsuarioService {
    constructor() {
        this.usuarioRepository = new Usuario();
    }

    async criarUsuario(nome, email, senha, cpf) {
        if (!nome || !email || !senha || !cpf) throw new Error("Todos os campos são obrigatórios");
        if (await this.usuarioRepository.buscarEmail(email)) {
            throw new Error("E-mail já cadastrado");

        }

        const salt = await bcrypt.genSalt(10);
        const senhaHash = await bcrypt.hash(senha, salt)

        const novoUsuario = await this.usuarioRepository.novoUsuario(nome, email, senhaHash);
        delete novoUsuario.senha;
        return await novoUsuario;
    }

    async autenticarUsuario(email, senha) {
        const usuario = await this.usuarioRepository.buscarEmail(email);
        if (!usuario) throw new Error("Credenciais inválidas");

        const senhaCorreta = await bcrypt.compare(senha, usuario.senha);
        if (!senhaCorreta) throw new Error("Credenciais inválidas");

        const token = jwt.sign(
            { id: usuario.id, nome: usuario.nome },
            process.env.JWT_SECRET,
            { expiresIn: '8h' }
        );

        return { token, usuario: { id: usuario.id, email: usuario.email } };
    }

    async listarUsuarios() {
        return await this.usuarioRepository.listar();
    }

    async atualizarUsuario(id, dadosAtualizados) {
        const usuario = await this.usuarioRepository.buscarId(id);
        if (!usuario) {
            throw new Error("Usuário não encontrado");
        }

        const camposPermitidos = ["nome", "idade", "email" , "dataCadastro", "cpf"];
        const dadosFiltrados = {};

        for (const campo in dadosAtualizados) {
            if (camposPermitidos.includes(campo)) {
                dadosFiltrados[campo] = dadosAtualizados[campo];
            }
        }

        if (Object.keys(dadosFiltrados).length === 0) {
            throw new Error("Nenhum campo válido para atualização");
        }

        return await this.usuarioRepository.atualizar(id, dadosFiltrados);
    }

    async obterPorId(id) {
        const usuario = await this.usuarioRepository.buscarId(id);
        if (!usuario) {
            throw new Error('Usuário não encontrado');
        }
        return usuario;
    }

    async adicionarMoedas(usuarioId, quantidade) {
        if (quantidade <= 0) throw new Error("Valor adicionado não pode ser zero ou negativo");

        const saldoAtual = await this.usuarioRepository.getSaldo(usuarioId);
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

    async adicionarGrupoAoUsuario(usuarioId, grupoId) {
        const usuario = await this.usuarioRepository.buscarId(usuarioId);
        if (!usuario) {
            throw new Error("Usuário não encontrado.");
        }
        return await this.usuarioRepository.adicionarGrupo(usuarioId, grupoId);
    }

    async removerGrupoDoUsuario(usuarioId, grupoId) {
        const usuario = await this.usuarioRepository.buscarId(usuarioId);
        if (!usuario) {
            throw new Error("Usuário não encontrado.");
        }
        return await this.usuarioRepository.removerGrupo(usuarioId, grupoId);
    }

    async removerUsuario(id) {
        const usuario = await this.usuarioRepository.buscarId(id);
        if (!usuario) {
            throw new Error(`Usuário com ID ${id} não encontrado.`);
        }

        return await this.usuarioRepository.removerUsuario(id);
    }
}

module.exports = new UsuarioService();