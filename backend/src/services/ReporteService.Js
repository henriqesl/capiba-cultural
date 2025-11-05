const EventoService = require('./EventoService');
const ReporteEvento = require('../models/ReporteEvento');

class ReporteService {
    constructor() {
        this.reportes = [];
        this.nextId = 1;
    }

    async criarOuConfirmarReporte(reportante, eventoInput, descricao = '') {
        if (!reportante || !eventoInput) {
            throw new Error("Reportante e evento são obrigatórios para criar um reporte!");
        }

        let evento = EventoService.listarEventos()
            .find(e => e.getNome().toLowerCase() === eventoInput.nome.toLowerCase());

        if (!evento) {
            console.log("Evento não encontrado. Criando novo evento...");

            const nome = eventoInput.nome || 'Evento sem nome';
            const local = eventoInput.local || 'Local não informado';
            const data = eventoInput.data ? new Date(eventoInput.data) : new Date();
            const descricaoEvento = eventoInput.descricao || 'Evento reportado por usuário';

            evento = EventoService.criarEvento(nome, local, data, descricaoEvento);
            evento.setReportadoPorUsuario(true);
        }

        const existente = this.reportes.find(r => r.getEvento().getId() === evento.getId());

        if (existente) {
            const jaConfirmou = existente.getReportantes().some(u => u.getId() === reportante.getId());
            if (jaConfirmou) {
                return { mensagem: 'Usuário já reportou/confirmou este evento.', reporte: existente };
            }

            existente.getReportantes().push(reportante);
            existente.setQtdConfirmacoes(existente.getQtdConfirmacoes() + 1);
            return {
                mensagem: 'Confirmação adicionada a um evento já reportado.',
                reporte: existente
            };
        }

        const agora = new Date();
        const cincoMinutosAtras = new Date(agora.getTime() - 5 * 60 * 1000);

        const existeReporteRecente = this.reportes.some(r =>
            r.getEvento().getId() === evento.getId() &&
            r.getReportantes().some(u => u.getId() === reportante.getId()) &&
            r.getDataReporte() > cincoMinutosAtras
        );

        if (existeReporteRecente) {
            throw new Error("Você já enviou um reporte recentemente. Aguarde alguns minutos.");
        }

        const reporte = new ReporteEvento(reportante, evento, descricao);
        reporte.setId(this.nextId++);
        reporte.setReportantes([reportante]);
        reporte.setQtdConfirmacoes(1);
        this.reportes.push(reporte);

        return {
            mensagem: 'Novo evento reportado com sucesso.',
            reporte
        };
    }

    listarReportes() {
        return this.reportes;
    }

    listarPorEvento(eventoId) {
        return this.reportes.filter(r => r.getEvento().getId() === eventoId);
    }

    listarPorUsuario(usuarioId) {
        return this.reportes.filter(r => r.getReportantes().some(u => u.getId() === usuarioId));
    }

    removerReporte(id) {
        const index = this.reportes.findIndex(r => r.getId() === id);
        if (index === -1) return false;
        this.reportes.splice(index, 1);
        return true;
    }

    listarEventosMaisReportados() {
        const agora = new Date();
        const vinteQuatroHorasAtras = new Date(agora.getTime() - 24 * 60 * 60 * 1000);

        const reportesRecentes = this.reportes.filter(r => r.getDataReporte() > vinteQuatroHorasAtras);
        const contagem = {};

        for (const r of reportesRecentes) {
            contagem[r.getEvento().getId()] = (contagem[r.getEvento().getId()] || 0) + r.getQtdConfirmacoes();
        }

        return Object.entries(contagem)
            .sort((a, b) => b[1] - a[1])
            .map(([eventoId, total]) => ({
                eventoId: Number(eventoId),
                totalReportes: total
            }));
    }
}

module.exports = ReporteService;
