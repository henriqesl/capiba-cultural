const mockPrismaClient = {
  evento: {
    findMany: jest.fn(),
  },
};

jest.mock("@prisma/client", () => {
  const PrismaClient = jest.fn(() => mockPrismaClient);
  return { PrismaClient };
});

const { PrismaClient } = require("@prisma/client");

const mockCaravanaRepository = {
  criarCaravana: jest.fn(),
  listar: jest.fn(),
  obterPorId: jest.fn(),
  adicionarMembro: jest.fn(),
  adicionarDestino: jest.fn(),
  remover: jest.fn(),
};

jest.mock("../models/Caravana", () => {
  return jest.fn().mockImplementation(() => {
    return mockCaravanaRepository;
  });
});

const CaravanaService = require("../services/CaravanaService");

describe("CaravanaService", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("criarCaravana", () => {
    it("deve criar uma caravana com sucesso com apenas o nome", async () => {
      const nome = "Caravana Teste";
      const novaCaravana = { id: 1, nome };
      mockCaravanaRepository.criarCaravana.mockResolvedValue(novaCaravana);

      const resultado = await CaravanaService.criarCaravana(nome);

      expect(resultado).toEqual(novaCaravana);
      expect(mockCaravanaRepository.criarCaravana).toHaveBeenCalledWith(
        nome,
        null,
        10
      );
    });

    it("deve lançar um erro se o nome for nulo ou vazio", async () => {
      await expect(CaravanaService.criarCaravana(null)).rejects.toThrow(
        "Nome da caravana é obrigatório."
      );
      expect(mockCaravanaRepository.criarCaravana).not.toHaveBeenCalled();
    });
  });

  describe("listarCaravanas", () => {
    it("deve retornar uma lista de caravanas", async () => {
      const caravanasMock = [
        { id: 1, nome: "C1" },
        { id: 2, nome: "C2" },
      ];
      mockCaravanaRepository.listar.mockResolvedValue(caravanasMock);

      const resultado = await CaravanaService.listarCaravanas();

      expect(resultado).toEqual(caravanasMock);
      expect(mockCaravanaRepository.listar).toHaveBeenCalledTimes(1);
    });
  });

  describe("obterPorId", () => {
    it("deve retornar a caravana se ela for encontrada", async () => {
      const caravanaMock = { id: 1, nome: "C1" };
      mockCaravanaRepository.obterPorId.mockResolvedValue(caravanaMock);

      const resultado = await CaravanaService.obterPorId(1);

      expect(resultado).toEqual(caravanaMock);
      expect(mockCaravanaRepository.obterPorId).toHaveBeenCalledWith(1);
    });

    it("deve lançar um erro se a caravana não for encontrada", async () => {
      mockCaravanaRepository.obterPorId.mockResolvedValue(null);

      await expect(CaravanaService.obterPorId(999)).rejects.toThrow(
        "Caravana não encontrada"
      );
    });
  });

  describe("adicionarMembro", () => {
    const caravanaId = 1;
    const usuarioId = 10;
    const caravanaComMembroMock = {
      id: caravanaId,
      membros: [{ id: usuarioId }],
    };

    it("deve adicionar o membro se a caravana existir e o membro não estiver presente", async () => {
      mockCaravanaRepository.obterPorId.mockResolvedValueOnce({
        id: caravanaId,
        membros: [{ id: 5 }],
      });
      mockCaravanaRepository.obterPorId.mockResolvedValueOnce(
        caravanaComMembroMock
      );
      mockCaravanaRepository.adicionarMembro.mockResolvedValue(true);

      const resultado = await CaravanaService.adicionarMembro(
        caravanaId,
        usuarioId
      );

      expect(mockCaravanaRepository.obterPorId).toHaveBeenCalledTimes(2);
      expect(mockCaravanaRepository.adicionarMembro).toHaveBeenCalledWith(
        caravanaId,
        usuarioId
      );
      expect(resultado).toEqual(caravanaComMembroMock);
    });

    it("deve lançar um erro se a caravana não for encontrada", async () => {
      mockCaravanaRepository.obterPorId.mockResolvedValue(null);

      await expect(
        CaravanaService.adicionarMembro(999, usuarioId)
      ).rejects.toThrow("Grupo não encontrado.");
    });

    it("deve lançar um erro se o usuário já for membro da caravana", async () => {
      mockCaravanaRepository.obterPorId.mockResolvedValue(
        caravanaComMembroMock
      );

      await expect(
        CaravanaService.adicionarMembro(caravanaId, usuarioId)
      ).rejects.toThrow("Usuário já faz parte da caravana.");
      expect(mockCaravanaRepository.adicionarMembro).not.toHaveBeenCalled();
    });
  });

  describe("adicionarDestino", () => {
    it("deve chamar o repositório para adicionar o destino", async () => {
      const retornoMock = {
        id: 1,
        eventoId: 5,
        caravanaId: 1,
      };
      mockCaravanaRepository.adicionarDestino.mockResolvedValue(retornoMock);

      const resultado = await CaravanaService.adicionarDestino(1, 5);

      expect(resultado).toEqual(retornoMock);
      expect(mockCaravanaRepository.adicionarDestino).toHaveBeenCalledWith(
        1,
        5
      );
    });
  });

  describe("removerCaravana", () => {
    it("deve chamar o repositório para remover a caravana", async () => {
      mockCaravanaRepository.remover.mockResolvedValue({ count: 1 });

      const resultado = await CaravanaService.removerCaravana(1);

      expect(resultado).toEqual({ count: 1 });
      expect(mockCaravanaRepository.remover).toHaveBeenCalledWith(1);
    });
  });

  describe("calcularMultiplicador", () => {
    const caravanaId = 1;
    const usuarioId = 10;
    const mes = 1;
    const ano = 2025;

    const mockDate = new Date(ano, mes - 1, 15);
    beforeAll(() => {
      jest.useFakeTimers();
      jest.setSystemTime(mockDate);
    });
    afterAll(() => {
      jest.useRealTimers();
    });

    it("deve lançar um erro se usuarioId ou caravanaId não forem números inteiros", async () => {
      await expect(
        CaravanaService.calcularMultiplicador("a", caravanaId, mes, ano)
      ).rejects.toThrow("usuarioId e caravanaId devem ser números inteiros.");

      await expect(
        CaravanaService.calcularMultiplicador(usuarioId, "b", mes, ano)
      ).rejects.toThrow("usuarioId e caravanaId devem ser números inteiros.");
    });

    it("deve lançar um erro se a caravana não for encontrada", async () => {
      mockCaravanaRepository.obterPorId.mockResolvedValue(null);

      await expect(
        CaravanaService.calcularMultiplicador(usuarioId, 999, mes, ano)
      ).rejects.toThrow("Caravana não encontrada");
    });

    it("deve calcular o multiplicador corretamente para tamanho > 15 e participante do evento", async () => {
      const tamanho = 16;
      const caravanaMock = {
        id: caravanaId,
        membros: Array.from({ length: tamanho }, (_, i) => ({
          id: i + 1,
        })),
      };
      const eventosDoMesMock = [
        {
          participantes: [{ id: usuarioId }, { id: 20 }],
        },
      ];
      const start = new Date(ano, mes - 1, 1);
      const end = new Date(ano, mes, 1);

      mockCaravanaRepository.obterPorId.mockResolvedValue(caravanaMock);
      mockPrismaClient.evento.findMany.mockResolvedValue(eventosDoMesMock);

      const resultado = await CaravanaService.calcularMultiplicador(
        usuarioId,
        caravanaId,
        mes,
        ano
      );

      expect(resultado).toBe(117);
      expect(mockPrismaClient.evento.findMany).toHaveBeenCalledWith({
        where: {
          data: { gte: start, lt: end },
          caravanas: { some: { id: caravanaId } },
        },
        include: { participantes: true },
      });
    });

    it("deve calcular o multiplicador corretamente para tamanho entre 6 e 10 e SEM participação no evento", async () => {
      const tamanho = 8;
      const caravanaMock = {
        id: caravanaId,
        membros: Array.from({ length: tamanho }, (_, i) => ({
          id: i + 1,
        })),
      };
      const eventosDoMesMock = [
        {
          participantes: [{ id: 99 }, { id: 20 }],
        },
      ];

      mockCaravanaRepository.obterPorId.mockResolvedValue(caravanaMock);
      mockPrismaClient.evento.findMany.mockResolvedValue(eventosDoMesMock);

      const resultado = await CaravanaService.calcularMultiplicador(
        usuarioId,
        caravanaId,
        mes,
        ano
      );

      expect(resultado).toBe(105);
    });

    it("deve usar o mês e ano atuais se não forem fornecidos", async () => {
      const tamanho = 12;
      const caravanaMock = {
        id: caravanaId,
        membros: Array.from({ length: tamanho }, (_, i) => ({
          id: i + 1,
        })),
      };
      const eventosDoMesMock = [
        {
          participantes: [{ id: usuarioId }],
        },
      ];

      mockCaravanaRepository.obterPorId.mockResolvedValue(caravanaMock);
      mockPrismaClient.evento.findMany.mockResolvedValue(eventosDoMesMock);

      const startCurrent = new Date(
        mockDate.getFullYear(),
        mockDate.getMonth(),
        1
      );
      const endCurrent = new Date(
        mockDate.getFullYear(),
        mockDate.getMonth() + 1,
        1
      );

      const resultado = await CaravanaService.calcularMultiplicador(
        usuarioId,
        caravanaId,
        null,
        null
      );

      expect(resultado).toBe(115);
      expect(mockPrismaClient.evento.findMany).toHaveBeenCalledWith(
        expect.objectContaining({
          where: {
            data: { gte: startCurrent, lt: endCurrent },
            caravanas: { some: { id: caravanaId } },
          },
        })
      );
    });

    it("deve retornar 100 se o tamanho for menor que 6 e não houver participação no evento", async () => {
      const tamanho = 5;
      const caravanaMock = {
        id: caravanaId,
        membros: Array.from({ length: tamanho }, (_, i) => ({
          id: i + 1,
        })),
      };
      const eventosDoMesMock = [];

      mockCaravanaRepository.obterPorId.mockResolvedValue(caravanaMock);
      mockPrismaClient.evento.findMany.mockResolvedValue(eventosDoMesMock);

      const resultado = await CaravanaService.calcularMultiplicador(
        usuarioId,
        caravanaId,
        mes,
        ano
      );

      expect(resultado).toBe(100);
    });
  });
});
