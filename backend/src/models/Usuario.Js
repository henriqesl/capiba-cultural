const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();


 class Usuario {

    async buscarId(id) {
        return await prisma.usuario.findUnique({
            where: { id: id },
            include: {caravanas_membro: true}
        });
   
    }

    async buscarEmail(email) {
        return await prisma.usuario.findUnique({
            where: { email: email }
        });
   
    }

    async novoUsuario(nome, email, senha, cpf) { 
        return await prisma.usuario.create({
            data: {
                nome,
                email,
                senha,
                cpf,
                saldoMoedaCapiba: 0,
                dataCadastro: new Date(),
                },
            });
    }

    async removerUsuario(id) {
        return await prisma.usuario.delete({
            where: { id: id }
        })
      
    }

    async listar() {
        return await prisma.usuario.findMany({
            include: { grupos_membro: true, grupos_vencidos: true, caravanas_membro:true }
        });
    }
    
    async atualizar(id, dados) {
        return await prisma.usuario.update({
            where: { id },
            data: dados
        });
    }


    async getSaldo(id) {
        const usuario = await prisma.usuario.findUnique({
            where: { id: id },
            select: { saldoMoedaCapiba: true },
        });

        return usuario?.saldoMoedaCapiba ?? 0;

    }

   async setSaldo(id, saldo) {
        if (saldo < 0) throw new Error("Saldo não pode ser negativo");
        return await prisma.usuario.update({
            where: { id },
            data: { saldoMoedaCapiba: saldo },
        });
    }
    
    async adicionarGrupo(usuarioId, grupoId) {
        return await prisma.usuario.update({
            where: { id: usuarioId },
            data: {
                grupos_membro: {
                    connect: { id: grupoId }
                }
            },
            include: { grupos_membro: true }
        });
    }
    
    async removerGrupo(usuarioId, grupoId) {
        return await prisma.usuario.update({
            where: { id: usuarioId },
            data: {
                grupos_membro: {
                    disconnect: { id: grupoId }
                }
            },
            include: { grupos_membro: true }
        });
    }

    async getNome(id) {
        const usuario = await prisma.usuario.findUnique({
           where: { id: id },
            select: {  nome: true }
        })

        return usuario?.nome ?? null;

    }

    async setNome(id, nome) {
        return await prisma.usuario.update({
           where: { id: id },
           data: { nome: nome},
           select: {  nome: true }
        })
    }


}


module.exports = Usuario;