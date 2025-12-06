import React, { useState } from 'react';
import { ArrowLeft, Calendar, MapPin, Share2, Copy, Check, Crown, UserCircle2 } from 'lucide-react';

const CaravanaDetailsPage = ({ id, onBack }) => {
  const [copied, setCopied] = useState(false);

  // 1. DADOS MOCKADOS (Sincronizados com a tela de listagem)
  const mockCaravanaData = {
    1: { 
      nome: "Caravana do Rock", 
      evento: "Show de Rock Nacional", 
      data: "15/11", 
      local: "Allianz Parque", 
      link: "app.com/c/rock", 
      membrosCount: 15,
      souDono: true // <--- ID 1: Você é o dono
    },
    2: { 
      nome: "Busão do Jazz", 
      evento: "Festival de Jazz", 
      data: "20/11", 
      local: "Parque Ibirapuera", 
      link: "app.com/c/jazz", 
      membrosCount: 42,
      souDono: false // <--- ID 2: Você NÃO é o dono
    },
    3: { 
      nome: "Van Cultural", 
      evento: "Peça 'Auto da Compadecida'", 
      data: "05/12", 
      local: "Teatro Municipal", 
      link: "app.com/c/teatro", 
      membrosCount: 4,
      souDono: false // <--- ID 3: Você NÃO é o dono
    },
  };

  // Garante que pega o ID certo ou usa o 1 como fallback
  const details = mockCaravanaData[id] || mockCaravanaData[1];

  // 2. LOGICA DE MEMBROS
  // Cria o usuário "Você" dinamicamente baseado no 'souDono'
  const currentUser = {
    id: 99, // ID alto para não conflitar
    nome: "Você",
    status: details.souDono ? "Organizador" : "Confirmado", // Se não for dono, é apenas membro
    isOwner: details.souDono // Define se ganha a coroa
  };

  // Membros fictícios genéricos
  const outrosMembros = [
    { id: 2, nome: "Ana Pereira", status: "Confirmado", isOwner: false },
    { id: 3, nome: "João Souza", status: "Pendente", isOwner: false },
    { id: 4, nome: "Carlos Lima", status: "Pago", isOwner: false },
  ];

  // Se eu NÃO sou o dono, precisamos adicionar um dono fictício na lista para mostrar quem organiza
  if (!details.souDono) {
    outrosMembros.unshift({ id: 100, nome: "Organizador da Van", status: "Organizador", isOwner: true });
  }

  // Junta você com os outros
  const listaMembros = [currentUser, ...outrosMembros];


  const handleCopyLink = () => {
    navigator.clipboard.writeText(details.link);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="w-full min-h-screen bg-gray-50 flex flex-col items-center pb-20">
      <div className="w-full max-w-md bg-white min-h-screen md:min-h-fit md:rounded-2xl md:shadow-xl md:my-8 flex flex-col">
        
        {/* Header */}
        <header className="bg-white p-4 flex items-center border-b border-gray-100 sticky top-0 z-10">
          <button onClick={onBack} className="p-2 -ml-2 hover:bg-gray-100 rounded-full text-gray-600">
            <ArrowLeft className="w-6 h-6" />
          </button>
          <h1 className="text-lg font-bold text-gray-800 ml-2">Detalhes do Grupo</h1>
        </header>

        <main className="p-6 flex flex-col gap-6">
          
          {/* Info Principal */}
          <section>
            <h2 className="text-2xl font-bold text-blue-600 mb-1">{details.nome}</h2>
            <p className="text-gray-700 font-medium mb-4">{details.evento}</p>
            
            <div className="space-y-3 bg-blue-50 p-4 rounded-xl border border-blue-100">
              <div className="flex items-center gap-3 text-gray-600 text-sm">
                <Calendar className="w-5 h-5 text-blue-500" />
                <span>{details.data} • 19:00</span>
              </div>
              <div className="flex items-center gap-3 text-gray-600 text-sm">
                <MapPin className="w-5 h-5 text-blue-500" />
                <span>{details.local}</span>
              </div>
            </div>
          </section>

          {/* Compartilhar */}
          <section className="border-t border-gray-100 pt-6">
            <h3 className="text-sm font-bold text-gray-500 uppercase tracking-wider mb-3">Convidar amigos</h3>
            <div className="flex gap-2">
              <div className="grow bg-gray-100 p-3 rounded-lg text-sm text-gray-600 font-mono truncate border border-gray-200">
                {details.link}
              </div>
              <button 
                onClick={handleCopyLink}
                className={`px-4 rounded-lg font-medium transition-colors flex items-center justify-center ${
                  copied ? 'bg-green-500 text-white' : 'bg-blue-600 text-white hover:bg-blue-700'
                }`}
              >
                {copied ? <Check className="w-5 h-5" /> : <Copy className="w-5 h-5" />}
              </button>
            </div>
          </section>

          {/* Lista de Membros */}
          <section className="border-t border-gray-100 pt-6">
            <div className="flex justify-between items-end mb-4">
              <h3 className="text-lg font-bold text-gray-800">Quem vai</h3>
              {/* Usa o contador do mock */}
              <span className="text-sm text-gray-500">{details.membrosCount} pessoas</span>
            </div>

            <div className="space-y-3">
              {listaMembros.map((m) => (
                <div key={m.id} className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center text-gray-500">
                      <UserCircle2 className="w-6 h-6" />
                    </div>
                    <div>
                      <p className="text-sm font-bold text-gray-800 flex items-center gap-1">
                        {m.nome}
                        {/* Renderiza coroa APENAS se isOwner for true */}
                        {m.isOwner && <Crown className="w-3 h-3 text-yellow-500 fill-yellow-500" />}
                      </p>
                      <p className={`text-xs ${m.isOwner ? 'text-blue-600 font-semibold' : 'text-gray-500'}`}>
                        {m.status}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
              
              <div className="text-center pt-2">
                <button className="text-sm text-blue-600 hover:underline">Ver todos os membros</button>
              </div>
            </div>
          </section>

        </main>
      </div>
    </div>
  );
};

export default CaravanaDetailsPage;