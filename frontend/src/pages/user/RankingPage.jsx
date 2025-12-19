import React, { useEffect, useState, useContext } from "react";
import {
  RankingRow,
  UserPodium,
} from "../../components/user/RankingComponents";
import { ArrowLeft, Trophy, Users } from "lucide-react";
import api from "../../services/api";
import { AuthContext } from "../../context/AuthContext";

const RankingPage = ({ competitionId }) => {
  const id = competitionId;
  const { user: currentUser } = useContext(AuthContext);
  const [itens, setItens] = useState([]);
  const [loading, setLoading] = useState(true);
  const [titulo, setTitulo] = useState("Ranking Global");

  useEffect(() => {
    const fetchRanking = async () => {
      setLoading(true);
      try {
        let response;
        let dadosRaw;

        if (id) {
          console.log("Buscando ranking da competição:", id);
          response = await api.get(`/competicoes/${id}/ranking`);
          setTitulo("Ranking da Competição");
          dadosRaw = response.data;
        } else {
          response = await api.get("/usuarios");
          setTitulo("Ranking Geral");
          dadosRaw = response.data;
        }

       
        const dadosOrdenados = dadosRaw.sort((a, b) => {
            const pontosA = a.moedasCapiba || a.saldoMoedaCapiba || a.pontuacao || 0;
            const pontosB = b.moedasCapiba || b.saldoMoedaCapiba || b.pontuacao || 0;
            return pontosB - pontosA; 
        });

        setItens(dadosOrdenados);
      } catch (error) {
        console.error("Erro ao buscar ranking", error);
        setItens([]);
      } finally {
        setLoading(false);
      }
    };

    fetchRanking();
  }, [id]);

  const formatarItem = (item) => {
    return {
      ...item,
      id: item.id,
      name: item.nome || item.name || item.nome_grupo || "Participante",
      avatar: item.foto || item.fotoUrl || item.avatar || item.logo,
      saldoMoedaCapiba: item.moedasCapiba ?? item.saldoMoedaCapiba ?? item.pontuacao ?? 0,
    };
  };

  if (loading)
    return (
      <div className="p-10 text-center text-white flex justify-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white"></div>
      </div>
    );

  const top3 = itens.slice(0, 3);
  const rest = itens.slice(3);

  const myUserFresh = itens.find((u) => u.id === currentUser?.id);
  const displayUser = myUserFresh ? formatarItem(myUserFresh) : null;
  const myPosition = itens.findIndex((u) => u.id === currentUser?.id) + 1;

  return (
    <div className="w-full min-h-screen bg-gradient-to-b from-blue-600 to-blue-800 flex flex-col items-center">
      
      <header className="w-full max-w-2xl p-6 flex justify-between items-center text-white">
        <a
          href="#/perfil"
          className="p-2 bg-white/20 rounded-full hover:bg-white/30 backdrop-blur-sm transition"
        >
          <ArrowLeft className="w-6 h-6" />
        </a>
        <h1 className="text-2xl font-bold flex items-center gap-2">
          {id ? (
            <Users className="w-6 h-6 text-yellow-300" />
          ) : (
            <Trophy className="w-6 h-6 text-yellow-300" />
          )}
          {titulo}
        </h1>
        <div className="w-10"></div>
      </header>

      <div className="w-full max-w-2xl px-4 mt-4 mb-8">
        <div className="flex justify-center items-end gap-4">
          {top3[1] && (
            <UserPodium user={formatarItem(top3[1])} position={2} delay={200} />
          )}
          

          {top3[0] && (
            <UserPodium
              user={formatarItem(top3[0])}
              position={1}
              isWinner
              delay={0}
            />
          )}
          
          {top3[2] && (
            <UserPodium user={formatarItem(top3[2])} position={3} delay={400} />
          )}
        </div>
      </div>

      <div className="w-full flex-1 bg-white rounded-t-3xl shadow-[0_-10px_40px_rgba(0,0,0,0.2)] p-6 pb-24 md:max-w-2xl overflow-hidden animate-slide-up">
        
        {!id && currentUser && (
          <div className="mb-6 p-4 bg-blue-50 border border-blue-100 rounded-xl flex items-center justify-between shadow-sm">
            <div className="flex items-center gap-4">
              <span className="font-bold text-xl text-blue-600">
                #{myPosition > 0 ? myPosition : '-'}
              </span>
              <span className="font-semibold text-gray-800">Você</span>
            </div>
            
            <span className="font-bold text-blue-600">
              {displayUser ? displayUser.saldoMoedaCapiba : 0} pts
            </span>
          </div>
        )}

        <h3 className="text-gray-400 font-bold uppercase text-xs tracking-wider mb-4">
          Classificação Geral
        </h3>

        <div className="flex flex-col gap-3">
          {rest.map((item, index) => (
            <RankingRow
              key={item.id || index}
              user={formatarItem(item)}
              position={index + 4}
            />
          ))}
          {rest.length === 0 && top3.length === 0 && (
            <p className="text-center text-gray-400 py-4">
              Nenhum competidor encontrado.
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default RankingPage;