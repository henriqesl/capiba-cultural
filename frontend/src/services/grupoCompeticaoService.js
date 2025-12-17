import api from "./api";

const grupoCompeticaoService = {
  listar() {
    return api.get("/grupo");
  },

  obterPorId(id) {
    return api.get(`/grupo/${id}`);
  },

  criar(data) {
    return api.post("/grupo", data);
  },

  adicionarMembro(grupoId, usuarioId) {
    return api.post(`/grupo/${grupoId}/membros`, { usuarioId });
  },

  encerrar(grupoId) {
    return api.post(`/grupo/${grupoId}/encerrar`);
  }
};

export default grupoCompeticaoService;
