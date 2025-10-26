const { PrismaClient } = require('@prisma/client');
const Usuario = require('../models/Usuario');

class UsuarioService {
    constructor() {
        this.prisma = new PrismaClient();
    }

    async criarUsuario(nome, email, senha) {
        if (!nome || !email || !senha) throw new Error("Todos os campos são obrigatórios");

        try {
            const novoUsuario = await this.prisma.usuario.create({
                data: { nome, email, senha }
            });
            return Usuario.fromPrisma(novoUsuario);

        } catch (error) {
            if (error.code === 'P2002' && error.meta?.target.includes('email')) {
                throw new Error("E-mail já cadastrado");
            }
            throw error;
        }
    }

    async listarUsuarios() {
        const usuarios = await this.prisma.usuario.findMany();
        return usuarios.map(u => Usuario.fromPrisma(u));
    }

    async obterPorId(id) {
        const numericId = parseInt(id, 10);
        if (isNaN(numericId)) throw new Error("ID inválido, deve ser um número.");

        const usuario = await this.prisma.usuario.findUnique({ where: { id: numericId } });
        if (!usuario) throw new Error("Usuário não encontrado");

        return Usuario.fromPrisma(usuario);
    }

    async adicionarMoedas(usuarioId, quantidade) {
        const numericId = parseInt(usuarioId, 10);
        if (isNaN(numericId)) throw new Error("ID de usuário inválido.");
        if (quantidade <= 0) throw new Error("Valor adicionado não pode ser zero ou negativo");

        try {
            const usuarioAtualizado = await this.prisma.usuario.update({
                where: { id: numericId },
                data: { saldoMoedaCapiba: { increment: quantidade } }
            });
            return Usuario.fromPrisma(usuarioAtualizado);

        } catch (error) {
            if (error.code === 'P2025') throw new Error("Usuário não encontrado");
            throw error;
        }
    }

    async gastarMoedas(usuarioId, quantidade) {
        const numericId = parseInt(usuarioId, 10);
        if (isNaN(numericId)) throw new Error("ID de usuário inválido.");
        if (quantidade <= 0) throw new Error("Valor a gastar não pode ser zero ou negativo");

        try {
            const usuarioAtualizado = await this.prisma.usuario.update({
                where: { id: numericId },
                data: { saldoMoedaCapiba: { decrement: quantidade } }
            });
            return Usuario.fromPrisma(usuarioAtualizado);

        } catch (error) {
            if (error.code === 'P2025') {
                const existe = await this.prisma.usuario.findUnique({ where: { id: numericId } });
                if (!existe) throw new Error("Usuário não encontrado");
                throw new Error("Usuário não pode gastar mais moedas do que possui");
            }
            throw error;
        }
    }

    async removerUsuario(id) {
        const numericId = parseInt(id, 10);
        if (isNaN(numericId)) throw new Error("ID de usuário inválido.");

        try {
            await this.prisma.usuario.delete({ where: { id: numericId } });
            return true;
        } catch (error) {
            if (error.code === 'P2025') return false;
            throw error;
        }
    }
}

module.exports = UsuarioService;
