import React from 'react';
// 1. Removi imports antigos e adicionei os da Lucide
import { ArrowLeft, Plus, Search } from 'lucide-react';

import Button from '../../components/Button.jsx';
// Removi o componente 'Icon' antigo pois não precisamos mais dele
// import { Icon } from '../../components/user/UserShared'; 
import { CaravanaItem } from '../../components/caravana/CaravanaItem';

const CaravanaPage = () => {
  const minhasCaravanas = [
    { id: 1, nome: "Caravana do Rock", evento: "Show de Rock Nacional", data: "15/11", membros: 15, dono: true },
    { id: 2, nome: "Busão do Jazz", evento: "Festival de Jazz", data: "20/11", membros: 42, dono: false },
    { id: 3, nome: "Van Cultural", evento: "Peça 'Auto da Compadecida'", data: "05/12", membros: 4, dono: false },
  ];

  return (
    <div className="w-full min-h-screen bg-gray-50 flex flex-col items-center">
      
      <div className="w-full max-w-md md:max-w-4xl bg-white md:rounded-2xl md:shadow-xl md:my-8 flex flex-col min-h-screen md:min-h-fit">
        
        {/* === HEADER MOBILE === */}
        <header className="bg-blue-600 text-white p-4 flex justify-between items-center md:hidden">
          <a href="#/perfil" className="hover:opacity-80">
            {/* Ícone Voltar Mobile */}
            <ArrowLeft className="w-6 h-6" />
          </a>
          <h1 className="text-xl font-bold">Minhas Caravanas</h1>
          <div className="w-6"></div>
        </header>

        {/* === HEADER DESKTOP === */}
        <header className="hidden md:flex p-4 items-center border-b border-gray-200">
          <a href="#/perfil" className="text-gray-600 hover:text-blue-600 transition-colors p-2 rounded-full hover:bg-gray-100">
            {/* Ícone Voltar Desktop */}
            <ArrowLeft className="w-6 h-6" />
          </a>
          <h1 className="text-xl font-bold text-gray-800 ml-4">Minhas Caravanas</h1>
        </header>

        <main className="p-6 pb-24 md:p-8 flex flex-col h-full">
          
          {/* Seção de Listagem */}
          <section className="mb-8 grow">
            <div className="flex justify-between items-end mb-4 border-b border-gray-200 pb-2">
              <h2 className="text-lg font-bold text-gray-800">Próximas Viagens</h2>
              <span className="text-sm text-gray-500">{minhasCaravanas.length} ativas</span>
            </div>
            
            <div className="flex flex-col gap-2">
              {minhasCaravanas.map(c => (
                <CaravanaItem
                  key={c.id}
                  name={c.nome}
                  eventName={c.evento}
                  date={c.data} 
                  membersCount={c.membros}
                  isOwner={c.dono}
                  onClick={() => alert(`Abrir detalhes da caravana: ${c.nome}`)}
                />
              ))}
            </div>
          </section>

          {/* Botões de Ação */}
          <section className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-auto pt-4 border-t border-gray-100">
            
            {/* Botão Criar */}
            <Button 
                variant="primary" 
                className="bg-blue-600! text-white! hover:bg-blue-700! flex justify-center items-center gap-2 shadow-md border-none!"
            >
              {/* Ícone Plus adicionado aqui */}
              <Plus className="w-5 h-5" />
              <span>Criar Nova Caravana</span>
            </Button>
            
            {/* Botão Buscar */}
            <Button 
                variant="primary" 
                className="bg-blue-600! text-white! hover:bg-blue-700! flex justify-center items-center gap-2 shadow-md border-none!"
            >
              {/* Troquei o emoji 🔍 pelo componente Search para manter o padrão */}
              <Search className="w-5 h-5" />
              <span>Buscar Caravanas</span>
            </Button>
          </section>

        </main>
      </div>
    </div>
  );
};

export default CaravanaPage;