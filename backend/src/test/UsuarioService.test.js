const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

jest.mock('bcryptjs', () => ({
    genSalt: jest.fn().mockResolvedValue('mockSalt'),
    hash: jest.fn().mockResolvedValue('senha_hash_mock'),
    compare: jest.fn(),
}));

jest.mock('jsonwebtoken', () => ({
    sign: jest.fn().mockReturnValue('mocked_jwt_token'),
}));

const mockUsuarioRepository = {
    novoUsuario: jest.fn(),
    buscarEmail: jest.fn(),
    buscarId: jest.fn(),
    listar: jest.fn(),
    atualizar: jest.fn(),
    getSaldo: jest.fn(),
    setSaldo: jest.fn(),
    removerUsuario: jest.fn(),
};

jest.mock('../models/Usuario', () => {
    return jest.fn().mockImplementation(() => {
        return mockUsuarioRepository;
    });
});

process.env.JWT_SECRET = 'secret_teste';

const UsuarioService = require('../services/UsuarioService');

let usuarioService;

describe('UsuarioService', () => {
    beforeAll(() => {
        usuarioService = new UsuarioService();
    });

    beforeEach(() => {
        jest.clearAllMocks();
    });

    describe('criarUsuario', () => {
        const nome = 'Novo Usuário';
        const email = 'novo@email.com';
        const senha = 'senha123';
        const cpf = '12345678900';
        const usuarioCriadoMock = {
            id: 1,
            nome,
            email,
            senha: 'senha_hash_mock',
            cpf,
        };

        it('deve criar um novo usuário e retornar os dados sem a senha', async () => {
            mockUsuarioRepository.buscarEmail.mockResolvedValue(null);
            mockUsuarioRepository.novoUsuario.mockResolvedValue(usuarioCriadoMock);

            const resultado = await usuarioService.criarUsuario(nome, email, senha, cpf);

            expect(bcrypt.genSalt).toHaveBeenCalledWith(10);
            expect(bcrypt.hash).toHaveBeenCalledWith(senha, 'mockSalt');
            expect(mockUsuarioRepository.novoUsuario).toHaveBeenCalledWith(
                nome,
                email,
                'senha_hash_mock',
                cpf
            );
            expect(resultado.senha).toBeUndefined();
            expect(resultado.email).toBe(email);
        });

        it('deve lançar um erro se algum campo obrigatório estiver faltando', async () => {
            await expect(usuarioService.criarUsuario(nome, email, null, cpf)).rejects.toThrow(
                'Todos os campos são obrigatórios'
            );
        });

        it('deve lançar um erro se o e-mail já estiver cadastrado', async () => {
            mockUsuarioRepository.buscarEmail.mockResolvedValue(usuarioCriadoMock);

            await expect(usuarioService.criarUsuario(nome, email, senha, cpf)).rejects.toThrow(
                'E-mail já cadastrado'
            );
            expect(mockUsuarioRepository.novoUsuario).not.toHaveBeenCalled();
        });
    });

    describe('autenticarUsuario', () => {
        const email = 'teste@auth.com';
        const senha = 'senhaCorreta';
        const usuarioMock = {
            id: 5,
            nome: 'Auth User',
            email,
            senha: 'senha_hash_mock',
        };

        it('deve retornar um token e os dados básicos do usuário em caso de sucesso', async () => {
            mockUsuarioRepository.buscarEmail.mockResolvedValue(usuarioMock);
            bcrypt.compare.mockResolvedValue(true);

            const resultado = await usuarioService.autenticarUsuario(email, senha);

            expect(mockUsuarioRepository.buscarEmail).toHaveBeenCalledWith(email);
            expect(bcrypt.compare).toHaveBeenCalledWith(senha, usuarioMock.senha);
            expect(jwt.sign).toHaveBeenCalledWith(
                { id: usuarioMock.id, nome: usuarioMock.nome },
                'secret_teste',
                { expiresIn: '8h' }
            );
            expect(resultado).toEqual({
                token: 'mocked_jwt_token',
                usuario: { id: usuarioMock.id, email: usuarioMock.email },
            });
        });

        it('deve lançar um erro se o usuário não for encontrado', async () => {
            mockUsuarioRepository.buscarEmail.mockResolvedValue(null);

            await expect(usuarioService.autenticarUsuario(email, senha)).rejects.toThrow(
                'Credenciais inválidas'
            );
            expect(bcrypt.compare).not.toHaveBeenCalled();
        });

        it('deve lançar um erro se a senha estiver incorreta', async () => {
            mockUsuarioRepository.buscarEmail.mockResolvedValue(usuarioMock);
            bcrypt.compare.mockResolvedValue(false);

            await expect(usuarioService.autenticarUsuario(email, senha)).rejects.toThrow(
                'Credenciais inválidas'
            );
            expect(jwt.sign).not.toHaveBeenCalled();
        });
    });

    describe('listarUsuarios', () => {
        it('deve retornar a lista de todos os usuários', async () => {
            const usuariosMock = [{ id: 1 }, { id: 2 }];
            mockUsuarioRepository.listar.mockResolvedValue(usuariosMock);

            const resultado = await usuarioService.listarUsuarios();

            expect(resultado).toEqual(usuariosMock);
            expect(mockUsuarioRepository.listar).toHaveBeenCalledTimes(1);
        });
    });

    describe('atualizarUsuario', () => {
        const userId = 1;
        const usuarioExistente = { id: userId, nome: 'Antigo Nome', idade: 25 };
        const dadosNovos = { nome: 'Novo Nome', idade: 26 };
        const usuarioAtualizadoMock = { id: userId, nome: 'Novo Nome', idade: 26 };

        it('deve atualizar apenas os campos permitidos e retornar o usuário atualizado', async () => {
            mockUsuarioRepository.buscarId.mockResolvedValue(usuarioExistente);
            mockUsuarioRepository.atualizar.mockResolvedValue(usuarioAtualizadoMock);

            const dadosComCampoProibido = {
                ...dadosNovos,
                saldoMoedaCapiba: 999,
                senha: 'newHash',
            };

            const resultado = await usuarioService.atualizarUsuario(userId, dadosComCampoProibido);

            expect(resultado).toEqual(usuarioAtualizadoMock);
            expect(mockUsuarioRepository.atualizar).toHaveBeenCalledWith(userId, {
                nome: 'Novo Nome',
                idade: 26,
            });
        });

        it('deve lançar erro se o usuário não for encontrado', async () => {
            mockUsuarioRepository.buscarId.mockResolvedValue(null);

            await expect(usuarioService.atualizarUsuario(999, dadosNovos)).rejects.toThrow(
                'Usuário não encontrado'
            );
        });

        it('deve lançar erro se nenhum campo válido for fornecido', async () => {
            mockUsuarioRepository.buscarId.mockResolvedValue(usuarioExistente);
            const dadosInvalidos = { saldoMoedaCapiba: 100, grupoId: 5 };

            await expect(usuarioService.atualizarUsuario(userId, dadosInvalidos)).rejects.toThrow(
                'Nenhum campo válido para atualização'
            );
        });
    });

    describe('obterPorId', () => {
        const usuarioMock = { id: 1, nome: 'Busca' };

        it('deve retornar o usuário se ele for encontrado', async () => {
            mockUsuarioRepository.buscarId.mockResolvedValue(usuarioMock);

            const resultado = await usuarioService.obterPorId(1);

            expect(resultado).toEqual(usuarioMock);
        });

        it('deve lançar um erro se o usuário não for encontrado', async () => {
            mockUsuarioRepository.buscarId.mockResolvedValue(null);

            await expect(usuarioService.obterPorId(999)).rejects.toThrow('Usuário não encontrado');
        });
    });

    describe('adicionarMoedas', () => {
        const userId = 1;
        const quantidade = 50;
        const saldoAtual = 100;
        const novoSaldoEsperado = 150;
        const usuarioAtualizadoMock = { id: userId, saldo: novoSaldoEsperado };

        it('deve adicionar moedas e retornar o usuário atualizado', async () => {
            mockUsuarioRepository.getSaldo.mockResolvedValue(saldoAtual);
            mockUsuarioRepository.setSaldo.mockResolvedValue(usuarioAtualizadoMock);

            const resultado = await usuarioService.adicionarMoedas(userId, quantidade);

            expect(mockUsuarioRepository.getSaldo).toHaveBeenCalledWith(userId);
            expect(mockUsuarioRepository.setSaldo).toHaveBeenCalledWith(userId, novoSaldoEsperado);
            expect(resultado).toEqual(usuarioAtualizadoMock);
        });

        it('deve lançar erro se a quantidade for zero ou negativa', async () => {
            await expect(usuarioService.adicionarMoedas(userId, 0)).rejects.toThrow(
                'Valor adicionado não pode ser zero ou negativo'
            );
            await expect(usuarioService.adicionarMoedas(userId, -10)).rejects.toThrow(
                'Valor adicionado não pode ser zero ou negativo'
            );
            expect(mockUsuarioRepository.getSaldo).not.toHaveBeenCalled();
        });
    });

    describe('gastarMoedas', () => {
        const userId = 1;
        const saldoAtual = 100;
        const quantidadeGasta = 30;
        const novoSaldoEsperado = 70;
        const usuarioAtualizadoMock = { id: userId, saldo: novoSaldoEsperado };

        it('deve gastar moedas e retornar o usuário atualizado', async () => {
            mockUsuarioRepository.getSaldo.mockResolvedValue(saldoAtual);
            mockUsuarioRepository.setSaldo.mockResolvedValue(usuarioAtualizadoMock);

            const resultado = await usuarioService.gastarMoedas(userId, quantidadeGasta);

            expect(mockUsuarioRepository.getSaldo).toHaveBeenCalledWith(userId);
            expect(mockUsuarioRepository.setSaldo).toHaveBeenCalledWith(userId, novoSaldoEsperado);
            expect(resultado).toEqual(usuarioAtualizadoMock);
        });

        it('deve lançar erro se a quantidade for zero ou negativa', async () => {
            mockUsuarioRepository.getSaldo.mockResolvedValue(saldoAtual);
            await expect(usuarioService.gastarMoedas(userId, 0)).rejects.toThrow(
                'Quantidade não pode ser zero ou negativa'
            );
            expect(mockUsuarioRepository.setSaldo).not.toHaveBeenCalled();
        });

        it('deve lançar erro se a quantidade for maior que o saldo atual', async () => {
            mockUsuarioRepository.getSaldo.mockResolvedValue(saldoAtual);
            const quantidadeExcedente = 150;

            await expect(usuarioService.gastarMoedas(userId, quantidadeExcedente)).rejects.toThrow(
                'Usuário não pode gastar mais moedas do que tem'
            );
            expect(mockUsuarioRepository.setSaldo).not.toHaveBeenCalled();
        });
    });

    describe('removerUsuario', () => {
        const userId = 1;

        it('deve remover o usuário se ele for encontrado', async () => {
            const usuarioMock = { id: userId, nome: 'Remover' };
            mockUsuarioRepository.buscarId.mockResolvedValue(usuarioMock);
            mockUsuarioRepository.removerUsuario.mockResolvedValue({ count: 1 });

            const resultado = await usuarioService.removerUsuario(userId);

            expect(mockUsuarioRepository.buscarId).toHaveBeenCalledWith(userId);
            expect(mockUsuarioRepository.removerUsuario).toHaveBeenCalledWith(userId);
            expect(resultado).toEqual({ count: 1 });
        });

        it('deve lançar um erro se o usuário não for encontrado', async () => {
            mockUsuarioRepository.buscarId.mockResolvedValue(null);

            await expect(usuarioService.removerUsuario(999)).rejects.toThrow(
                'Usuário com ID 999 não encontrado.'
            );
            expect(mockUsuarioRepository.removerUsuario).not.toHaveBeenCalled();
        });
    });
});
