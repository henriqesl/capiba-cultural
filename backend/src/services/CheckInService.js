const CheckIn = require("../models/CheckIn");
const ConectaAPI = require("./ConectaAPI");

class CheckInService {
  constructor() {
    this.checkInRepository = new CheckIn();
    this.conectaAPI = ConectaAPI;
  }

  async realizarCheckIn(usuarioId, eventoId) {
    if (!usuarioId || !eventoId) throw new Error("IDs obrigatórios.");

    // 🚨 LAZY LOADING (Evita Crash)
    const UsuarioServiceClass = require("./UsuarioService");
    const EventoServiceClass = require("./EventoService");
    const GrupoServiceClass = require("./GrupoService");
    const MissaoServiceClass = require("./MissaoService"); // Nova integração

    const usuarioService = new UsuarioServiceClass();
    const eventoService = new EventoServiceClass();
    const grupoService = new GrupoServiceClass();
    const missaoService = new MissaoServiceClass();

    // 1. TRAVA: Verifica duplicidade
    const jaFezCheckIn = await this.checkInRepository.verificarCheckInExistente(usuarioId, eventoId);
    if (jaFezCheckIn) {
      throw new Error("Você já fez check-in neste evento!");
    }

    // 2. BUSCAS
    const usuario = await usuarioService.obterPorId(usuarioId);
    if (!usuario) throw new Error("Usuário não encontrado");

    const evento = await eventoService.obterPorId(eventoId);
    if (!evento) throw new Error("Evento não encontrado");

    // 3. API EXTERNA (Conecta)
    try {
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
          rua: evento.local || "Local do Evento",
          identifier: `EVENTO-${evento.id}-USER-${usuario.id}`,
          document: usuario.cpf,
        };
    
        await this.conectaAPI.fazerCheckIn(payload);

    } catch (error) {
        console.error("Aviso: Falha na integração ConectaAPI:", error.message);
    }

    // 4. RECOMPENSAS DIRETAS (Moedas do Evento)
    const moedasGanhas = (evento.pequenoPorte) ? 10 : 20; 
    await usuarioService.adicionarMoedas(usuarioId, moedasGanhas);

    // Pontuação de Grupo
    if (usuario.grupoId) {
        await grupoService.incrementarPontuacaoGrupoPorUsuario(usuarioId, 10);
    }

    // 5. MISSÕES (Gamificação) 🚀
    // Avisa o serviço de missões que um check-in ocorreu
    await missaoService.processarProgresso(usuarioId, 'CHECKIN');

    // 6. SALVAR NO BANCO LOCAL
    const novoCheckIn = await this.checkInRepository.criar(usuarioId, eventoId);

    return {
        checkIn: novoCheckIn,
        moedasGanhas,
        mensagem: "Check-in realizado com sucesso!"
    };
  }

  async listarHistorico(usuarioId) {
    return await this.checkInRepository.listarPorUsuario(usuarioId);
  }
}

module.exports = new CheckInService();