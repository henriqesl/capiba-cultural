class Caravana {

    constructor(id, nome, data, eventoDestinoId, bonusPorParticipante = 10, membros = [], eventoDestino = null) {
        // Campos de Caravana
        this.id = id;
        this.nome = nome;
        // Conversão: garante que o campo 'data' é um objeto Date (útil para manipulação)
        this.data = data ? new Date(data) : null; 
        this.bonusPorParticipante = bonusPorParticipante;
        
        // Relacionamentos e Chaves Estrangeiras:
        this.eventoDestinoId = eventoDestinoId; 
        this.eventoDestino = eventoDestino; 
        this.membros = membros;
    }
    
    static fromPrisma(prismaData) {
        if (!prismaData) return null;

        // O Prisma geralmente retorna a data como um objeto Date
        const dataCaravana = prismaData.data || new Date(); 

        return new Caravana(
            prismaData.id,
            prismaData.nome,
            dataCaravana,
            prismaData.eventoDestinoId,
            prismaData.bonusPorParticipante,
            prismaData.membros, 
            prismaData.eventoDestino
        );
    }
    
    get resumo() {
        return `Caravana: ${this.nome} (ID: ${this.id}) | Destino: ${this.eventoDestino?.nome || this.eventoDestinoId}`;
    }
}

module.exports = Caravana;
