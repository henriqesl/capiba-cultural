const EventoService = require('../services/EventoService');
const UsuarioService = require('../services/UsuarioService');
const ConectaAPI = require('./ConectaAPI');

class CheckInService {
  constructor() {
    this.eventoService = new EventoService();
    this.usuarioService = new UsuarioService();
    this.conectaAPI = ConectaAPI;
  }

  async realizarCheckIn(usuarioId, eventoId) {

    const usuario = await this.usuarioService.obterPorId(usuarioId);
    if (!usuario) throw new Error("Usuário não encontrado");

    const evento = await this.eventoService.obterPorId(eventoId);
    if (!evento) throw new Error("Evento não encontrado");

    // 🔐 Login técnico no Conecta
    await this.conectaAPI.autenticar(
      process.env.CONECTA_USER,
      process.env.CONECTA_PASSWORD
    );

    const payload = {
      userIdentifier: usuario.cpf,
      eventName: evento.nome,
      checkInDateTime: new Date().toISOString(),
      cidade: "Recife",
      bairro: "Centro",
      rua: evento.local,
      identifier: `EVENTO-${evento.id}-USER-${usuario.id}`,
      document: usuario.cpf
    };

    const respostaConecta = await this.conectaAPI.fazerCheckIn(payload);

    const moedasGanhas = evento.pequenoPorte ? 10 : 20;
    await this.usuarioService.adicionarMoedas(usuarioId, moedasGanhas);

    return {
      moedasGanhas,
      conecta: respostaConecta
    };
  }
}

module.exports = new CheckInService();
