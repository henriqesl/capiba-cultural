import React, { useState, useEffect } from "react";
import {
  Trophy,
  Star,
  CheckCircle,
  TrendingUp,
  Wallet,
  Target,
} from "lucide-react";
import api from "../services/api";
import ConfirmedEventRow from "../components/status/ConfirmedEventRow";
import StatusCard from "../components/status/StatusCard";
import { useAuth } from "../context/AuthContext";

const StatusPage = () => {
  const { user } = useAuth();
  const [missoes, setMissoes] = useState([]);
  const [historico, setHistorico] = useState([]);
  const [saldo, setSaldo] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      if (!user) return;
      try {
        const userRes = await api.get(`/usuarios/${user.id}`);
        setSaldo(userRes.data.saldoMoedaCapiba || 0);

        const missoesRes = await api.get(`/missoes?usuarioId=${user.id}`);
        setMissoes(missoesRes.data || []);

        const checkinsRes = await api.get(`/checkin/historico/${user.id}`);
        setHistorico(checkinsRes.data || []);
      } catch (error) {
        console.error("Erro ao carregar status:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [user]);

  if (loading) {
    return (
      <div className="p-8 text-center text-gray-500">
        Carregando suas conquistas...
      </div>
    );
  }

  return (
    <div className="p-4 md:p-8 space-y-6 bg-gray-50 min-h-screen pb-24">
      {}
      <div className="bg-gradient-to-r from-blue-600 to-blue-800 rounded-3xl p-6 text-white shadow-lg flex justify-between items-center relative overflow-hidden">
        <div className="relative z-10">
          <p className="text-blue-200 text-sm font-medium mb-1">
            Seu Saldo Atual
          </p>
          <h1 className="text-4xl font-bold flex items-center gap-2">
            {saldo}{" "}
            <span className="text-2xl font-normal opacity-80">Capibas</span>
          </h1>
        </div>
        <div className="bg-white/20 p-4 rounded-full relative z-10 backdrop-blur-sm">
          <Wallet className="w-8 h-8 text-white" />
        </div>
        {}
        <div className="absolute -right-10 -bottom-10 w-40 h-40 bg-white/10 rounded-full blur-2xl"></div>
      </div>

      {}
      <div className="grid grid-cols-2 gap-4">
        <StatusCard
          icon={Target}
          title="Missões Ativas"
          value={missoes.filter((m) => !m.completada).length}
          color="text-orange-500"
          bg="bg-orange-50"
        />
        <StatusCard
          icon={CheckCircle}
          title="Eventos Visitados"
          value={historico.length}
          color="text-green-500"
          bg="bg-green-50"
        />
      </div>

      {}
      <div>
        <h2 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
          <Trophy className="w-5 h-5 text-yellow-500" /> Missões & Conquistas
        </h2>
        <div className="space-y-3">
          {missoes.length > 0 ? (
            missoes.map((missao) => (
              <div
                key={missao.id}
                className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 relative overflow-hidden"
              >
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <h3 className="font-bold text-gray-800">{missao.titulo}</h3>
                    <p className="text-xs text-gray-500">{missao.descricao}</p>
                  </div>
                  <span className="bg-yellow-100 text-yellow-700 text-xs font-bold px-2 py-1 rounded-lg flex items-center gap-1">
                    +{missao.recompensa}{" "}
                    <Star className="w-3 h-3 fill-current" />
                  </span>
                </div>

                {}
                <div className="w-full bg-gray-100 rounded-full h-2.5 mt-3">
                  <div
                    className={`h-2.5 rounded-full transition-all duration-500 ${missao.completada ? "bg-green-500" : "bg-blue-600"}`}
                    style={{
                      width: `${Math.min((missao.progressoAtual / missao.meta) * 100, 100)}%`,
                    }}
                  ></div>
                </div>
                <div className="flex justify-between text-xs mt-1 text-gray-500 font-medium">
                  <span>
                    {missao.progressoAtual} / {missao.meta}
                  </span>
                  {missao.completada && (
                    <span className="text-green-600 font-bold">Concluída!</span>
                  )}
                </div>
              </div>
            ))
          ) : (
            <p className="text-center text-gray-400 py-4 bg-white rounded-xl border border-dashed border-gray-200">
              Nenhuma missão ativa no momento.
            </p>
          )}
        </div>
      </div>

      {}
      <div>
        <h2 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
          <TrendingUp className="w-5 h-5 text-blue-500" /> Histórico Recente
        </h2>
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 divide-y divide-gray-100">
          {historico.length > 0 ? (
            historico
              .slice(0, 5)
              .map((checkin) => (
                <ConfirmedEventRow
                  key={checkin.id}
                  evento={checkin.evento}
                  data={checkin.data}
                />
              ))
          ) : (
            <div className="p-6 text-center text-gray-400 text-sm">
              Você ainda não participou de eventos.
              <br />
              Faça seu primeiro check-in!
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default StatusPage;
