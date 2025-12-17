import { useEffect, useState } from "react";
import grupoCompeticaoService from "../services/grupoCompeticaoService";

export default function GrupoCompeticoes() {
  const [grupos, setGrupos] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    grupoCompeticaoService
      .listar()
      .then((res) => {
        setGrupos(res.data);
      })
      .catch((err) => {
        console.error("Erro ao buscar grupos", err);
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  if (loading) return <p>Carregando grupos...</p>;

  return (
    <div>
      <h1>Grupos de Competição</h1>

      {grupos.length === 0 && <p>Nenhum grupo encontrado.</p>}

      {grupos.map((grupo) => (
        <div key={grupo.id}>
          <strong>{grupo.nome}</strong>
          <p>Pontuação: {grupo.pontuacaoTotal}</p>
          <p>Membros: {grupo.membros?.length || 0}</p>
        </div>
      ))}
    </div>
  );
}
