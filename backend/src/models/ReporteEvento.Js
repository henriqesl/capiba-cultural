const Usuario = require('./Models/Usuario');
const Evento = require('./Models/Evento');

class ReporteEvento {
    constructor(reportante, evento, descricao = '') {
        if (!reportante) throw new Error('Reportante inválido.');
        if (!evento) throw new Error('Evento inválido.');

        this.id = null;
        this.reportante = reportante;
        this.evento = evento;
        this.dataReporte = new Date();
        this.descricao = descricao;
    }
    
    adicionarConfirmacao(usuario) {
        const jaConfirmou = this.reportantes.some(u => u.id === usuario.id);
        if (jaConfirmou) {
            throw new Error('Usuário já confirmou este evento.');
        }
        this.reportantes.push(usuario);
        this.qtdConfirmacoes++;
    }
}

module.exports = ReporteEvento;