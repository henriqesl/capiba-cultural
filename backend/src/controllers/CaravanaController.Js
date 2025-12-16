const caravanaService = require("../services/CaravanaService");
const usuarioService = require("../services/UsuarioService");
const eventoService = require("../services/EventoService");

class CaravanaController {
  async criarCaravana(req, res) {
    const usuarioLogadoId = req.usuarioId; // ID vindo do Token JWT

    // 1. Pega também a descricao do corpo da requisição
    const { nome, codigoAcesso, eventoId, descricao, imagemUrl: imagemUrlBody } = req.body;
    
    const imagemUrlFinal = (req.file && req.file.filename) ? `uploads/${req.file.filename}` : imagemUrlBody;

      if (imagemUrlFinal) {
          console.log("Multer recebeu e o caminho final é:", imagemUrlFinal);
      } else {
          console.log("Nenhum arquivo de imagem foi enviado.");
      }
    // Validação Básica
    if (!nome || !codigoAcesso || !eventoId) {
        return res.status(400).json({ erro: "Nome, Código de Acesso e ID do Evento são obrigatórios." });
    }
    
    if (!usuarioLogadoId) {
        return res.status(401).json({ erro: "Usuário não autenticado." });
    }

    try {
        const eventIdNum = Number(eventoId);

        // 2. Chama o Service passando TUDO na ordem correta
        // Ordem: nome, codigo, evento, bonus(10), descricao, usuarioId
        const caravana = await caravanaService.criarCaravana(
            nome, 
            codigoAcesso, 
            eventIdNum, 
            10, 
            descricao, 
            usuarioLogadoId,
            imagemUrlFinal,
        );
        
        res.status(201).json({
          mensagem: `Caravana criada com sucesso: ${caravana.nome}`,
          caravana,
        });
        
    } catch (error) {
        console.error("Erro no Controller criarCaravana:", error);
        
        if (error.message && error.message.includes("código de acesso")) { 
             return res.status(409).json({ erro: "Este Código de Acesso já está sendo usado." });
        }

        res.status(400).json({ 
             erro: `Erro ao criar caravana: ${error.message}` 
        });
    }
  }

  async listarCaravanas(req, res) {
    try {
      const caravanas = await caravanaService.listarCaravanas();
      res.status(200).json(caravanas);
    } catch (error) {
      res
        .status(500)
        .json({ erro: `Erro ao listar caravanas: ${error.message}` });
    }
  }

  async obterPorId(req, res) {
    const { id } = req.params;

    try {
      const caravana = await caravanaService.obterPorId(Number(id));
      if (!caravana) {
        return res
          .status(404)
          .json({ erro: `Caravana com ID ${id} não encontrada` });
      }
      res.status(200).json(caravana);
    } catch (error) {
      res
        .status(400)
        .json({ erro: `Erro ao encontrar caravana por ID: ${error.message}` });
    }
  }

  async adicionarMembro(req, res) {
    const { id } = req.params;
    const { usuarioId } = req.body;

    try {
      const usuario = await usuarioService.obterPorId(Number(usuarioId));
      if (!usuario) {
        return res
          .status(404)
          .json({ erro: `Usuário com ID ${usuarioId} não encontrado` });
      }

      const caravana = await caravanaService.adicionarMembro(id, usuario);
      res.status(200).json({
        mensagem: `Usuário ${usuario.nome} adicionado à caravana ${caravana.nome}`,
        caravana,
      });
    } catch (error) {
      res.status(400).json({
        erro: `Erro ao adicionar usuário à caravana: ${error.message}`,
      });
    }
  }

  async adicionarDestino(req, res) {
    const { id } = req.params;
    const { eventoId } = req.body;

    try {
      const evento = await eventoService.obterPorId(Number(eventoId));
      if (!evento) {
        return res
          .status(404)
          .json({ erro: `Evento com ID ${eventoId} não encontrado` });
      }

      const caravana = await caravanaService.adicionarDestino(id, evento);
      res.status(200).json({
        mensagem: `Evento ${evento.nome} adicionado como destino da caravana ${caravana.nome}`,
        caravana,
      });
    } catch (error) {
      res.status(400).json({
        erro: `Erro ao adicionar destino à caravana: ${error.message}`,
      });
    }
  }



  async listarPorUsuario(req, res) {
  try {
    const { usuarioId } = req.params;

    const caravanas = await caravanaService.listarPorUsuario(
      Number(usuarioId)
    );

    return res.json(caravanas);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ erro: "Erro ao buscar caravanas do usuário" });
  }
}
async entrarComCodigoAcesso(req, res) {
  const { codigoAcesso, usuarioId } = req.body;

  try {
    const caravana = await caravanaService.entrarComCodigoAcesso(
      codigoAcesso,
      Number(usuarioId)
    );

    return res.status(200).json({
      mensagem: `Você entrou na caravana "${caravana.nome}" com sucesso!`,
      caravana
    });

  } catch (error) {
    // 🔹 Aqui você imprime o erro no console do Node
    console.error("Erro ao entrar na caravana:", error);

    return res.status(400).json({
      erro: error.message
    });
  }
}

 async atualizarCaravana(req, res, caminhoArquivo = null) {
  const { id } = req.params;
  const dados = req.body;

  try {

      if (req.file) {
  
        const fotoUrl = `${req.protocol}://${req.get("host")}/uploads/perfil/${req.file.filename}`;
        
        dados.fotoUrl = fotoUrl;
      }


    console.log("Atualizando caravana:", id, dados);

    const caravana = await caravanaService.atualizarCaravana(Number(id), dados);

    res.status(200).json({
      mensagem: "Caravana atualizada com sucesso!",
      caravana,
    });
  } catch (error) {
    console.error("Erro no update da caravana:", error);
    res.status(400).json({ erro: `Erro ao atualizar: ${error.message}` });
  }
}



  async removerCaravana(req, res) {
    const { id } = req.params;

    try {
      const caravanaRemovida = await caravanaService.removerCaravana(
        Number(id)
      );
      res.status(200).json({
        mensagem: `Caravana "${caravanaRemovida.nome}" removida com sucesso.`,
      });
    } catch (error) {
      res
        .status(400)
        .json({ erro: `Erro ao remover caravana: ${error.message}` });
    }
  }

  async obterMultiplicador(req, res) {
    const caravanaId = Number(req.params.id);
    const usuarioId = req.query.usuarioId ? Number(req.query.usuarioId) : null;
    const mes = req.query.mes ? Number(req.query.mes) : undefined;
    const ano = req.query.ano ? Number(req.query.ano) : undefined;

    if (!usuarioId) {
      return res
        .status(400)
        .json({ erro: "usuarioId query param obrigatório" });
    }

    try {
      const multiplicador = await caravanaService.calcularMultiplicador(
        usuarioId,
        caravanaId,
        mes,
        ano
      );
      res.status(200).json({ caravanaId, usuarioId, multiplicador });
    } catch (error) {
      res
        .status(400)
        .json({ erro: `Erro ao calcular multiplicador: ${error.message}` });
    }
  }
}

module.exports = CaravanaController;
