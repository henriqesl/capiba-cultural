import React, { useEffect, useState, useContext } from 'react';
import { ArrowLeft, Plus, Search } from 'lucide-react';
import Button from '../../components/Button.jsx';
import { CaravanaItem } from '../../components/caravana/CaravanaItem';
import api from '../../services/api';
import { AuthContext } from '../../context/AuthContext';

const CaravanaPage = () => {
  const { user } = useContext(AuthContext);
  const [caravanas, setCaravanas] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user?.id) {
        api.get(`/usuarios/${user.id}`)
           .then(response => {
               // O backend retorna as caravanas dentro do objeto do usuário
               setCaravanas(response.data.caravanas_membro || []);
           })
           .catch(err => console.error("Erro ao buscar caravanas", err))
           .finally(() => setLoading(false));
    }
  }, [user]);

  return (
    <div className="w-full min-h-screen bg-gray-50 flex flex-col items-center">
      
      <div className="w-full max-w-md md:max-w-4xl bg-white md:rounded-2xl md:shadow-xl md:my-8 flex flex-col min-h-screen md:min-h-fit">
        
        {/* Header Desktop */}
        <header className="hidden md:flex p-4 items-center border-b border-gray-200">
          <a href="#/perfil" className="text-gray-600 hover:text-blue-600 transition-colors p-2 rounded-full hover:bg-gray-100">
            <ArrowLeft className="w-6 h-6" />
          </a>
          <h1 className="text-xl font-bold text-gray-800 ml-4">Minhas Caravanas</h1>
        </header>

        {/* Header Mobile */}
        <header className="bg-blue-600 text-white p-4 flex justify-between items-center md:hidden">
          <a href="#/perfil"><ArrowLeft className="w-6 h-6" /></a>
          <h1 className="text-xl font-bold">Minhas Caravanas</h1>
          <div className="w-6"></div>
        </header>

        <main className="p-6 pb-24 md:p-8 flex flex-col h-full">
          
          <section className="mb-8 grow">
            <div className="flex justify-between items-end mb-4 border-b border-gray-200 pb-2">
              <h2 className="text-lg font-bold text-gray-800">Próximas Viagens</h2>
              <span className="text-sm text-gray-500">{caravanas.length} ativas</span>
            </div>
            
            {loading ? (
                <p className="text-center text-gray-500">Carregando...</p>
            ) : caravanas.length === 0 ? (
                <div className="text-center py-10 text-gray-400">
                    Você ainda não participa de nenhuma caravana.
                </div>
            ) : (
                <div className="flex flex-col gap-2">
                {caravanas.map(c => (
                    <CaravanaItem
                        key={c.id}
                        name={c.nome}
                        eventName={c.descricao || "Evento"} // Backend não tem nome do evento direto na caravana ainda, usando desc
                        date="Em breve" // Data não vem na caravana, ideal seria popular eventoDestino
                        membersCount={c.bonusPorParticipante} // Usando bonus como placeholder de membros se não tiver count
                        isOwner={false} // Backend não diz quem é dono ainda
                        onClick={() => window.location.hash = `#/caravana/${c.id}`}
                    />
                ))}
                </div>
            )}
          </section>

          <section className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-auto pt-4 border-t border-gray-100">
            <Button 
                variant="primary" 
                className="bg-blue-600! text-white! flex justify-center gap-2"
                href="#/caravana/criar" // Link para criar (se existir a rota)
            >
              <Plus className="w-5 h-5" />
              <span>Criar Nova Caravana</span>
            </Button>
            
            <Button 
                variant="primary" 
                className="bg-white! text-blue-600! border border-blue-600! flex justify-center gap-2"
            >
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