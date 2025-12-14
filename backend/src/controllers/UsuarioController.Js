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
    const { nome, email, senha, cpf, imagemUrl: imagemUrlBody } = req.body;


  
    try {
       let fotoUrl = null;

      if (req.file) {
        fotoUrl = `${req.protocol}://${req.get("host")}/uploads/perfil/${req.file.filename}`;
      }

      console.log("LOG 1: TENTANDO CHAMAR O SERVICE."); // <--- NOVO
      const usuario = await this.usuarioService.criarUsuario(
        nome,
        email,
        senha,
        cpf,
        fotoUrl
      );
      console.log("LOG 2: SERVICE BEM-SUCEDIDO. USUARIO RETORNADO:", usuario); // <--- NOVO

      res.status(201).json({
        mensagem: `Usuário ${usuario.nome} criado com sucesso!`,
        usuario,
      });
    } catch (error) {
      console.log("LOG 3: ERRO CAPTURADO NO CONTROLLER. MENSAGEM:", error.message); // <--- NOVO
      if (caminhoCompletoArquivo && fs.existsSync(caminhoCompletoArquivo)) {
                fs.unlink(caminhoCompletoArquivo, (err) => {
                    if (err) console.error("Erro ao limpar arquivo após falha no DB:", err);
                });
            }

      console.error("Erro ao criar usuário:", error.message);
      res.status(400).json({ erro: `Erro ao criar usuário: ${error.message}` });
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
