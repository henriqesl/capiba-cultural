import React from 'react';

const StatusPage = () => {
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
        {/* Missões */}
        <section className="mb-10">
          <h2 className="text-2xl font-bold mb-6 text-gray-700 border-b-2 border-blue-600 pb-2 inline-block">
            Missões Ativas
          </h2>
          <div className="grid grid-cols-1 gap-6">
            {missoes.map(missao => (
              <div key={missao.id} className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow">
                <div className="flex justify-between items-start mb-3">
                  <h3 className="font-bold text-xl text-gray-800">{missao.titulo}</h3>
                  <span className="text-sm bg-blue-600 text-white px-3 py-1 rounded-full font-semibold">
                    {missao.recompensa}
                  </span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-8 mb-2">
                  <div 
                    className="bg-blue-600 h-8 rounded-full flex items-center justify-center text-white text-sm font-bold transition-all duration-300"
                    style={{ width: `${(missao.progresso / missao.total) * 100}%` }}
                  >
                    {missao.progresso > 0 && `${missao.progresso}/${missao.total}`}
                  </div>
                </div>
                <p className="text-sm text-gray-500">
                  Progresso: {missao.progresso} de {missao.total}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* Conquistas */}
        <section className="mb-10">
          <h2 className="text-2xl font-bold mb-6 text-gray-700 border-b-2 border-blue-600 pb-2 inline-block">
            Conquistas
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {conquistas.map(conquista => (
              <div 
                key={conquista.id} 
                className={`p-6 rounded-lg shadow-md transition-all hover:shadow-lg ${
                  conquista.conquistada 
                    ? 'bg-white border-2 border-blue-600' 
                    : 'bg-gray-100 border-2 border-gray-300 opacity-75'
                }`}
              >
                <div className="flex items-start gap-4">
                  <span className="text-4xl">
                    {conquista.conquistada ? '🏆' : '🔒'}
                  </span>
                  <div>
                    <h3 className="font-bold text-lg text-gray-800">{conquista.nome}</h3>
                    <p className="text-sm text-gray-600 mt-1">{conquista.descricao}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Eventos Confirmados */}
        <section>
          <h2 className="text-2xl font-bold mb-6 text-gray-700 border-b-2 border-blue-600 pb-2 inline-block">
            Eventos Confirmados
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {eventosConfirmados.map(evento => (
              <div 
                key={evento.id} 
                className="bg-white p-5 rounded-lg shadow-md flex justify-between items-center hover:shadow-lg transition-shadow"
              >
                <div>
                  <h3 className="font-bold text-lg text-gray-800">{evento.nome}</h3>
                  <p className="text-sm text-gray-500 mt-1">📅 {evento.data}</p>
                </div>
                <span className="text-3xl">✅</span>
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
};

export default StatusPage;