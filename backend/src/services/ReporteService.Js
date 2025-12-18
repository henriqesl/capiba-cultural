const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();
const eventoService = require("./EventoService");
const ReporteEvento = require("../models/ReporteEvento");

class ReporteService {
    constructor() {
        this.reporteEventoRepository = new ReporteEvento();
        this.eventoService = eventoService;
    }

    async criarOuConfirmarReporte(reportanteId, eventoInput, descricao = "") {
        if (!reportanteId || !eventoInput) {
            throw new Error("Reportante e evento são obrigatórios para criar um reporte!");
        }

        let evento = null;
        try {
            evento = await this.eventoService.obterPorNome(eventoInput.nome);
        } catch (error) {
            if (error.message !== "Evento não encontrado") {
                console.error("Erro inesperado na busca do evento:", error);
                throw error;
            }
        }

        if (!evento) {
            const nome = eventoInput.nome || "Evento sem nome";
            const local = eventoInput.local || "Local não informado";
            const data = eventoInput.data ? new Date(eventoInput.data) : new Date();
            const descricaoEvento = eventoInput.descricao || `Reporte de evento em ${new Date().toISOString()}`;

            evento = await this.eventoService.criarEvento(
                nome, local, data, descricaoEvento,
                false, true, false, 0, true,
                eventoInput.valor || "Gratuito",
                eventoInput.faixaEtaria || 0,
                false,
                eventoInput.horario || null,
                eventoInput.imagemUrl || null,
                eventoInput.latitude, eventoInput.longitude
            );
        }

        const cincoMinutosAtras = new Date(Date.now() - 5 * 60 * 1000);

        const existeReporteRecente = await prisma.reporteEvento.findFirst({
            where: {
                eventoId: evento.id,
                confirmadores: { some: { id: reportanteId } },
                dataReporte: { gte: cincoMinutosAtras },
            },
        });

        if (existeReporteRecente) {
            throw new Error("Você já enviou um reporte recentemente. Aguarde alguns minutos.");
        }

        // 3️⃣ Criar um novo reporte para este usuário
        const novoReporte = await prisma.reporteEvento.create({
            data: {
                descricao,
                dataReporte: new Date(),
                qtdConfirmacoes: 1,
                evento: { connect: { id: evento.id } },
                reportante: { connect: { id: reportanteId } },
                confirmadores: { connect: { id: reportanteId } },
            },
            include: { evento: true, reportante: true, confirmadores: true },
        });

        return {
            mensagem: "Novo evento reportado com sucesso.",
            reporte: novoReporte,
        };
    }

    listarReportes() {
        return this.reporteEventoRepository.listar();
    }

    async listarPorEvento(eventoId) {
        return await prisma.reporteEvento.findMany({
            where: { eventoId: Number(eventoId) },
            include: { 
                evento: true, 
                confirmadores: true,
                // Aqui é onde usamos o reportanteId para trazer os dados do autor
                reportante: {
                    select: {
                        id: true,
                        nome: true,
                        fotoUrl: true // Certifique-se que este campo existe no seu schema de usuário
                    }
                }
            },
            orderBy: { dataReporte: 'asc' } // O primeiro reporte (menor data) é o criador
        });
    }

    async listarPorUsuario(usuarioId) {
        return await prisma.reporteEvento.findMany({
            where: {
                OR: [
                    { reportanteId: usuarioId },
                    { confirmadores: { some: { id: usuarioId } } },
                ],
            },
            include: { evento: true, confirmadores: true },
        });
    }

    async removerReporte(id) {
        const existe = await this.reporteEventoRepository.buscarPorId(id);
        if (!existe) return false;
        this.reporteEventoRepository.remover(id);
        return true;
    }

    async listarEventosMaisReportados() {
        const vinteQuatroHorasAtras = new Date(Date.now() - 24 * 60 * 60 * 1000);

        const reportesRecentes = await prisma.reporteEvento.findMany({
            where: { dataReporte: { gte: vinteQuatroHorasAtras } },
            include: { evento: true },
        });

        const contagem = {};

        for (const r of reportesRecentes) {
            const eventoId = r.eventoId;
            contagem[eventoId] = (contagem[eventoId] || 0) + r.qtdConfirmacoes;
        }

        return Object.entries(contagem)
            .sort((a, b) => b[1] - a[1])
            .map(([eventoId, total]) => ({
                eventoId: Number(eventoId),
                totalReportes: total,
            }));
    }
}

module.exports = ReporteService;
