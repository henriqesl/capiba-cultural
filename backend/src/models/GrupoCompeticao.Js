const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const Usuario = require('./usuario');

class GrupoCompeticao {
    async novoGrupoCompeticao {
        return await this.prisma.GrupoCompeticao.create({

            
        })


    }


    constructor(nome, dataInicio, dataFim) {
        this.id = null;
        this.nome = nome;
        this.membros = [];
        this.dataInicio = dataInicio instanceof Date ? dataInicio : new Date(dataInicio);
        this.dataFim = dataFim instanceof Date ? dataFim : new Date(dataFim);
        this.encerrado = false;
        this.pontuacaoTotal = 0;
        this.vencedor = null;
    }

    getId(){
        return this.id;
    }
    setId(id) { 
        this.id = id; 
    }
    
    getNome() { 
        return this.nome; 
    }
    setNome(value) { 
        this.nome = value; 
    }

    getMembros() { 
        return this.membros; 
    }
    setMembros(value) { 
        this.membros = value; 
    }

    getDataInicio() { 
        return this.dataInicio; 
    }
    setDataInicio(value) {
        this.dataInicio = value instanceof Date ? value : new Date(value);
    }

    getDataFim() { 
        return this.dataFim; 
    }
    setDataFim(value) {
        this.dataFim = value instanceof Date ? value : new Date(value);
    }

    getEncerrado() { 
        return this.encerrado; 
    }
    setEncerrado(value) { 
        this.encerrado = value; 
    }
    
    getPontuacaoTotal() { 
        return this.pontuacaoTotal; 
    }
    setPontuacaoTotal(value) { 
        this.pontuacaoTotal = value; 
    }
    
    getVencedor() { 
        return this.vencedor; 
    }
    setVencedor(value) { 
        this.vencedor = value; 
    }
}
module.exports = GrupoCompeticao;