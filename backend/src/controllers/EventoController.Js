const eventoService = require("../services/EventoService");

class EventoController {
  safeParseFloat = (value, defaultValue = null) => {
        if (value === null || value === undefined || value === "") {
            return defaultValue;
        }
        const parsed = parseFloat(value);
        return isNaN(parsed) ? defaultValue : parsed;
    };

    safeParseInt = (value, defaultValue = null) => {
        if (value === null || value === undefined || value === "") {
            return defaultValue;
        }
        const parsed = parseInt(value, 10);
        return isNaN(parsed) ? defaultValue : parsed;
    };

    async criarEvento(req, res) {
        const {
            nome,
            local,
            data,
            descricao,
            pequenoPorte = 'false', // Definindo default como string para consistência
            reportadoPorUsuario = 'false',
            aoVivo = 'false',
            moedasCapibasDestribuidas = '0', // Usando '0' como string
            ativo = 'true',
            preco,
            faixaEtaria = '0',
            precisaInscricao = 'false',
            horario,
            imagemUrl: imagemUrlBody,
            latitude,
            longitude
        } = req.body;

        const imagemUrlFinal = (req.file && req.file.filename) ? `uploads/${req.file.filename}` : imagemUrlBody;

        // Conversão de Strings para Booleanos
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

        // 🚨 Conversão de Strings para Number (corrigida!)
        const moedasCapibasDestribuidasParsed = this.safeParseFloat(moedasCapibasDestribuidas, 0); 
        const faixaEtariaParsed = this.safeParseInt(faixaEtaria, 0); 
        const latitudeParsed = this.safeParseFloat(latitude, null); 
        const longitudeParsed = this.safeParseFloat(longitude, null); 

        try {
            const evento = await eventoService.criarEvento(
                nome, 
                local, 
                data, 
                descricao, 
                pequenoPorteFinal, 
                reportadoPorUsuarioFinal, 
                aoVivoFinal, 
                moedasCapibasDestribuidasParsed, // OK
                ativoFinal, 
                preco, 
                faixaEtariaParsed, // OK
                precisaInscricaoFinal, 
                horario, 
                imagemUrlFinal,
                latitudeParsed, // OK
                longitudeParsed // OK
            );
            res.status(201).json({
                mensagem: `Evento criado com sucesso: ${evento.nome}`,
                evento,
            });
        } catch (error) {
            // 🚨 LOG DE ERRO CRÍTICO AQUI!
            console.error("[ERRO NO SERVICE/PRISMA]", error.stack); 
            res.status(400).json({ erro: `Erro ao criar evento: ${error.message}` });
        }
    }
  
    async listarEventos(req, res) {
      try {
        const { data } = req.query;
        const eventos = await eventoService.listarEventos(data);
        res.status(200).json(eventos);
      } catch (error) {
        res.status(500).json({ erro: error.message });
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
