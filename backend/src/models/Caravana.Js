class Caravana {

    constructor(id, nome, data, eventoDestinoId, bonusPorParticipante = 10, membros = [], eventoDestino = null) {
        // Campos de Caravana
        this.id = id;
        this.nome = nome;
        // Conversão: garante que o campo 'data' é um objeto Date (útil para manipulação)
        this.data = data ? new Date(data) : null; 
        this.bonusPorParticipante = bonusPorParticipante;
        
        // Relacionamentos e Chaves Estrangeiras:
        this.eventoId = eventoId;
        this.evento = evento;
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
            prismaData.bonusPorParticipante,
            prismaData.membros, 
            prismaData.eventoId,
            prismaData.evento
        );
    }
    
    get resumo() {
        return `Caravana: ${this.nome} (ID: ${this.id}) | Destino: ${this.evento?.nome || this.eventoDestinoId}`;
    }
}

module.exports = Caravana;
