const { PrismaClient } = require('@prisma/client');
const ReporteEvento = require('./models/ReporteEvento');
const EventoService = require('../EventoService');
const UsuarioService = require('../UsuarioService');

class ReporteService {
    constructor() {
        this.prisma = new PrismaClient();
        this.eventoService = new EventoService();
        this.usuarioService = new UsuarioService();
    }

    async criarOuConfirmarReporte(reportanteId, eventoInput, descricao = '') {
        if (!reportanteId || !eventoInput) {
            throw new Error("Reportante e evento são obrigatórios para criar um reporte!");
        }

        const reportante = await this.usuarioService.obterPorId(reportanteId);

        let evento = null;

        if (eventoInput.id) {
            evento = await this.eventoService.obterPorId(eventoInput.id);
        } else {
            const eventos = await this.eventoService.listarEventos();
            evento = eventos.find(e => e.nome.toLowerCase() === eventoInput.nome.toLowerCase());
        }

        if (!evento) {
            evento = await this.eventoService.criarEvento(
                eventoInput.nome || 'Evento sem nome',
                eventoInput.local || 'Local não informado',
                eventoInput.data ? new Date(eventoInput.data) : new Date(),
                eventoInput.descricao || 'Evento reportado por usuário',
                eventoInput.pequenoPorte || true,
                true 
            );
        }

        const existente = await this.prisma.reporteEvento.findFirst({
            where: {
                eventoId: evento.id,
                reportanteId: reportante.id
            }
        });

        if (existente) {
            throw new Error("Usuário já reportou esse evento recentemente.");
        }

        const novoReporte = await this.prisma.reporteEvento.create({
            data: {
                descricao,
                reportanteId: reportante.id,
                eventoId: evento.id
            },
            include: {
                reportante: true,
                evento: true
            }
        });

        return ReporteEvento.fromPrisma(novoReporte);
    }

    async listarReportes() {
        const reportes = await this.prisma.reporteEvento.findMany({
            include: {
                reportante: true,
                evento: true
            }
        });
        return reportes.map(r => ReporteEvento.fromPrisma(r));
    }

    async listarPorEvento(eventoId) {
        const reportes = await this.prisma.reporteEvento.findMany({
            where: { eventoId: parseInt(eventoId, 10) },
            include: {
                reportante: true,
                evento: true
            }
        });
        return reportes.map(r => ReporteEvento.fromPrisma(r));
    }

    async listarPorUsuario(usuarioId) {
        const reportes = await this.prisma.reporteEvento.findMany({
            where: { reportanteId: parseInt(usuarioId, 10) },
            include: {
                reportante: true,
                evento: true
            }
        });
        return reportes.map(r => ReporteEvento.fromPrisma(r));
    }

    async removerReporte(id) {
        const numericId = parseInt(id, 10);
        if (isNaN(numericId)) throw new Error("ID inválido.");

        try {
            await this.prisma.reporteEvento.delete({ where: { id: numericId } });
            return true;
        } catch (error) {
            if (error.code === 'P2025') return false;
            throw error;
        }
    }

    async listarEventosMaisReportados() {
        const agregados = await this.prisma.reporteEvento.groupBy({
            by: ['eventoId'],
            _count: { eventoId: true },
            orderBy: { _count: { eventoId: 'desc' } }
        });

        return agregados.map(a => ({
            eventoId: a.eventoId,
            totalReportes: a._count.eventoId
        }));
    }
}

module.exports = ReporteService;
