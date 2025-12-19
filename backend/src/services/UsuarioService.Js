const Usuario = require("../models/Usuario");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

class UsuarioService {
  constructor() {
    this.usuarioRepository = new Usuario();
  }

  async criarUsuario(
    nome,
    email,
    senha,
    cpf,
    dataNascimento,
    cep,
    endereco,
    numero,
    bairro,
    imagemUrl,
  ) {
    if (
      !nome ||
      !email ||
      !senha ||
      !cpf ||
      !dataNascimento ||
      !cep ||
      !endereco ||
      !numero ||
      !bairro
    ) {
      throw new Error("Todos os campos são obrigatórios (exceto foto).");
    }

    const usuarioExistente = await this.usuarioRepository.buscarEmail(email);
    if (usuarioExistente) {
      throw new Error("Este email já está cadastrado.");
    }

    const salt = await bcrypt.genSalt(10);
    const senhaHash = await bcrypt.hash(senha, salt);

    const novoUsuario = await this.usuarioRepository.novoUsuario(
      nome,
      email,
      senhaHash,
      cpf,
      dataNascimento,
      cep,
      endereco,
      numero,
      bairro,
      imagemUrl,
    );

    delete novoUsuario.senha;
    return novoUsuario;
  }

  async autenticarUsuario(email, senha) {
    const usuario = await this.usuarioRepository.buscarEmail(email);
    if (!usuario) throw new Error("Credenciais inválidas");

    console.log("Senha armazenada (Hash):", usuario.senha);

    const senhaCorreta = await bcrypt.compare(senha, usuario.senha);
    if (!senhaCorreta) throw new Error("Credenciais inválidas");

    const token = jwt.sign(
      { id: usuario.id, nome: usuario.nome },
      process.env.JWT_SECRET,
      { expiresIn: "8h" },
    );

    return { token, usuario: { id: usuario.id, email: usuario.email } };
  }

  async listarUsuarios() {
    return await this.usuarioRepository.listar();
  }

  async atualizarUsuario(id, dadosAtualizados) {
    const usuario = await this.usuarioRepository.buscarId(id);
    if (!usuario) {
      throw new Error("Usuário não encontrado");
    }

    const dadosParaSalvar = {};

    if (dadosAtualizados.nome) dadosParaSalvar.nome = dadosAtualizados.nome;
    if (dadosAtualizados.email) dadosParaSalvar.email = dadosAtualizados.email;
    if (dadosAtualizados.cpf) dadosParaSalvar.cpf = dadosAtualizados.cpf;
    if (dadosAtualizados.fotoUrl)
      dadosParaSalvar.fotoUrl = dadosAtualizados.fotoUrl;

    if (dadosAtualizados.dataNascimento)
      dadosParaSalvar.dataNascimento = dadosAtualizados.dataNascimento;
    if (dadosAtualizados.cep) dadosParaSalvar.cep = dadosAtualizados.cep;
    if (dadosAtualizados.endereco)
      dadosParaSalvar.endereco = dadosAtualizados.endereco;
    if (dadosAtualizados.numero)
      dadosParaSalvar.numero = dadosAtualizados.numero;
    if (dadosAtualizados.bairro)
      dadosParaSalvar.bairro = dadosAtualizados.bairro;

    if (dadosAtualizados.senha) {
      const salt = await bcrypt.genSalt(10);
      dadosParaSalvar.senha = await bcrypt.hash(dadosAtualizados.senha, salt);
    }

    if (Object.keys(dadosParaSalvar).length === 0) {
      return usuario;
    }

    return await this.usuarioRepository.atualizar(id, dadosParaSalvar);
  }

  async obterPorId(id) {
    const usuario = await this.usuarioRepository.buscarId(id);
    if (!usuario) {
      throw new Error("Usuário não encontrado");
    }
    return usuario;
  }

  async adicionarMoedas(usuarioId, quantidade) {
    if (quantidade <= 0) throw new Error("Valor inválido");

    const usuario = await prisma.usuario.findUnique({
      where: { id: Number(usuarioId) },
      select: { moedasCapiba: true } 
    });

    if (!usuario) throw new Error("Usuário não encontrado");

    const novoSaldo = (usuario.moedasCapiba || 0) + quantidade;

    return await prisma.usuario.update({
      where: { id: Number(usuarioId) },
      data: { moedasCapiba: novoSaldo }
    });
  }

  async gastarMoedas(usuarioId, quantidade) {
    const saldoAtual = await this.usuarioRepository.getSaldo(usuarioId);

    if (quantidade <= 0)
      throw new Error("Quantidade não pode ser zero ou negativa");
    if (quantidade > saldoAtual)
      throw new Error("Usuário não pode gastar mais moedas do que tem");

    const novoSaldo = saldoAtual - quantidade;
    return await this.usuarioRepository.setSaldo(usuarioId, novoSaldo);
  }

  async removerUsuario(id) {
    const usuario = await this.usuarioRepository.buscarId(id);
    if (!usuario) {
      throw new Error(`Usuário com ID ${id} não encontrado.`);
    }

    return await this.usuarioRepository.removerUsuario(id);
  }
}

module.exports = UsuarioService;
