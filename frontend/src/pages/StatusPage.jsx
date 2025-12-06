import React from 'react';
import StatusCard from '../components/status/StatusCard';
import ConfirmedEventRow from '../components/status/ConfirmedEventRow';

const StatusPage = () => {
  // Dados simulados
  const missoes = [
    { id: 1, titulo: "Ir em 5 eventos", progresso: 3, total: 5, recompensa: "50 Capibas" },
    { id: 2, titulo: "Visitar 3 lugares diferentes", progresso: 1, total: 3, recompensa: "30 Capibas" },
    { id: 3, titulo: "Fazer check-in em evento de rock", progresso: 0, total: 1, recompensa: "20 Capibas" }
  ];

  const conquistas = [
    { id: 1, nome: "Primeira Visita", descricao: "Visitou seu primeiro evento", conquistada: true },
    { id: 2, nome: "Explorador", descricao: "Visitou 5 lugares diferentes", conquistada: false },
    { id: 3, nome: "Aventureiro", descricao: "Participou de 10 eventos", conquistada: false }
  ];

  const eventosConfirmados = [
    { id: 1, nome: "Show de Rock Nacional", data: "[DATA]" },
    { id: 2, nome: "Festival de Jazz", data: "[DATA]" }
  ];

  return (
    <div className="bg-gray-100 min-h-screen p-4 sm:p-8 pb-24 md:pb-8">
      <h1 className="text-3xl sm:text-4xl font-bold text-center mb-8 sm:mb-12 text-gray-800">
        Meu Status
      </h1>

      <div className="max-w-6xl mx-auto">
        
        {/* === Missões === */}
        <section className="mb-10">
          <h2 className="text-2xl font-bold mb-6 text-gray-700 border-b-2 border-blue-600 pb-2 inline-block">
            Missões Ativas
          </h2>
          <div className="grid grid-cols-1 gap-6">
            {missoes.map(missao => (
              <StatusCard
                key={missao.id}
                variant="mission"
                title={missao.titulo}
                progress={missao.progresso}
                total={missao.total}
                reward={missao.recompensa}
              />
            ))}
          </div>
        </section>

        {/* === Conquistas === */}
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

        {/* === Eventos Confirmados === */}
        <section>
          <h2 className="text-2xl font-bold mb-6 text-gray-700 border-b-2 border-blue-600 pb-2 inline-block">
            Eventos Confirmados
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {eventosConfirmados.map(evento => (
              <ConfirmedEventRow
                key={evento.id}
                title={evento.nome}
                date={evento.data}
              />
            ))}
          </div>
        </section>

      </div>
    </div>
  );
};

export default StatusPage;

/*
  [O QUE FALTA]
  1. O banco de dados (`schema.prisma`) tem tabela de Check-in, mas não tem tabelas para 
     "Missões" ou "Conquistas".
  
  Solução Provisória:
  - Deixa as regras das missões fixas aqui no código (ex: "Vá em 5 eventos").
  - Puxa a lista de check-ins do usuário da API.
  - Se a lista tiver 5 itens, a gente pinta a missão de "Concluída" aqui no front mesmo.
*/