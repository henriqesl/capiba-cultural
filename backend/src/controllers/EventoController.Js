const eventoService = require("../services/EventoService");

class EventoController {
  async criarEvento(req, res) {
    const {
      nome,
      local,
      data,
      descricao,
      pequenoPorte = false,
      reportadoPorUsuario = false,
      aoVivo = false,
      moedasCapibasDestribuidas = 0,
      ativo=true,
      preco,
      faixaEtaria,
      precisaInscricao,
      horario,
      imagemUrl: imagemUrlBody,
      latitude,
      longitude
    } = req.body;
  
    const imagemUrlFinal = (req.file && req.file.filename) ? `uploads/${req.file.filename}` : imagemUrlBody;

    const ativoFinal = ativo === 'true';
    const pequenoPorteFinal = pequenoPorte === 'true';
    const reportadoPorUsuarioFinal = reportadoPorUsuario === 'true';
    const aoVivoFinal = aoVivo === 'true';
    const precisaInscricaoFinal = precisaInscricao === 'true';


    if (imagemUrlFinal) {
        console.log("Multer recebeu e o caminho final é:", imagemUrlFinal);
    } else {
        console.log("Nenhum arquivo de imagem foi enviado.");
    }

    const moedasCapibasDestribuidasParsed = parseInt(moedasCapibasDestribuidas);
    const faixaEtariaParsed = parseInt(faixaEtaria); 
    

    try {
        const evento = await eventoService.criarEvento(
            nome, 
            local, 
            data, 
            descricao, 
            pequenoPorteFinal, 
            reportadoPorUsuarioFinal, 
            aoVivoFinal, 
            moedasCapibasDestribuidasParsed, 
            ativoFinal, 
            preco, 
            faixaEtariaParsed, 
            precisaInscricaoFinal, 
            horario, 
            imagemUrlFinal,
            latitude,
            longitude
    );
      res.status(201).json({
        mensagem: `Evento criado com sucesso: ${evento.nome}`,
        evento,
      });
    } catch (error) {
      res.status(400).json({ erro: `Erro ao criar evento: ${error.message}` });
    }
  }

  async listarEventos(req, res) {
    try {
      const eventos = await eventoService.listarEventos();
      res.status(200).json(eventos);
    } catch (error) {
      res
        .status(500)
        .json({ erro: `Erro ao listar eventos: ${error.message}` });
    }
  }

  async obterPorId(req, res) {
    const { id } = req.params;

    try {
      const evento = await eventoService.obterPorId(Number(id));
      if (!evento) {
        return res
          .status(404)
          .json({ erro: `Evento com ID ${id} não encontrado` });
      }
      res.status(200).json(evento);
    } catch (error) {
      res
        .status(400)
        .json({ erro: `Erro ao procurar evento por ID: ${error.message}` });
    }
  }

  async removerEvento(req, res) {
    const { id } = req.params;

    try {
      const eventoRemovido = await eventoService.removerEvento(Number(id));
      res.status(200).json({
        mensagem: `Evento "${eventoRemovido.nome}" removido com sucesso.`,
      });
    } catch (error) {
      res
        .status(400)
        .json({ erro: `Erro ao remover evento: ${error.message}` });
    }
  }

  async enviarCheckInParaConecta(req, res) {
    try {
      await conecta.autenticar(req.body.login, req.body.senha);

      const dados = {
        userIdentifier: req.body.userIdentifier,
        eventName: req.body.eventName,
        checkInDateTime: new Date().toISOString(),
        cidade: req.body.cidade,
        bairro: req.body.bairro,
        rua: req.body.rua,
        identifier: req.body.identifier,
        document: req.body.document,
      };

      const resposta = await conecta.fazerCheckIn(dados);
      return res.json(resposta);
    } catch (error) {
      return res.status(500).json({ erro: error.message });
    }
  }
}

module.exports = EventoController;
