const { PrismaClient } = require("@prisma/client");

const mockTransaction = {
  checkIn: { create: jest.fn() },
  usuario: { update: jest.fn() },
};

const mockPrismaClient = {
  $transaction: jest.fn((callback) => callback(mockTransaction)),
};

jest.mock("@prisma/client", () => {
  const PrismaClient = jest.fn(() => mockPrismaClient);
  return { PrismaClient };
});

const mockCheckInRepository = {
  buscarPorUsuarioEEvento: jest.fn(),
};

const mockConectaAPI = {
  autenticar: jest.fn().mockResolvedValue(true),
  fazerCheckIn: jest.fn().mockResolvedValue({ status: "OK" }),
};

const mockUsuarioService = {
  obterPorId: jest.fn(),
  adicionarMoedas: jest.fn().mockResolvedValue(true),
};

const mockEventoService = {
  obterPorId: jest.fn(),
};

jest.mock("../services/UsuarioService", () => mockUsuarioService);
jest.mock("../services/EventoService", () => mockEventoService);
jest.mock("../services/ConectaAPI", () => mockConectaAPI);

jest.mock("../models/CheckIn", () => {
  return jest.fn().mockImplementation(() => {
    return mockCheckInRepository;
  });
});

const CheckInService = require("../services/CheckInService");

describe("CheckInService", () => {
  const usuarioId = 1;
  const eventoId = 10;

  const usuarioMock = {
    id: usuarioId,
    cpf: "12345678900",
    nome: "Mock User",
    saldoMoedaCapiba: 100,
  };

  const eventoMockNormal = {
    id: eventoId,
    nome: "Show",
    local: "Praça",
    pequenoPorte: false,
  };

  const eventoMockPequeno = {
    id: eventoId,
    nome: "Feira",
    local: "Rua",
    pequenoPorte: true,
  };

  const novoCheckInMock = { id: 100, usuarioId, eventoId };

  beforeEach(() => {
    jest.clearAllMocks();
    mockPrismaClient.$transaction.mockImplementation((callback) =>
      callback(mockTransaction)
    );
    mockUsuarioService.obterPorId.mockResolvedValue(usuarioMock);
  });

  describe("realizarCheckIn", () => {
    it("deve lançar um erro se o usuário não for encontrado", async () => {
      mockUsuarioService.obterPorId.mockResolvedValue(null);

      await expect(
        CheckInService.realizarCheckIn(999, eventoId)
      ).rejects.toThrow("Usuário não encontrado");

      expect(mockEventoService.obterPorId).not.toHaveBeenCalled();
      expect(mockConectaAPI.autenticar).not.toHaveBeenCalled();
    });

    it("deve lançar um erro se o evento não for encontrado", async () => {
      mockEventoService.obterPorId.mockResolvedValue(null);

      await expect(
        CheckInService.realizarCheckIn(usuarioId, 999)
      ).rejects.toThrow("Evento não encontrado");

      expect(mockConectaAPI.autenticar).not.toHaveBeenCalled();
    });

    it("deve realizar check-in e incrementar moedas (20) para evento normal", async () => {
      const moedasEsperadas = 20;

      mockEventoService.obterPorId.mockResolvedValue(eventoMockNormal);

      const resultado = await CheckInService.realizarCheckIn(
        usuarioId,
        eventoId
      );

      expect(mockUsuarioService.obterPorId).toHaveBeenCalledWith(usuarioId);
      expect(mockEventoService.obterPorId).toHaveBeenCalledWith(eventoId);
      expect(mockConectaAPI.autenticar).toHaveBeenCalledTimes(1);

      expect(mockConectaAPI.fazerCheckIn).toHaveBeenCalledWith({
        userIdentifier: usuarioMock.cpf,
        eventName: eventoMockNormal.nome,
        cidade: "Recife",
        bairro: "Centro",
        rua: eventoMockNormal.local,
        identifier: `EVENTO-${eventoId}-USER-${usuarioId}`,
        document: usuarioMock.cpf,
        checkInDateTime: expect.any(String),
      });

      expect(mockUsuarioService.adicionarMoedas).toHaveBeenCalledWith(
        usuarioId,
        moedasEsperadas
      );

      expect(resultado).toEqual({
        moedasGanhas: moedasEsperadas,
        conecta: { status: "OK" },
      });

      expect(mockPrismaClient.$transaction).not.toHaveBeenCalled();
    });

    it("deve realizar check-in e incrementar moedas (10) para evento de pequeno porte", async () => {
      const moedasEsperadas = 10;

      mockEventoService.obterPorId.mockResolvedValue(eventoMockPequeno);

      await CheckInService.realizarCheckIn(usuarioId, eventoId);

      expect(mockUsuarioService.adicionarMoedas).toHaveBeenCalledWith(
        usuarioId,
        moedasEsperadas
      );
    });
  });
});
