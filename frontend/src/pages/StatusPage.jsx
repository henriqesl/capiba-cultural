import React, { useEffect, useState, useContext } from 'react';
import StatusCard from '../components/status/StatusCard';
import ConfirmedEventRow from '../components/status/ConfirmedEventRow';
import api from '../services/api';
import { AuthContext } from '../context/AuthContext';

const StatusPage = () => {
   const { user } = useContext(AuthContext);
   const [checkins, setCheckins] = useState([]);
   const [loading, setLoading] = useState(true);
   const [missoes, setMissoes] = useState([]);

   useEffect(() => {
  if (user?.id) {
     // ROTA CORRIGIDA (removendo "s" de /missoes, mas verifique se seu api.js não precisa de /api/missao)
     api.get(`/missao/${user.id}`) 
       .then(res => {
            console.log("Missões carregadas:", res.data); // DEBUG: Verifique se aqui não está vazio
            setMissoes(res.data || []);
        })
       .catch(error => {
            console.error("Erro ao carregar missões:", error);
            setMissoes([]);
        })
       .finally(() => setLoading(false));
  }
   }, [user]);

   const totalCheckins = checkins.length;

   const conquistas = [
  { id: 1, nome: "Primeiro Passo", descricao: "Fez seu primeiro check-in", conquistada: totalCheckins >= 1 },
  { id: 2, nome: "Fã de Carteirinha", descricao: "Foi em 5 eventos", conquistada: totalCheckins >= 5 },
  { id: 3, nome: "Lenda Local", descricao: "Foi em 10 eventos", conquistada: totalCheckins >= 10 }
   ];

   return (
  <div className="bg-gray-100 min-h-screen p-4 sm:p-8 pb-24 md:pb-8">
     <h1 className="text-3xl sm:text-4xl font-bold text-center mb-8 sm:mb-12 text-gray-800">
       Meu Status
     </h1>

     <div className="max-w-6xl mx-auto">

       {/* Missões */}
       <section className="mb-10">
      <h2 className="text-2xl font-bold mb-6 text-gray-700 border-b-2 border-blue-600 pb-2 inline-block">
         Missões Ativas
      </h2>
      <div className="grid grid-cols-1 gap-6">
         {loading && <p className="text-blue-500">Carregando missões...</p>}
         {!loading && missoes.length === 0 && <p className="text-gray-500">Nenhuma missão ativa.</p>}

         {missoes.map(missao => (
           <StatusCard
          key={missao.id}
          variant="mission"
          title={missao.titulo}
          progress={missao.progressoAtual}
          total={missao.valorRequisito}
          reward={`${missao.recompensaCapibas} Capibas`}
          // NOVO: Passa a informação de conclusão para o StatusCard
          isComplete={missao.progressoAtual >= missao.valorRequisito} 
           />
         ))}
      </div>
       </section>

       {/* Conquistas (Mantido inalterado) */}
       <section className="mb-10">
      <h2 className="text-2xl font-bold mb-6 text-gray-700 border-b-2 border-blue-600 pb-2 inline-block">
         Conquistas
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
         {conquistas.map(conquista => (
           <StatusCard
          key={conquista.id}
          variant="achievement"
          title={conquista.nome}
          description={conquista.descricao}
          isUnlocked={conquista.conquistada}
           />
         ))}
      </div>
       </section>

       {/* Check-ins (Mantido inalterado) */}
       <section>
      <h2 className="text-2xl font-bold mb-6 text-gray-700 border-b-2 border-blue-600 pb-2 inline-block">
         Eventos Confirmados
      </h2>
      {loading ? <p>Carregando...</p> : (
         <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
           {checkins.length === 0 && <p className="text-gray-500">Nenhum check-in realizado ainda.</p>}
           {checkins.map(checkin => (
          <ConfirmedEventRow
             key={checkin.id}
             title={checkin.evento?.nome || "Evento Desconhecido"}
             date={new Date(checkin.data).toLocaleDateString()}
          />
           ))}
         </div>
      )}
       </section>
     </div>
  </div>
   );
};

export default StatusPage;