const mockGrupoRepository = {
  novoGrupoCompeticao: jest.fn(),
  listar: jest.fn(),
  obterPorId: jest.fn(),
  getMembros: jest.fn(),
  adicionarMembro: jest.fn(),
  setPontuacaoTotal: jest.fn(),
  setVencedor: jest.fn(),
  setEncerrado: jest.fn(),
  removerGrupo: jest.fn(),
};

jest.mock("../models/GrupoCompeticao", () => {
  return jest.fn().mockImplementation(() => {
    return mockGrupoRepository;
  });
});

const GrupoService = require("../services/GrupoService");

let grupoService;

describe("GrupoService", () => {
  beforeAll(() => {
    grupoService = new GrupoService();
  });

  beforeEach(() => {
    jest.clearAllMocks();
    jest.useFakeTimers();
    jest.setSystemTime(new Date("2025-10-15T10:00:00.000Z"));
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  describe("criarGrupo", () => {
    const nome = "Competição Mensal";
    const dataInicio = "2025-10-01";
    const dataFim = "2025-10-31";
    const grupoCriadoMock = { id: 1, nome };

    it("deve criar um grupo com sucesso com valores padrão", async () => {
      mockGrupoRepository.novoGrupoCompeticao.mockResolvedValue(
        grupoCriadoMock,
      );

      const resultado = await grupoService.criarGrupo(
        nome,
        dataInicio,
        dataFim,
      );

      expect(resultado).toEqual(grupoCriadoMock);
      expect(mockGrupoRepository.novoGrupoCompeticao).toHaveBeenCalledWith(
        nome,
        dataInicio,
        dataFim,
        false,
        0,
      );
    });

    it("deve lançar um erro se o nome for nulo", async () => {
      await expect(
        grupoService.criarGrupo(null, dataInicio, dataFim),
      ).rejects.toThrow("Nome do grupo é obrigatório");
      expect(mockGrupoRepository.novoGrupoCompeticao).not.toHaveBeenCalled();
    });

    it("deve lançar um erro se as datas de início ou fim estiverem faltando", async () => {
      await expect(
        grupoService.criarGrupo(nome, null, dataFim),
      ).rejects.toThrow("Datas de início e fim são obrigatórias");

      await expect(
        grupoService.criarGrupo(nome, dataInicio, null),
      ).rejects.toThrow("Datas de início e fim são obrigatórias");
    });
  });

  describe("listarGrupos", () => {
    it("deve retornar uma lista de grupos", async () => {
      const gruposMock = [{ id: 1 }, { id: 2 }];
      mockGrupoRepository.listar.mockResolvedValue(gruposMock);

      const resultado = await grupoService.listarGrupos();

      expect(resultado).toEqual(gruposMock);
      expect(mockGrupoRepository.listar).toHaveBeenCalledTimes(1);
    });
  });

  describe("obterPorId", () => {
    const grupoMock = { id: 1, nome: "G1" };

    it("deve retornar o grupo se ele for encontrado", async () => {
      mockGrupoRepository.obterPorId.mockResolvedValue(grupoMock);

      const resultado = await grupoService.obterPorId(1);

      expect(resultado).toEqual(grupoMock);
    });

    it("deve lançar um erro se o grupo não for encontrado", async () => {
      mockGrupoRepository.obterPorId.mockResolvedValue(null);

      await expect(grupoService.obterPorId(999)).rejects.toThrow(
        "Grupo não encontrado.",
      );
    });
  });

  describe("atualizarPontuacao", () => {
    const grupoId = 1;
    const membrosMock = [
      { id: 10, saldoMoedaCapiba: 50 },
      { id: 11, saldoMoedaCapiba: 30 },
      { id: 12, saldoMoedaCapiba: 20 },
      { id: 13, saldoMoedaCapiba: null },
    ];
    const pontuacaoEsperada = 100;

    it("deve calcular e atualizar a pontuação total com base nos membros", async () => {
      mockGrupoRepository.getMembros.mockResolvedValue(membrosMock);
      mockGrupoRepository.setPontuacaoTotal.mockResolvedValue(true);

      await grupoService.atualizarPontuacao(grupoId);

      expect(mockGrupoRepository.getMembros).toHaveBeenCalledWith(grupoId);
      expect(mockGrupoRepository.setPontuacaoTotal).toHaveBeenCalledWith(
        grupoId,
        pontuacaoEsperada,
      );
    });

    it("deve calcular pontuação zero se não houver membros", async () => {
      mockGrupoRepository.getMembros.mockResolvedValue([]);

      await grupoService.atualizarPontuacao(grupoId);

      expect(mockGrupoRepository.setPontuacaoTotal).toHaveBeenCalledWith(
        grupoId,
        0,
      );
    });
  });

  describe("atualizarPontuacoes", () => {
    const gruposMock = [
      { id: 1, nome: "G1" },
      { id: 2, nome: "G2" },
    ];
    const membrosG1 = [{ id: 10, saldoMoedaCapiba: 10 }];
    const membrosG2 = [{ id: 20, saldoMoedaCapiba: 5 }];

    it("deve iterar sobre todos os grupos e chamar atualizarPontuacao para cada um", async () => {
      mockGrupoRepository.listar.mockResolvedValue(gruposMock);

      mockGrupoRepository.getMembros.mockResolvedValueOnce(membrosG1);
      mockGrupoRepository.getMembros.mockResolvedValueOnce(membrosG2);

      mockGrupoRepository.setPontuacaoTotal.mockResolvedValue(true);

      const resultado = await grupoService.atualizarPontuacoes();

      expect(mockGrupoRepository.listar).toHaveBeenCalledTimes(1);
      expect(mockGrupoRepository.getMembros).toHaveBeenCalledTimes(2);
      expect(mockGrupoRepository.setPontuacaoTotal).toHaveBeenCalledWith(1, 10);
      expect(mockGrupoRepository.setPontuacaoTotal).toHaveBeenCalledWith(2, 5);
      expect(resultado).toEqual(gruposMock);
    });
  });

  describe("adicionarMembro", () => {
    const grupoId = 1;
    const usuarioId = 100;
    const grupoAberto = { id: grupoId, encerrado: false, pontuacaoTotal: 50 };
    const grupoAtualizado = {
      id: grupoId,
      encerrado: false,
      pontuacaoTotal: 150,
    };

    it("deve adicionar o membro, atualizar a pontuação e retornar o grupo atualizado", async () => {
      mockGrupoRepository.obterPorId.mockResolvedValueOnce(grupoAberto);

      mockGrupoRepository.getMembros.mockResolvedValueOnce([]);

      mockGrupoRepository.obterPorId.mockResolvedValueOnce(grupoAtualizado);

      jest.spyOn(grupoService, "atualizarPontuacao").mockResolvedValue(true);

      const resultado = await grupoService.adicionarMembro(grupoId, usuarioId);

      expect(mockGrupoRepository.obterPorId).toHaveBeenCalledTimes(2);
      expect(mockGrupoRepository.adicionarMembro).toHaveBeenCalledWith(
        grupoId,
        usuarioId,
      );
      expect(grupoService.atualizarPontuacao).toHaveBeenCalledWith(grupoId);
      expect(resultado).toEqual(grupoAtualizado);

      grupoService.atualizarPontuacao.mockRestore();
    });

    it("deve lançar erro se o grupo não for encontrado", async () => {
      mockGrupoRepository.obterPorId.mockResolvedValue(null);

      await expect(
        grupoService.adicionarMembro(999, usuarioId),
      ).rejects.toThrow("Grupo não encontrado.");
    });

    it("deve lançar erro se o grupo estiver encerrado", async () => {
      const grupoEncerrado = { id: grupoId, encerrado: true };
      mockGrupoRepository.obterPorId.mockResolvedValue(grupoEncerrado);

      await expect(
        grupoService.adicionarMembro(grupoId, usuarioId),
      ).rejects.toThrow(
        "Não é possível adicionar membros a um grupo encerrado.",
      );
    });

    it("deve lançar erro se o usuário já for membro do grupo", async () => {
      mockGrupoRepository.obterPorId.mockResolvedValue(grupoAberto);
      const membrosExistentes = [{ id: usuarioId }, { id: 101 }];
      mockGrupoRepository.getMembros.mockResolvedValue(membrosExistentes);

      await expect(
        grupoService.adicionarMembro(grupoId, usuarioId),
      ).rejects.toThrow("Usuário já faz parte do grupo.");
      expect(mockGrupoRepository.adicionarMembro).not.toHaveBeenCalled();
    });
  });

  describe("obterVencedor", () => {
    const grupoId = 1;
    const membroVencedor = { id: 3, nome: "Vencedor", saldoMoedaCapiba: 150 };
    const membrosMock = [
      { id: 1, nome: "A", saldoMoedaCapiba: 50 },
      { id: 2, nome: "B", saldoMoedaCapiba: 100 },
      membroVencedor,
    ];

    it("deve retornar o membro com maior saldo e setar o vencedor no repo", async () => {
      mockGrupoRepository.getMembros.mockResolvedValue(membrosMock);
      mockGrupoRepository.setVencedor.mockResolvedValue(true);

      const resultado = await grupoService.obterVencedor(grupoId);

      expect(resultado).toEqual(membroVencedor);
      expect(mockGrupoRepository.setVencedor).toHaveBeenCalledWith(
        grupoId,
        membroVencedor.id,
      );
    });

    it("deve retornar null se não houver membros", async () => {
      mockGrupoRepository.getMembros.mockResolvedValue([]);

      const resultado = await grupoService.obterVencedor(grupoId);

      expect(resultado).toBeNull();
      expect(mockGrupoRepository.setVencedor).not.toHaveBeenCalled();
    });

    it("deve tratar saldos nulos corretamente e escolher o maior (mesmo que seja zero)", async () => {
      const membrosComNulos = [
        { id: 1, nome: "A", saldoMoedaCapiba: null },
        { id: 2, nome: "B", saldoMoedaCapiba: 0 },
        { id: 3, nome: "C", saldoMoedaCapiba: -50 },
      ];
      mockGrupoRepository.getMembros.mockResolvedValue(membrosComNulos);

      const resultado = await grupoService.obterVencedor(grupoId);

      expect(resultado.id).toBe(2);
      expect(mockGrupoRepository.setVencedor).toHaveBeenCalledWith(grupoId, 2);
    });
  });

  describe("encerrarGrupo", () => {
    const grupoId = 1;
    const grupoNaoEncerrado = {
      id: grupoId,
      nome: "Final",
      encerrado: false,
      pontuacaoTotal: 200,
    };
    const vencedorMock = { id: 10, nome: "Campeão", saldoMoedaCapiba: 150 };

    beforeEach(() => {
      jest.spyOn(grupoService, "obterVencedor").mockResolvedValue(vencedorMock);
    });

    afterEach(() => {
      grupoService.obterVencedor.mockRestore();
    });

    it("deve encerrar o grupo, setar o vencedor e retornar o status final", async () => {
      mockGrupoRepository.obterPorId.mockResolvedValue(grupoNaoEncerrado);

      const resultado = await grupoService.encerrarGrupo(grupoId);

      expect(grupoService.obterVencedor).toHaveBeenCalledWith(grupoId);
      expect(mockGrupoRepository.setEncerrado).toHaveBeenCalledWith(
        grupoId,
        true,
      );
      expect(mockGrupoRepository.setVencedor).toHaveBeenCalledWith(
        grupoId,
        vencedorMock.id,
      );

      expect(resultado).toEqual({
        id: grupoId,
        nome: grupoNaoEncerrado.nome,
        vencedor: vencedorMock.nome,
        pontuacaoTotal: grupoNaoEncerrado.pontuacaoTotal,
        encerrado: true,
      });
    });

    it("deve lançar um erro se o grupo já estiver encerrado", async () => {
      const grupoEncerrado = { id: grupoId, encerrado: true };
      mockGrupoRepository.obterPorId.mockResolvedValue(grupoEncerrado);

      await expect(grupoService.encerrarGrupo(grupoId)).rejects.toThrow(
        "O grupo já foi encerrado.",
      );
      expect(grupoService.obterVencedor).not.toHaveBeenCalled();
      expect(mockGrupoRepository.setEncerrado).not.toHaveBeenCalled();
    });

    it("deve setar o vencedor como null se não houver membros", async () => {
      grupoService.obterVencedor.mockResolvedValue(null);
      mockGrupoRepository.obterPorId.mockResolvedValue(grupoNaoEncerrado);

      const resultado = await grupoService.encerrarGrupo(grupoId);

      expect(mockGrupoRepository.setVencedor).toHaveBeenCalledWith(
        grupoId,
        null,
      );
      expect(resultado.vencedor).toBeNull();
    });
  });

  describe("verificarGruposExpirados", () => {
    const grupoExpirado = {
      id: 1,
      nome: "A",
      encerrado: false,
      dataFim: "2025-10-10",
    };
    const grupoAtivo = {
      id: 2,
      nome: "B",
      encerrado: false,
      dataFim: "2025-10-20",
    };
    const grupoFechado = {
      id: 3,
      nome: "C",
      encerrado: true,
      dataFim: "2025-10-05",
    };

    it("deve encerrar apenas grupos que não estão encerrados e cuja dataFim já passou", async () => {
      mockGrupoRepository.listar.mockResolvedValue([
        grupoExpirado,
        grupoAtivo,
        grupoFechado,
      ]);

      jest.spyOn(grupoService, "encerrarGrupo").mockResolvedValue(true);

      await grupoService.verificarGruposExpirados();

      expect(grupoService.encerrarGrupo).toHaveBeenCalledTimes(1);
      expect(grupoService.encerrarGrupo).toHaveBeenCalledWith(grupoExpirado.id);

      grupoService.encerrarGrupo.mockRestore();
    });
  });

  describe("removerGrupo", () => {
    it("deve chamar o repositório para remover o grupo", async () => {
      mockGrupoRepository.removerGrupo.mockResolvedValue({ count: 1 });

      const resultado = await grupoService.removerGrupo(1);

      expect(resultado).toEqual({ count: 1 });
      expect(mockGrupoRepository.removerGrupo).toHaveBeenCalledWith(1);
    });
  });
});
