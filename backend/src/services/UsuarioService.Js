const { PrismaClient } = require('@prisma/client');

class UsuarioService {

    constructor() {
        this.prisma = new PrismaClient();               
    }


    // FUNÇÃO CRIAR USUÁRIO
    async criarUsuario(nome, email, senha) {

        if (!nome || !email || !senha) throw new Error("Todos os campos são obrigatórios");

        try {
            // cria um novo usuário no banco de dados
            const novoUsuario = await this.prisma.usuario.create({
                data: {
                    nome: nome,
                    email: email,
                    senha: senha
                }
            });
        return novoUsuario;

    }  catch (error) {
            // caso do erro for relacionado ao email duplicado
            if (error.code === 'P2002' && error.meta?.target.includes('email')) {
                throw new Error("E-mail já cadastrado");
            }
            throw error; // Lança outros erros

        }
    }

    // FUNÇÃO LISTAS USUÁRIOS
    async listarUsuarios() {
        return await this.prisma.usuario.findMany();
    }

    // FUNÇÃO OBTER POR ID
    async obterPorId(id) {

        // garante que será uma id formada unicamente por números
        const numericId = parseInt(id, 10);
        if (isNaN(numericId)) throw new Error("ID inválido, deve ser um número.");
        const usuario = await this.prisma.usuario.findUnique({
            where: {

                id: numericId
            }
        });

        if (!usuario) {
            throw new Error("Usuário não encontrado");
        }
        return usuario;

    }        

    async adicionarMoedas(usuarioId, quantidade) {
        const numericId = parseInt(usuarioId, 10);
        if (isNaN(numericId)) throw new Error("ID de usuário inválido.");
        if (quantidade <= 0) throw new Error("Valor adicionado não pode ser zero ou negativo");

        try {
            const usuarioAtualizado = await this.prisma.usuario.update({
                where: {
                    id: numericId
                },
                data: {
                    saldoMoedaCapiba: {
                        increment: quantidade // O banco de dados faz a soma
                    }
                }
            });
            return usuarioAtualizado;


        } catch (error) {
            if (error.code === 'P2025') {
                throw new Error("Usuário não encontrado");
            }
            throw error;
        }
    }

    // FUNÇÃO GASTAR MOEDAS
    async gastarMoedas(usuarioId, quantidade) {
        const numericId = parseInt(usuarioId, 10);
        if (isNaN(numericId)) throw new Error("ID de usuário inválido.");
        if (quantidade <= 0) throw new Error("Valor a gastar não pode ser zero ou negativo");

        try {
            const usuarioAtualizado = await this.prisma.usuario.update({
                where: {
                    id: numericId,
                    saldoMoedaCapiba: {
                        gte: quantidade // gte = "maior ou igual a" 
                    }
                },
                data: {
                    saldoMoedaCapiba: {
                        decrement: quantidade // O banco de dados faz a subtração
                    }
                }
            });

            return usuarioAtualizado;

        } catch (error) {
            // Isso falha se o ID não existe OU se o saldo é insuficiente
            if (error.code === 'P2025') {
                const usuarioExiste = await this.prisma.usuario.findUnique({ where: { id: numericId } });
                if (!usuarioExiste) {
                    throw new Error("Usuário não encontrado");
                } else {
                    throw new Error("Usuário não pode gastar mais moedas capibas do que já tem");
                }
            }
            throw error;
        }

    }

    async removerUsuario(id) {
            const numericId = parseInt(id, 10);
            if (isNaN(numericId)) throw new Error("ID de usuário inválido.");

            try {
                await this.prisma.usuario.delete({
                    where: {
                        id: numericId
                    }

                });

                return true; 

            } catch (error) {
                // no caso de usuário não encontrado
                if (error.code === 'P2025') {
                    return false; 
                }
        }
    }
}



module.exports = UsuarioService;