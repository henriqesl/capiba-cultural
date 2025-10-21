const ReporteEvento = require('../models/ReporteEvento');
const EventoService = require('./EventoService');

class ReporteService {
    constructor(eventoService) {
        this.reportes = [];
        this.nextId = 1;
        this.eventoService = eventoService;
    }

    criarOuConfirmarReporte(reportante, eventoInput, descricao = '') {
        if (!reportante || !eventoInput) {
            throw new Error("Reportante e evento são obrigatórios para criar um reporte!");
        }

        let evento = null;

        if (eventoInput.id) {
            evento = this.eventoService.listarEventos().find(e => e.id === eventoInput.id);
        } else {
            evento = this.eventoService.listarEventos()
                .find(e => e.nome.toLowerCase() === eventoInput.nome.toLowerCase());
        }

        if (!evento) {
            const nome = eventoInput.nome || 'Evento sem nome';
            const local = eventoInput.local || 'Local não informado';
            const data = eventoInput.data ? new Date(eventoInput.data) : new Date();
            const descricao = eventoInput.descricao || 'Evento reportado por usuário';

            evento = this.eventoService.criarEvento(nome, local, data, descricao);
            evento.reportadoPorUsuario = true;
        }

        const existente = this.reportes.find(r => r.evento.id === evento.id);

        if (existente) {
            const jaConfirmou = existente.reportantes.some(u => u.id === reportante.id);
            if (jaConfirmou) {
                throw new Error('Usuário já reportou/confirmou esse evento.');
            }

            existente.reportantes.push(reportante);
            existente.qtdConfirmacoes++;
            return {
                mensagem: 'Confirmação adicionada a um evento já reportado.',
                reporte: existente
            };
        }

        const agora = new Date();
        const cincoMinutosAtras = new Date(agora.getTime() - 5 * 60 * 1000);

        const existeReporteRecente = this.reportes.some(r =>
            r.evento.id === evento.id &&
            r.reportantes.some(u => u.id === reportante.id) &&
            r.dataReporte > cincoMinutosAtras
        );


        if (existeReporteRecente) {
            throw new Error("Você já enviou um reporte recentemente. Aguarde alguns minutos.");
        }

        const reporte = new ReporteEvento(reportante, evento, descricao);
        reporte.id = this.nextId++;
        reporte.reportantes = [reportante];
        reporte.qtdConfirmacoes = 1;
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
        return this.reportes.filter(r => r.evento.id === eventoId);
    }

    listarPorUsuario(usuarioId) {
        return this.reportes.filter(r => r.reportantes.some(u => u.id === usuarioId));
    }

    removerReporte(id) {
        const index = this.reportes.findIndex(r => r.id === id);
        if (index === -1) return false;
        this.reportes.splice(index, 1);
        return true;
    }

    listarEventosMaisReportados() {
        const agora = new Date();
        const vinteQuatroHorasAtras = new Date(agora.getTime() - 24 * 60 * 60 * 1000);

        const reportesRecentes = this.reportes.filter(r => r.dataReporte > vinteQuatroHorasAtras);
        const contagem = {};

        for (const r of reportesRecentes) {
            contagem[r.evento.id] = (contagem[r.evento.id] || 0) + r.qtdConfirmacoes;
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