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

const mockEventoRepository = {
  obterPorId: jest.fn(),
};

jest.mock("../models/CheckIn", () => {
  return jest.fn().mockImplementation(() => {
    return mockCheckInRepository;
  });
});

jest.mock("../models/Evento", () => {
  return jest.fn().mockImplementation(() => {
    return mockEventoRepository;
  });
});

const CheckInService = require("../services/CheckInService");

describe("CheckInService", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockPrismaClient.$transaction.mockImplementation((callback) =>
      callback(mockTransaction)
    );
  });

  describe("realizarCheckIn", () => {
    const usuarioId = 1;
    const eventoId = 10;
    const eventoMockComMoedas = {
      id: eventoId,
      nome: "Show",
      moedasDistribuidas: 50,
    };
    const eventoMockSemMoedas = {
      id: eventoId,
      nome: "Feira",
      moedasDistribuidas: null,
    };
    const novoCheckInMock = { id: 100, usuarioId, eventoId };

    it("deve lançar um erro se o evento não for encontrado", async () => {
      mockEventoRepository.obterPorId.mockResolvedValue(null);

      await expect(
        CheckInService.realizarCheckIn(usuarioId, 999)
      ).rejects.toThrow("Evento inválido ou não encontrado.");

      expect(
        mockCheckInRepository.buscarPorUsuarioEEvento
      ).not.toHaveBeenCalled();
      expect(mockPrismaClient.$transaction).not.toHaveBeenCalled();
    });

    it("deve lançar um erro se o check-in já tiver sido realizado", async () => {
      mockEventoRepository.obterPorId.mockResolvedValue(eventoMockComMoedas);
      mockCheckInRepository.buscarPorUsuarioEEvento.mockResolvedValue(
        novoCheckInMock
      );

      await expect(
        CheckInService.realizarCheckIn(usuarioId, eventoId)
      ).rejects.toThrow("Você já realizou o check-in neste evento.");

      expect(mockPrismaClient.$transaction).not.toHaveBeenCalled();
    });

    it("deve realizar check-in, incrementar moedas (50) e usar transação", async () => {
      const moedasEsperadas = 50;

      mockEventoRepository.obterPorId.mockResolvedValue(eventoMockComMoedas);
      mockCheckInRepository.buscarPorUsuarioEEvento.mockResolvedValue(null);

      mockTransaction.checkIn.create.mockResolvedValue(novoCheckInMock);
      mockTransaction.usuario.update.mockResolvedValue(true);

      const resultado = await CheckInService.realizarCheckIn(
        usuarioId,
        eventoId
      );

      expect(mockPrismaClient.$transaction).toHaveBeenCalledTimes(1);

      expect(mockTransaction.checkIn.create).toHaveBeenCalledWith({
        data: { usuarioId, eventoId },
      });

      expect(mockTransaction.usuario.update).toHaveBeenCalledWith({
        where: { id: usuarioId },
        data: {
          saldoMoedaCapiba: { increment: moedasEsperadas },
        },
      });

      expect(resultado).toEqual({
        checkIn: novoCheckInMock,
        moedasGanhas: moedasEsperadas,
      });
    });

    it("deve realizar check-in, incrementar moedas (10) se moedasDistribuidas for nulo", async () => {
      const moedasEsperadas = 10;

      mockEventoRepository.obterPorId.mockResolvedValue(eventoMockSemMoedas);
      mockCheckInRepository.buscarPorUsuarioEEvento.mockResolvedValue(null);

      mockTransaction.checkIn.create.mockResolvedValue(novoCheckInMock);
      mockTransaction.usuario.update.mockResolvedValue(true);

      await CheckInService.realizarCheckIn(usuarioId, eventoId);

      expect(mockTransaction.usuario.update).toHaveBeenCalledWith({
        where: { id: usuarioId },
        data: {
          saldoMoedaCapiba: { increment: moedasEsperadas },
        },
      });
    });
  });
});
