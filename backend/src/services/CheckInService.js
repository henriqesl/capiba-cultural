const EventoService = require('./EventoService');
const UsuarioService = require('./UsuarioService');
const ConectaAPI = require('./ConectaAPI');
const GrupoService = require('./GrupoService');

class CheckInService {
    constructor() {
        this.eventoService = EventoService;
        this.usuarioService = UsuarioService;
        this.conectaAPI = ConectaAPI;
        this.grupoService = GrupoService;
    }

    async realizarCheckIn(usuarioId, eventoId) {
        const usuario = await this.usuarioService.obterPorId(usuarioId);
        if (!usuario) throw new Error('Usuário não encontrado');

        const evento = await this.eventoService.obterPorId(eventoId);
        if (!evento) throw new Error('Evento não encontrado');

        await this.conectaAPI.autenticar(process.env.CONECTA_USER, process.env.CONECTA_PASSWORD);

        const payload = {
            userIdentifier: usuario.cpf,
            eventName: evento.nome,
            checkInDateTime: new Date().toISOString(),
            cidade: 'Recife',
            bairro: 'Centro',
            rua: evento.local,
            identifier: `EVENTO-${evento.id}-USER-${usuario.id}`,
            document: usuario.cpf,
        };

        const respostaConecta = await this.conectaAPI.fazerCheckIn(payload);

        const moedasGanhas = evento.pequenoPorte ? 10 : 20;
        await this.usuarioService.adicionarMoedas(usuarioId, moedasGanhas);

        await this.grupoService.incrementarPontuacaoGrupoPorUsuario(usuarioId, moedasGanhas);

        return {
            moedasGanhas,
            conecta: respostaConecta,
        };
    }
}

module.exports = new CheckInService();
