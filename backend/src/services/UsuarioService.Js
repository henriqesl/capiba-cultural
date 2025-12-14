const Usuario = require("../models/Usuario");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

class UsuarioService {
  constructor() {
    this.usuarioRepository = new Usuario();
  }

  async criarUsuario(nome, email, senha, cpf, telefone, username, dataNascimento, imageUrl = null) {
    if (!nome || !email || !senha || !cpf || !telefone || !username || !dataNascimento)
      throw new Error("Todos os campos são obrigatórios");


    const cpfLimpo = cpf.replace(/\D/g, ''); 
    const telefoneLimpo = telefone.replace(/\D/g, '');

    if (dataNascimento.length < 6 || dataNascimento.length > 8) {
        throw new Error("Data de nascimento inválida. Use o formato DDMMAAAA.");
    }
    
    let dataFormatada;
    
    if (dataNascimento.length === 8) {
        const dia = dataNascimento.substring(0, 2);
        const mes = dataNascimento.substring(2, 4);
        const ano = dataNascimento.substring(4, 8);
        dataFormatada = new Date(`${ano}-${mes}-${dia}`); 
    } else {
        throw new Error("Formato de data precisa ser DDMMAAAA (8 dígitos).");
    }


    if (isNaN(dataFormatada.getTime())) {
      throw new Error("A data de nascimento fornecida não é uma data válida.");
    }

    const usernameExistente = await this.usuarioRepository.buscarEmail(email);
    if (usernameExistente) {
        throw new Error("Este nome de usuário já está em uso.");
    }


    const salt = await bcrypt.genSalt(10);
    const senhaHash = await bcrypt.hash(senha, salt);
    const novoUsuario = await this.usuarioRepository.novoUsuario(
      nome,
      email,
      senhaHash,
      cpf,
      telefone, 
      username,
      dataFormatada,
      imageUrl
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

    const camposPermitidos = ["nome", "idade", "email", "dataCadastro", "cpf"];
    const dadosFiltrados = {};

    for (const campo in dadosAtualizados) {
      if (camposPermitidos.includes(campo)) {
        dadosFiltrados[campo] = dadosAtualizados[campo];
      }
    }

    if (Object.keys(dadosFiltrados).length === 0) {
      throw new Error("Nenhum campo válido para atualização");
    }

    return await this.usuarioRepository.atualizar(id, dadosFiltrados);
  }

  async obterPorId(id) {
    const usuario = await this.usuarioRepository.buscarId(id);
    if (!usuario) {
      throw new Error("Usuário não encontrado");
    }
    return usuario;
  }

  async adicionarMoedas(usuarioId, quantidade) {
    if (quantidade <= 0)
      throw new Error("Valor adicionado não pode ser zero ou negativo");

    const saldoAtual = await this.usuarioRepository.getSaldo(usuarioId);
    const novoSaldo = saldoAtual + quantidade;
    return await this.usuarioRepository.setSaldo(usuarioId, novoSaldo);
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
