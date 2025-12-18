const CheckIn = require("../models/CheckIn");
const ConectaAPI = require("./ConectaAPI");

class CheckInService {
  constructor() {
    this.checkInRepository = new CheckIn();
    this.conectaAPI = ConectaAPI;
  }

  async realizarCheckIn(usuarioId, eventoId) {
    if (!usuarioId || !eventoId) throw new Error("IDs obrigatórios.");

    const UsuarioServiceClass = require("./UsuarioService");
    const GrupoServiceClass = require("./GrupoService");
    const MissaoServiceClass = require("./MissaoService");

    const eventoServiceModule = require("./EventoService");

    const eventoService =
      typeof eventoServiceModule === "function"
        ? new eventoServiceModule()
        : eventoServiceModule;

    const usuarioService = new UsuarioServiceClass();
    const grupoService = new GrupoServiceClass();
    const missaoService = new MissaoServiceClass();

    const jaFezCheckIn = await this.checkInRepository.verificarCheckInExistente(
      usuarioId,
      eventoId,
    );
    if (jaFezCheckIn) {
      throw new Error("Você já fez check-in neste evento!");
    }

    const usuario = await usuarioService.obterPorId(usuarioId);
    if (!usuario) throw new Error("Usuário não encontrado");

    const evento = await eventoService.obterPorId(eventoId);
    if (!evento) throw new Error("Evento não encontrado");

    try {
      await this.conectaAPI.autenticar(
        process.env.CONECTA_USER,
        process.env.CONECTA_PASSWORD,
      );
      const payload = {
        userIdentifier: usuario.cpf,
        eventName: evento.nome,
        checkInDateTime: new Date().toISOString(),
        cidade: "Recife",
        identifier: `EV-${evento.id}-US-${usuario.id}`,
      };
      await this.conectaAPI.fazerCheckIn(payload);
    } catch (error) {
      console.error("Aviso ConectaAPI:", error.message);
    }

    const novoCheckIn = await this.checkInRepository.criar(usuarioId, eventoId);

    const moedasGanhas = evento.pequenoPorte ? 10 : 20;
    await usuarioService.adicionarMoedas(usuarioId, moedasGanhas);

    if (usuario.grupoId) {
      if (grupoService.incrementarPontuacaoGrupoPorUsuario) {
        await grupoService.incrementarPontuacaoGrupoPorUsuario(usuarioId, 10);
      } else {
        await grupoService.incrementarPontuacaoGrupo(usuario.grupoId, 10);
      }
    }

    await missaoService.processarProgresso(usuarioId, "CHECKIN", evento);

    return {
      checkIn: novoCheckIn,
      moedasGanhas,
      mensagem: "Check-in realizado com sucesso!",
    };
  }

  async listarHistorico(usuarioId) {
    return await this.checkInRepository.listarPorUsuario(usuarioId);
  }
}

module.exports = new CheckInService();
