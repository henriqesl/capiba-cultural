import React from 'react';
// Adicionei 'Crown' nas importações
import { ArrowLeft, Plus, Search, Users, Calendar, ChevronRight, Crown } from 'lucide-react';

const CaravanaPage = ({ caravanas = [] }) => {
  
  const handleBack = () => {
    window.location.hash = '#/perfil';
  };

  const handleOpenDetails = (id) => {
    window.location.hash = `#/perfil/caravana/${id}`;
  };

  const handleCreateNew = () => {
    window.location.hash = '#/perfil/caravana/criar';
  };

  const handleSearch = () => {
    alert("Funcionalidade de busca em breve!");
  };

  return (
    <div className="w-full min-h-screen bg-gray-50 flex flex-col items-center pb-10">
      <div className="w-full max-w-md bg-white min-h-screen flex flex-col">
        
        {/* Header */}
        <header className="p-4 flex items-center border-b border-gray-100">
          <button onClick={handleBack} className="p-2 -ml-2 hover:bg-gray-100 rounded-full text-gray-600">
            <ArrowLeft className="w-6 h-6" />
          </button>
          <h1 className="text-lg font-bold text-gray-800 ml-2">Minhas Caravanas</h1>
        </header>

        {/* ÁREA DE AÇÕES */}
        <div className="p-4 grid grid-cols-2 gap-3">
          <button 
            onClick={handleSearch}
            className="flex items-center justify-center gap-2 p-3 rounded-xl border border-gray-200 text-gray-600 font-semibold hover:bg-gray-50 transition-colors"
          >
            <Search className="w-5 h-5" />
            Buscar
          </button>
          
          <button 
            onClick={handleCreateNew}
            className="flex items-center justify-center gap-2 p-3 rounded-xl bg-blue-600 text-white font-semibold hover:bg-blue-700 shadow-lg shadow-blue-200 transition-colors"
          >
            <Plus className="w-5 h-5" />
            Criar Nova
          </button>
        </div>

        {/* Lista de Caravanas */}
        <div className="px-4 pb-4 flex flex-col gap-3">
          <h2 className="text-sm font-bold text-gray-400 uppercase tracking-wider mt-2 mb-1">
            Seus Grupos
          </h2>

          {caravanas.length === 0 ? (
            <div className="py-10 text-center bg-gray-50 rounded-xl border border-dashed border-gray-200">
              <p className="text-gray-500 text-sm">Você não participa de nenhuma caravana.</p>
            </div>
          ) : (
            caravanas.map((c) => (
              <div 
                key={c.id} 
                onClick={() => handleOpenDetails(c.id)}
                className="bg-white border border-gray-100 p-4 rounded-xl shadow-sm hover:shadow-md transition-all cursor-pointer flex justify-between items-center group"
              >
                <div>
                  <h3 className="font-bold text-gray-800 group-hover:text-blue-600 transition-colors">
                    {c.nome}
                  </h3>
                  <p className="text-sm text-gray-500 mb-2">{c.evento}</p>
                  
                  <div className="flex items-center gap-3">
                    <div className="flex items-center gap-1 text-xs text-blue-600 bg-blue-50 px-2 py-1 rounded">
                      <Calendar className="w-3 h-3" />
                      {c.data}
                    </div>

                    {/* Badge de ORGANIZADOR (com coroa) */}
                    {c.souDono && (
                      <div className="flex items-center gap-1 bg-blue-50 px-2 py-1 rounded border border-blue-100">
                        <Crown className="w-3 h-3 text-yellow-500 fill-yellow-500" />
                        <span className="text-[10px] font-bold text-blue-700 uppercase tracking-wide">
                          Organizador
                        </span>
                      </div>
                    )}
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <div className="flex flex-col items-center text-gray-400">
                     <Users className="w-5 h-5 mb-1" />
                     <span className="text-xs font-bold">{c.membrosCount}</span>
                  </div>
                  <ChevronRight className="w-5 h-5 text-gray-300" />
                </div>
              </div>
            ))
          )}
        </div>

      </div>
    </div>
  );
};

export default CaravanaPage;