const { PrismaClient } = require("@prisma/client");

const mockEventoService = {
  obterPorNome: jest.fn(),
  criarEvento: jest.fn(),
};

const mockReporteEventoRepository = {
  listar: jest.fn(),
  buscarPorId: jest.fn(),
  remover: jest.fn(),
};

const mockPrismaClient = {
  reporteEvento: {
    findFirst: jest.fn(),
    update: jest.fn(),
    create: jest.fn(),
    findMany: jest.fn(),
  },
};

jest.mock("@prisma/client", () => {
  const PrismaClient = jest.fn(() => mockPrismaClient);
  return { PrismaClient };
});
jest.mock("../models/ReporteEvento", () => {
  return jest.fn().mockImplementation(() => {
    return mockReporteEventoRepository;
  });
});
jest.mock("../services/EventoService", () => mockEventoService);

const ReporteService = require("../services/ReporteService");

let reporteService;

describe("ReporteService", () => {
  const consoleLogSpy = jest.spyOn(console, "log").mockImplementation(() => {});

  beforeAll(() => {
    reporteService = new ReporteService();
  });

  const MOCK_TIME = new Date("2025-01-15T12:00:00.000Z");

  beforeEach(() => {
    jest.clearAllMocks();
    jest.useFakeTimers();
    jest.setSystemTime(MOCK_TIME);
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  afterAll(() => {
    consoleLogSpy.mockRestore();
  });

  describe("criarOuConfirmarReporte", () => {
    const reportanteId = 10;
    const eventoInput = {
      nome: "Evento Teste",
      local: "Local X",
      data: "2025-01-20",
      descricao: "Novo evento",
    };
    const eventoExistenteMock = { id: 1, nome: "Evento Teste" };
    const reporteExistenteMock = {
      id: 50,
      eventoId: 1,
      qtdConfirmacoes: 1,
      reportantes: [{ id: 99 }],
    };

    it("deve lançar erro se reportanteId ou eventoInput estiverem faltando", async () => {
      await expect(
        reporteService.criarOuConfirmarReporte(null, eventoInput)
      ).rejects.toThrow(
        "Reportante e evento são obrigatórios para criar um reporte!"
      );
      await expect(
        reporteService.criarOuConfirmarReporte(reportanteId, null)
      ).rejects.toThrow(
        "Reportante e evento são obrigatórios para criar um reporte!"
      );
    });

    it("deve criar um novo Evento e um novo Reporte se o evento não for encontrado", async () => {
      mockEventoService.obterPorNome.mockResolvedValue(null);

      const novoEventoCriado = {
        id: 2,
        nome: eventoInput.nome,
        setReportadoPorUsuario: jest.fn().mockResolvedValue(true),
      };
      mockEventoService.criarEvento.mockResolvedValue(novoEventoCriado);

      mockPrismaClient.reporteEvento.findFirst.mockResolvedValueOnce(null);
      mockPrismaClient.reporteEvento.findFirst.mockResolvedValueOnce(null);

      const novoReporteCriado = { id: 51, evento: novoEventoCriado };
      mockPrismaClient.reporteEvento.create.mockResolvedValue(
        novoReporteCriado
      );

      const resultado = await reporteService.criarOuConfirmarReporte(
        reportanteId,
        eventoInput
      );

      expect(mockEventoService.criarEvento).toHaveBeenCalledWith(
        eventoInput.nome,
        eventoInput.local,
        new Date(eventoInput.data),
        eventoInput.descricao,
        false,
        true
      );
      expect(novoEventoCriado.setReportadoPorUsuario).toHaveBeenCalledWith(
        true
      );
      expect(mockPrismaClient.reporteEvento.create).toHaveBeenCalled();
      expect(resultado.mensagem).toBe("Novo evento reportado com sucesso.");
      expect(resultado.reporte).toEqual(novoReporteCriado);
    });

    it("deve confirmar um reporte existente e incrementar qtdConfirmacoes", async () => {
      mockEventoService.obterPorNome.mockResolvedValue(eventoExistenteMock);

      const reporteParaAtualizar = {
        ...reporteExistenteMock,
        reportantes: [{ id: 99 }],
        qtdConfirmacoes: 5,
      };
      mockPrismaClient.reporteEvento.findFirst.mockResolvedValue(
        reporteParaAtualizar
      );

      const reporteAtualizadoMock = {
        ...reporteParaAtualizar,
        qtdConfirmacoes: 6,
        reportantes: [
          ...reporteParaAtualizar.reportantes,
          { id: reportanteId },
        ],
      };
      mockPrismaClient.reporteEvento.update.mockResolvedValue(
        reporteAtualizadoMock
      );

      const resultado = await reporteService.criarOuConfirmarReporte(
        reportanteId,
        eventoInput
      );

      expect(mockPrismaClient.reporteEvento.update).toHaveBeenCalledWith(
        expect.objectContaining({
          where: { id: reporteParaAtualizar.id },
          data: {
            reportantes: { connect: { id: reportanteId } },
            qtdConfirmacoes: 6,
          },
        })
      );
      expect(resultado.mensagem).toBe(
        "Confirmação adicionada a um evento já reportado."
      );
      expect(resultado.reporte).toEqual(reporteAtualizadoMock);
    });

    it("deve retornar uma mensagem se o usuário já confirmou o reporte existente", async () => {
      mockEventoService.obterPorNome.mockResolvedValue(eventoExistenteMock);

      const reporteJaConfirmado = {
        ...reporteExistenteMock,
        reportantes: [{ id: reportanteId }, { id: 99 }],
      };
      mockPrismaClient.reporteEvento.findFirst.mockResolvedValue(
        reporteJaConfirmado
      );

      const resultado = await reporteService.criarOuConfirmarReporte(
        reportanteId,
        eventoInput
      );

      expect(mockPrismaClient.reporteEvento.update).not.toHaveBeenCalled();
      expect(resultado.mensagem).toBe(
        "Usuário já reportou/confirmou este evento."
      );
      expect(resultado.reporte).toEqual(reporteJaConfirmado);
    });

    it("deve lançar erro se o usuário tentou reportar o mesmo evento recentemente", async () => {
      mockEventoService.obterPorNome.mockResolvedValue(eventoExistenteMock);

      mockPrismaClient.reporteEvento.findFirst.mockResolvedValueOnce(null);

      mockPrismaClient.reporteEvento.findFirst.mockResolvedValueOnce({
        id: 100,
        dataReporte: new Date(MOCK_TIME.getTime() - 1 * 60 * 1000),
      });

      await expect(
        reporteService.criarOuConfirmarReporte(reportanteId, eventoInput)
      ).rejects.toThrow(
        "Você já enviou um reporte recentemente. Aguarde alguns minutos."
      );
      expect(mockPrismaClient.reporteEvento.create).not.toHaveBeenCalled();
    });
  });

  describe("listarReportes", () => {
    it("deve retornar a lista de reportes do repositório", async () => {
      const reportesMock = [{ id: 1 }, { id: 2 }];
      mockReporteEventoRepository.listar.mockResolvedValue(reportesMock);

      const resultado = await reporteService.listarReportes();

      expect(resultado).toEqual(reportesMock);
      expect(mockReporteEventoRepository.listar).toHaveBeenCalledTimes(1);
    });
  });

  describe("listarPorEvento", () => {
    it("deve chamar prisma.reporteEvento.findMany com o eventoId correto", async () => {
      const eventoId = 5;
      const reportesMock = [{ id: 1, eventoId: 5 }];
      mockPrismaClient.reporteEvento.findMany.mockResolvedValue(reportesMock);

      const resultado = await reporteService.listarPorEvento(eventoId);

      expect(mockPrismaClient.reporteEvento.findMany).toHaveBeenCalledWith({
        where: { eventoId },
        include: { evento: true, reportantes: true },
      });
      expect(resultado).toEqual(reportesMock);
    });
  });

  describe("listarPorUsuario", () => {
    it("deve chamar prisma.reporteEvento.findMany com os filtros OR corretos", async () => {
      const usuarioId = 20;
      const reportesMock = [{ id: 1 }];
      mockPrismaClient.reporteEvento.findMany.mockResolvedValue(reportesMock);

      const resultado = await reporteService.listarPorUsuario(usuarioId);

      expect(mockPrismaClient.reporteEvento.findMany).toHaveBeenCalledWith({
        where: {
          OR: [
            { reportanteId: usuarioId },
            { reportantes: { some: { id: usuarioId } } },
          ],
        },
        include: { evento: true, reportantes: true },
      });
      expect(resultado).toEqual(reportesMock);
    });
  });

  describe("removerReporte", () => {
    const reporteId = 10;

    it("deve remover o reporte e retornar true se ele existir", async () => {
      mockReporteEventoRepository.buscarPorId.mockResolvedValue({
        id: reporteId,
      });
      mockReporteEventoRepository.remover.mockResolvedValue(true);

      const resultado = await reporteService.removerReporte(reporteId);

      expect(mockReporteEventoRepository.buscarPorId).toHaveBeenCalledWith(
        reporteId
      );
      expect(mockReporteEventoRepository.remover).toHaveBeenCalledWith(
        reporteId
      );
      expect(resultado).toBe(true);
    });

    it("deve retornar false se o reporte não existir", async () => {
      mockReporteEventoRepository.buscarPorId.mockResolvedValue(null);

      const resultado = await reporteService.removerReporte(999);

      expect(mockReporteEventoRepository.remover).not.toHaveBeenCalled();
      expect(resultado).toBe(false);
    });
  });

  describe("listarEventosMaisReportados", () => {
    it("deve retornar eventos ordenados por total de confirmações nas últimas 24h", async () => {
      const vinteQuatroHorasAtras = new Date(
        MOCK_TIME.getTime() - 24 * 60 * 60 * 1000
      );

      const reportesRecentesMock = [
        { eventoId: 10, qtdConfirmacoes: 1, evento: { nome: "E1" } },
        { eventoId: 10, qtdConfirmacoes: 4, evento: { nome: "E1" } },
        { eventoId: 20, qtdConfirmacoes: 7, evento: { nome: "E2" } },
        { eventoId: 30, qtdConfirmacoes: 2, evento: { nome: "E3" } },
      ];

      mockPrismaClient.reporteEvento.findMany.mockResolvedValue(
        reportesRecentesMock
      );

      const resultado = await reporteService.listarEventosMaisReportados();

      expect(mockPrismaClient.reporteEvento.findMany).toHaveBeenCalledWith(
        expect.objectContaining({
          where: { dataReporte: { gte: vinteQuatroHorasAtras } },
        })
      );

      expect(resultado).toEqual([
        { eventoId: 20, totalReportes: 7 },
        { eventoId: 10, totalReportes: 5 },
        { eventoId: 30, totalReportes: 2 },
      ]);
    });

    it("deve retornar um array vazio se não houver reportes recentes", async () => {
      mockPrismaClient.reporteEvento.findMany.mockResolvedValue([]);

      const resultado = await reporteService.listarEventosMaisReportados();

      expect(resultado).toEqual([]);
    });
  });
});
