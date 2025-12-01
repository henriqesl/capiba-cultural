const mockEventoRepository = {
  obterPorNomeLocalEData: jest.fn(),
  novoEvento: jest.fn(),
  listar: jest.fn(),
  obterPorId: jest.fn(),
  obterPorNome: jest.fn(),
  obterPorLocal: jest.fn(),
  removerEvento: jest.fn(),
};

jest.mock("../models/Evento", () => {
  return jest.fn().mockImplementation(() => {
    return mockEventoRepository;
  });
});

const EventoService = require("../services/EventoService");

describe("EventoService", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    jest.spyOn(Date, "parse").mockImplementation((str) => {
      if (str === "2025-12-10T10:00:00.000Z") return 1733808000000;
      return NaN;
    });
  });

  afterEach(() => {
    Date.parse.mockRestore();
  });

  describe("criarEvento", () => {
    const nome = "Show de Rock";
    const local = "Arena Central";
    const data = "2025-12-10T10:00:00.000Z";
    const descricao = "Grande evento de encerramento do ano.";
    const eventoCriadoMock = { id: 1, nome, local };

    it("deve criar um evento com sucesso com os parâmetros obrigatórios", async () => {
      mockEventoRepository.obterPorNomeLocalEData.mockResolvedValue(null);
      mockEventoRepository.novoEvento.mockResolvedValue(eventoCriadoMock);

      const resultado = await EventoService.criarEvento(
        nome,
        local,
        data,
        descricao
      );

      expect(resultado).toEqual(eventoCriadoMock);
      expect(mockEventoRepository.novoEvento).toHaveBeenCalledWith(
        nome,
        local,
        data,
        descricao,
        false,
        false,
        [],
        []
      );
    });

    it("deve lançar um erro se algum campo obrigatório estiver faltando", async () => {
      await expect(
        EventoService.criarEvento(null, local, data, descricao)
      ).rejects.toThrow("Todos os campos são obrigatórios");

      await expect(
        EventoService.criarEvento(nome, local, null, descricao)
      ).rejects.toThrow("Todos os campos são obrigatórios");

      expect(
        mockEventoRepository.obterPorNomeLocalEData
      ).not.toHaveBeenCalled();
    });

    it("deve lançar um erro se a data for inválida", async () => {
      await expect(
        EventoService.criarEvento(nome, local, "data-invalida", descricao)
      ).rejects.toThrow("Data inválida");

      expect(
        mockEventoRepository.obterPorNomeLocalEData
      ).not.toHaveBeenCalled();
    });

    it("deve lançar um erro se já existir um evento duplicado", async () => {
      mockEventoRepository.obterPorNomeLocalEData.mockResolvedValue(
        eventoCriadoMock
      );

      await expect(
        EventoService.criarEvento(nome, local, data, descricao)
      ).rejects.toThrow(
        "Um evento com o mesmo nome e local já está agendado para esta data."
      );
      expect(mockEventoRepository.novoEvento).not.toHaveBeenCalled();
    });
  });

  describe("listarEventos", () => {
    it("deve retornar a lista de todos os eventos", async () => {
      const eventosMock = [
        { id: 1, nome: "E1" },
        { id: 2, nome: "E2" },
      ];
      mockEventoRepository.listar.mockResolvedValue(eventosMock);

      const resultado = await EventoService.listarEventos();

      expect(resultado).toEqual(eventosMock);
      expect(mockEventoRepository.listar).toHaveBeenCalledTimes(1);
    });
  });

  describe("obterPorId", () => {
    const eventoMock = { id: 1, nome: "E1" };

    it("deve retornar o evento se ele for encontrado", async () => {
      mockEventoRepository.obterPorId.mockResolvedValue(eventoMock);

      const resultado = await EventoService.obterPorId(1);

      expect(resultado).toEqual(eventoMock);
      expect(mockEventoRepository.obterPorId).toHaveBeenCalledWith(1);
    });

    it("deve lançar um erro se o evento não for encontrado", async () => {
      mockEventoRepository.obterPorId.mockResolvedValue(null);

      await expect(EventoService.obterPorId(999)).rejects.toThrow(
        "Evento não encontrado"
      );
    });
  });

  describe("obterPorNome", () => {
    const eventoMock = { id: 1, nome: "Show Teste" };

    it("deve retornar o evento se ele for encontrado", async () => {
      mockEventoRepository.obterPorNome.mockResolvedValue(eventoMock);

      const resultado = await EventoService.obterPorNome("Show Teste");

      expect(resultado).toEqual(eventoMock);
      expect(mockEventoRepository.obterPorNome).toHaveBeenCalledWith(
        "Show Teste"
      );
    });

    it("deve lançar um erro se o evento não for encontrado", async () => {
      mockEventoRepository.obterPorNome.mockResolvedValue(null);

      await expect(
        EventoService.obterPorNome("Show Inexistente")
      ).rejects.toThrow("Evento não encontrado");
    });
  });

  describe("obterPorLocal", () => {
    const eventoMock = { id: 1, local: "Parque Central" };

    it("deve retornar o evento se ele for encontrado", async () => {
      mockEventoRepository.obterPorLocal.mockResolvedValue(eventoMock);

      const resultado = await EventoService.obterPorLocal("Parque Central");

      expect(resultado).toEqual(eventoMock);
      expect(mockEventoRepository.obterPorLocal).toHaveBeenCalledWith(
        "Parque Central"
      );
    });

    it("deve lançar um erro se o evento não for encontrado", async () => {
      mockEventoRepository.obterPorLocal.mockResolvedValue(null);

      await expect(
        EventoService.obterPorLocal("Local Inexistente")
      ).rejects.toThrow("Evento não encontrado");
    });
  });

  describe("removerEvento", () => {
    const eventoId = 5;

    it("deve chamar o repositório para remover o evento se ele existir (Promise Resolvida)", async () => {
      mockEventoRepository.obterPorId.mockResolvedValue({ id: eventoId });
      mockEventoRepository.removerEvento.mockResolvedValue({ count: 1 });

      const resultado = await EventoService.removerEvento(eventoId);

      expect(mockEventoRepository.obterPorId).toHaveBeenCalledWith(eventoId);
      expect(mockEventoRepository.removerEvento).toHaveBeenCalledWith(eventoId);
      expect(resultado).toEqual({ count: 1 });
    });

    it("deve lançar um erro se o evento não for encontrado (Promise Null)", async () => {
      mockEventoRepository.obterPorId.mockResolvedValue(null);

      await expect(EventoService.removerEvento(999)).rejects.toThrow();

      expect(mockEventoRepository.removerEvento).not.toHaveBeenCalled();
    });
  });
});
