import React, { useEffect, useState, useContext } from 'react';
import { RankingRow, UserPodium } from '../../components/user/RankingComponents';
import { ArrowLeft, Trophy } from 'lucide-react';
import api from '../../services/api';
import { AuthContext } from '../../context/AuthContext';

const RankingPage = () => {
  const { user: currentUser } = useContext(AuthContext);
  const [usuarios, setUsuarios] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRanking = async () => {
      try {
        const response = await api.get('/usuarios');
        // Ordena por saldo decrescente
        const sortedUsers = response.data.sort((a, b) => b.saldoMoedaCapiba - a.saldoMoedaCapiba);
        setUsuarios(sortedUsers);
      } catch (error) {
        console.error("Erro ao buscar ranking", error);
      } finally {
        setLoading(false);
      }
    };

    fetchRanking();
  }, []);

  if (loading) return <div className="p-10 text-center">Carregando Ranking...</div>;

  // Separa o Top 3 do resto
  const top3 = usuarios.slice(0, 3);
  const rest = usuarios.slice(3);

  // Encontra a posição do usuário logado
  const myPosition = usuarios.findIndex(u => u.id === currentUser?.id) + 1;

  return (
    <div className="w-full min-h-screen bg-linear-to-b from-blue-600 to-blue-800 flex flex-col items-center">
      
      {/* Header */}
      <header className="w-full max-w-2xl p-6 flex justify-between items-center text-white">
        <a href="#/perfil" className="p-2 bg-white/20 rounded-full hover:bg-white/30 backdrop-blur-sm transition">
          <ArrowLeft className="w-6 h-6" />
        </a>
        <h1 className="text-2xl font-bold flex items-center gap-2">
          <Trophy className="w-6 h-6 text-yellow-300" />
          Ranking Global
        </h1>
        <div className="w-10"></div>
      </header>

      {/* Pódio (Top 3) */}
      <div className="w-full max-w-2xl px-4 mt-4 mb-8">
        <div className="flex justify-center items-end gap-4">
          {top3[1] && <UserPodium user={top3[1]} position={2} delay={200} />}
          {top3[0] && <UserPodium user={top3[0]} position={1} isWinner delay={0} />}
          {top3[2] && <UserPodium user={top3[2]} position={3} delay={400} />}
        </div>
      </div>

      {/* Lista do Restante */}
      <div className="w-full flex-1 bg-white rounded-t-3xl shadow-[0_-10px_40px_rgba(0,0,0,0.2)] p-6 pb-24 md:max-w-2xl overflow-hidden animate-slide-up">
        
        {/* Minha Posição (Sticky) */}
        {currentUser && (
            <div className="mb-6 p-4 bg-blue-50 border border-blue-100 rounded-xl flex items-center justify-between shadow-xs">
            <div className="flex items-center gap-4">
                <span className="font-bold text-xl text-blue-600">#{myPosition}</span>
                <span className="font-semibold text-gray-800">Você</span>
            </div>
            <span className="font-bold text-blue-600">{currentUser.saldoMoedaCapiba || 0} pts</span>
            </div>
        )}

        <h3 className="text-gray-400 font-bold uppercase text-xs tracking-wider mb-4">Classificação Geral</h3>
        
        <div className="flex flex-col gap-3">
          {rest.map((user, index) => (
            <RankingRow 
              key={user.id} 
              user={user} 
              position={index + 4} // Começa do 4
            />
          ))}
          {rest.length === 0 && <p className="text-center text-gray-400 py-4">Sem mais competidores.</p>}
        </div>
      </div>
    </div>
  );
};

export default RankingPage;