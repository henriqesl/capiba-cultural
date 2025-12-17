const CheckIn = require("../models/CheckIn");
const ConectaAPI = require("./ConectaAPI");

class CheckInService {
  constructor() {
    this.checkInRepository = new CheckIn();
    this.conectaAPI = ConectaAPI;
  }

  async realizarCheckIn(usuarioId, eventoId) {
    if (!usuarioId || !eventoId) throw new Error("IDs obrigatórios.");

    // 🚨 LAZY LOADING: Importa serviços aqui dentro para evitar crash
    const UsuarioServiceClass = require("./UsuarioService");
    const GrupoServiceClass = require("./GrupoService");
    const MissaoServiceClass = require("./MissaoService");
    
    // Tenta importar EventoService (pode ser classe ou instância dependendo do arquivo)
    const eventoServiceModule = require("./EventoService");
    // Se for uma instância, usa direto. Se for classe, dá new.
    const eventoService = (typeof eventoServiceModule === 'function') 
        ? new eventoServiceModule() 
        : eventoServiceModule;

    const usuarioService = new UsuarioServiceClass();
    const grupoService = new GrupoServiceClass();
    const missaoService = new MissaoServiceClass();

    // 1. TRAVA: Verifica se já fez check-in
    const jaFezCheckIn = await this.checkInRepository.verificarCheckInExistente(usuarioId, eventoId);
    if (jaFezCheckIn) {
      throw new Error("Você já fez check-in neste evento!");
    }

    // 2. BUSCAS DE DADOS
    const usuario = await usuarioService.obterPorId(usuarioId);
    if (!usuario) throw new Error("Usuário não encontrado");

    // Precisamos do objeto evento completo para verificar a Categoria (Rock, Samba...)
    const evento = await eventoService.obterPorId(eventoId);
    if (!evento) throw new Error("Evento não encontrado");

    // 3. API EXTERNA (Conecta)
    try {
        await this.conectaAPI.autenticar(
          process.env.CONECTA_USER, process.env.CONECTA_PASSWORD
        );
        const payload = {
          userIdentifier: usuario.cpf,
          eventName: evento.nome,
          checkInDateTime: new Date().toISOString(),
          cidade: "Recife", identifier: `EV-${evento.id}-US-${usuario.id}`,
        };
        await this.conectaAPI.fazerCheckIn(payload);
    } catch (error) {
        console.error("Aviso ConectaAPI:", error.message);
    }

    // 4. SALVAR CHECK-IN (Essencial salvar ANTES de contar locais únicos)
    const novoCheckIn = await this.checkInRepository.criar(usuarioId, eventoId);

    // 5. MOEDAS E PONTOS
    const moedasGanhas = (evento.pequenoPorte) ? 10 : 20; 
    await usuarioService.adicionarMoedas(usuarioId, moedasGanhas);

    if (usuario.grupoId) {
        if (grupoService.incrementarPontuacaoGrupoPorUsuario) {
            await grupoService.incrementarPontuacaoGrupoPorUsuario(usuarioId, 10);
        } else {
            // Fallback se o método tiver nome antigo
            await grupoService.incrementarPontuacaoGrupo(usuario.grupoId, 10);
        }
    }

    // 6. GAMIFICAÇÃO 🚀
    // Chama o serviço de missões passando o evento atual
    await missaoService.processarProgresso(usuarioId, 'CHECKIN', evento);

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