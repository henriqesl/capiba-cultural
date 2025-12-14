const UsuarioService = require("../services/UsuarioService");
const GrupoService = require("../services/GrupoService");
const conecta = require("../services/ConectaAPI");
const jwt = require("jsonwebtoken");
const fs = require('fs');


class UsuarioController {
  constructor() {
    this.usuarioService = new UsuarioService();
    this.grupoService = new GrupoService();
  }

  async criarUsuario(req, res) {
    // 1. Extrair TODOS os campos do corpo da requisição
    const { 
        nome, 
        email, 
        senha, 
        cpf, 
        dataNascimento, 
        cep, 
        endereco, 
        numero, 
        bairro 
    } = req.body;

    let fotoUrl = null;
    let caminhoFisicoArquivo = null; // Variável para controlar a deleção em caso de erro

    try {
      // 2. Verifica se houve upload de arquivo
      if (req.file) {
        // Monta a URL pública (ex: http://localhost:3000/uploads/perfil/foto.jpg)
        fotoUrl = `${req.protocol}://${req.get("host")}/uploads/perfil/${req.file.filename}`;
        
        // Guarda o caminho físico (ex: /app/uploads/perfil/foto.jpg) para deletar se der erro
        caminhoFisicoArquivo = req.file.path;
      }

      console.log("LOG 1: Controller iniciou criação do usuário:", nome);
      
      // 3. Chama o Service passando TODOS os argumentos.
      // IMPORTANTE: A ordem aqui deve ser IDÊNTICA à ordem no método 'criarUsuario' do UsuarioService.js
      const usuario = await this.usuarioService.criarUsuario(
        nome,
        email,
        senha,
        cpf,
        dataNascimento,
        cep,
        endereco,
        numero,
        bairro,
        fotoUrl // Foto por último (ou conforme definido no seu Service)
      );

      console.log("LOG 2: Service retornou sucesso. Usuário criado com ID:", usuario.id);

      return res.status(201).json({
        mensagem: `Usuário ${usuario.nome} criado com sucesso!`,
        usuario,
      });

    } catch (error) {
      console.log("LOG 3: Erro capturado no Controller:", error.message);

      // 4. Se deu erro no banco (ex: email duplicado), apaga a foto que acabou de subir para não sujar o servidor
      if (caminhoFisicoArquivo && fs.existsSync(caminhoFisicoArquivo)) {
        fs.unlink(caminhoFisicoArquivo, (err) => {
          if (err) console.error("Erro ao limpar arquivo de foto após falha:", err);
          else console.log("Arquivo de foto limpo com sucesso.");
        });
      }

      console.error("Stack do erro:", error);
      return res.status(400).json({ erro: error.message });
    }
  }

  async login(req, res) {
    const { email, senha } = req.body;

    try {

      const { token: usuarioToken, usuario: usuarioInfo } = await this.usuarioService.autenticarUsuario(
                email,
                senha
            );


     res.status(200).json({
        usuario: usuarioInfo, 
        token: usuarioToken,

     });

    } catch (error) {
      res.status(401).json({
        erro: `Erro no login: ${error.message}`,
      });
    }
  }

  

  async listarUsuarios(req, res) {
    try {
      const usuarios = await this.usuarioService.listarUsuarios();
      res.status(200).json(usuarios);
    } catch (error) {
      res
        .status(500)
        .json({ erro: `Erro ao listar os usuários: ${error.message}` });
    }
  }

  async obterPorId(req, res) {
    const { id } = req.params;
    try {
      const usuario = await this.usuarioService.obterPorId(Number(id));
      if (!usuario) {
        return res.status(404).json({ erro: "Usuário não encontrado" });
      }
      res.status(200).json(usuario);
    } catch (error) {
      res
        .status(404)
        .json({ erro: `Erro ao encontrar usuário: ${error.message}` });
    }
  }

  async adicionarMoedas(req, res) {
    const { id } = req.params;
    const { quantidade } = req.body;
    try {
      if (quantidade <= 0 || isNaN(quantidade)) {
        return res.status(400).json({ erro: "Quantidade inválida" });
      }
      const usuario = await this.usuarioService.adicionarMoedas(
        Number(id),
        quantidade
      );
      res.status(200).json({
        mensagem: `Adicionadas ${quantidade} moedas ao usuário ${usuario.nome}`,
        usuario,
      });
    } catch (error) {
      res
        .status(400)
        .json({ erro: `Erro ao adicionar moedas: ${error.message}` });
    }
  }

  async gastarMoedas(req, res) {
    const { id } = req.params;
    const { quantidade } = req.body;
    try {
      if (quantidade <= 0 || isNaN(quantidade)) {
        return res.status(400).json({ erro: "Quantidade inválida" });
      }
      const usuario = await this.usuarioService.gastarMoedas(
        Number(id),
        quantidade
      );
      res.status(200).json({
        mensagem: `Usuário ${usuario.nome} gastou ${quantidade} moedas`,
        usuario,
      });
    } catch (error) {
      res.status(400).json({ erro: `Erro ao gastar moedas: ${error.message}` });
    }
  }

  async removerUsuario(req, res) {
    const { id } = req.params;
    try {
      const usuario = await this.usuarioService.removerUsuario(Number(id));
      res.status(200).json({
        mensagem: `Usuário ${usuario.nome} removido com sucesso.`,
        usuario,
      });
    } catch (error) {
      res
        .status(400)
        .json({ erro: `Erro ao remover usuário: ${error.message}` });
    }
  }

  async atualizarUsuario(req, res) {
    const { id } = req.params;
    const dados = req.body;
    try {
      const usuario = await this.usuarioService.atualizarUsuario(Number(id), dados);
      res.status(200).json({
        mensagem: "Dados atualizados com sucesso!",
        usuario,
      });
    } catch (error) {
      res.status(400).json({ erro: `Erro ao atualizar: ${error.message}` });
    }
  }
}

module.exports = UsuarioController;
