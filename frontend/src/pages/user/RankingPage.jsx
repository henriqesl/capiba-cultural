import React, { useRef } from 'react';
import { Icon } from '../../components/user/PersonalComponents.jsx';
import { ICONS } from '../../utils/icons.jsx';
import Button from '../../components/Button.jsx'; 

// --- Sub-componente para o Item do Grupo ---
const GroupItem = ({ avatarSrc, name, points, rank }) => (
  <div className="flex items-center bg-gray-50 p-4 rounded-xl shadow-sm hover:bg-gray-100 transition-all duration-200">
    <img 
      src={avatarSrc} 
      alt={name} 
      className="w-14 h-14 rounded-full object-cover shrink-0" 
      onError={(e) => { e.target.src='https://placehold.co/64x64/e0e0e0/757575?text=IMG' }}
    />
    <div className="ml-4 grow">
      <p className="text-lg font-bold text-gray-800">{name}</p>
      <p className="text-sm text-gray-500">{points}</p>
    </div>
    <div className="ml-4 text-right shrink-0">
      <span className="text-2xl font-bold text-blue-600">{rank}º</span>
    </div>
  </div>
);

// --- Componente Principal da Página ---
const RankingPage = () => {
  const scrollContainerRef = useRef(null);

  const equipes = [
    { id: 1, alt: "Equipe 1", src: "https://placehold.co/64x64/e0e0e0/757575?text=IP" },
    { id: 2, alt: "Equipe 2", src: "https://placehold.co/64x64/e0e0e0/757575?text=GP" },
    { id: 3, alt: "Equipe 3", src: "https://placehold.co/64x64/e0e0e0/757575?text=TB" },
    { id: 4, alt: "Equipe 4", src: "https://placehold.co/64x64/e0e0e0/757575?text=C" },
    { id: 5, alt: "Equipe 5", src: "https://placehold.co/64x64/e0e0e0/757575?text=CS" },
    { id: 6, alt: "Equipe 6", src: "https://placehold.co/64x64/e0e0e0/757575?text=DS" },
  ];

  const grupos = [
    { id: 1, name: "Grupo de IP", points: "Meus pontos: 350 pontos", rank: 2, src: "https://placehold.co/64x64/e0e0e0/757575?text=IP" },
    { id: 2, name: "Grupo da Praia", points: "Meus pontos: 120 pontos", rank: 3, src: "https://placehold.co/64x64/e0e0e0/757575?text=GP" },
    { id: 3, name: "Trio bebedeira", points: "Meus pontos: 20 pontos", rank: 1, src: "https://placehold.co/64x64/e0e0e0/757575?text=TB" },
    { id: 4, name: "Casais", points: "Meus pontos: 60 pontos", rank: 4, src: "https://placehold.co/64x64/e0e0e0/757575?text=C" },
    { id: 5, name: "Cinsters", points: "Meus pontos: 30 pontos", rank: 6, src: "https://placehold.co/64x64/e0e0e0/757575?text=CS" },
    { id: 6, name: "Grupo de DS", points: "Meus pontos: 20 pontos", rank: 4, src: "https://placehold.co/64x64/e0e0e0/757575?text=DS" },
  ];

  // Função para controlar o scroll das equipes
  const handleEquipeScroll = (direction) => {
    if (!scrollContainerRef.current) return;
    const scrollAmount = 150; 
    if (direction === 'prev') {
      scrollContainerRef.current.scrollBy({ left: -scrollAmount, behavior: 'smooth' });
    } else {
      scrollContainerRef.current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
    }
  };

  return (
    <div className="w-full bg-gray-100 flex flex-col items-center">
      
      {/* "Card" */}
      <div className="w-full max-w-md md:max-w-4xl bg-white md:rounded-2xl md:shadow-xl md:my-8 flex flex-col">
        
        {/* === HEADER MOBILE === */}
        <header className="bg-blue-600 text-white p-4 flex justify-between items-center md:hidden">
          <a href="#/perfil" className="hover:opacity-80">
            <Icon path={ICONS.arrowLeft} />
          </a>
          <h1 className="text-xl font-bold">Meus Rankings</h1>
          <div className="w-6"></div>
        </header>

        {/* === HEADER DESKTOP === */}
        <header className="hidden md:flex p-4 items-center border-b border-gray-200">
          <a href="#/perfil" className="text-gray-600 hover:text-blue-600 transition-colors p-2 rounded-full hover:bg-gray-100">
            <Icon path={ICONS.arrowLeft} className="w-6 h-6" />
          </a>
          <h1 className="text-xl font-bold text-gray-800 ml-4">Meus Rankings</h1>
        </header>

        <main className="p-6 pb-24 md:p-8">
          
          {/* === Minhas Equipes === */}
          <section className="mb-8">
            
            {/* Scroll mobile (similar aos stories do instagram) */}
            <div className="relative w-full">
              
              {/* Botão Esquerda (só mobile) */}
              <button 
                onClick={() => handleEquipeScroll('prev')}
                className="absolute -left-2 top-1/2 -translate-y-1/2 z-10 bg-white/80 backdrop-blur-sm rounded-full p-1 shadow-md hover:bg-white transition-all md:hidden"
                aria-label="Equipe anterior"
              >
                <Icon path={ICONS.arrowLeft} className="w-6 h-6 text-gray-700" />
              </button>
              
              {/* O Container de Scroll */}
              <div 
                ref={scrollContainerRef}
                className="flex justify-center gap-6 overflow-x-auto pb-2 scroll-smooth md:justify-center"
              >
                {equipes.map(equipe => (
                  <img
                    key={equipe.id}
                    src={equipe.src}
                    alt={equipe.alt}
                    className="w-16 h-16 rounded-full object-cover shrink-0 border-2 border-white shadow-md"
                  />
                ))}
              </div>

              {/* Botão Direita (só mobile) */}
              <button 
                onClick={() => handleEquipeScroll('next')}
                className="absolute -right-2 top-1/2 -translate-y-1/2 z-10 bg-white/80 backdrop-blur-sm rounded-full p-1 shadow-md hover:bg-white transition-all md:hidden"
                aria-label="Próxima equipe"
              >
                <Icon path={ICONS.arrowLeft} className="w-6 h-6 text-gray-700 transform rotate-180" />
              </button>
            </div>
          </section>

          {/* Meus Grupos */}
          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">
              Meus Grupos
            </h2>
            <div className="flex flex-col gap-4">
              {grupos.map(grupo => (
                <GroupItem
                  key={grupo.id}
                  avatarSrc={grupo.src}
                  name={grupo.name}
                  points={grupo.points}
                  rank={grupo.rank}
                />
              ))}
            </div>
          </section>

          { /* Seção Entrar e Criar Grupo */}
          <section className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Button 
              variant="primary" 
              className="bg-blue-600! text-white! hover:bg-blue-700! flex justify-center items-center"
            >
              <Icon path={ICONS.plus} className="w-5 h-5" />
              <span className="ml-2">Criar Grupo</span>
            </Button>
            <Button 
              variant="primary" 
              className="bg-blue-600! text-white! hover:bg-blue-700! flex justify-center items-center"
            >
              <Icon path={ICONS.arrowLeft} className="w-5 h-5 transform -rotate-180" />
              <span className="ml-2">Entrar no Grupo</span>
            </Button>
          </section>

        </main>
      </div>
    </div>
  );
};

export default RankingPage;