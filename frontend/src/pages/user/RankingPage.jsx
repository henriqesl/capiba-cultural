import React from 'react';
import { ICONS } from '../../utils/icons.jsx';
import Button from '../../components/Button.jsx';
// Importa Icon do Shared e o resto do RankingComponents
import { Icon } from '../../components/user/UserShared';
import { GroupItem, TeamStories } from '../../components/user/RankingComponents';

const RankingPage = () => {
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

  return (
    <div className="w-full bg-gray-100 flex flex-col items-center">
      <div className="w-full max-w-md md:max-w-4xl bg-white md:rounded-2xl md:shadow-xl md:my-8 flex flex-col">
        
        {/* Header Mobile */}
        <header className="bg-blue-600 text-white p-4 flex justify-between items-center md:hidden">
          <a href="#/perfil" className="hover:opacity-80">
            <Icon path={ICONS.arrowLeft} />
          </a>
          <h1 className="text-xl font-bold">Meus Rankings</h1>
          <div className="w-6"></div>
        </header>

        {/* Header Desktop */}
        <header className="hidden md:flex p-4 items-center border-b border-gray-200">
          <a href="#/perfil" className="text-gray-600 hover:text-blue-600 transition-colors p-2 rounded-full hover:bg-gray-100">
            <Icon path={ICONS.arrowLeft} className="w-6 h-6" />
          </a>
          <h1 className="text-xl font-bold text-gray-800 ml-4">Meus Rankings</h1>
        </header>

        <main className="p-6 pb-24 md:p-8">
          <TeamStories teams={equipes} />

          <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">Meus Grupos</h2>
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

          <section className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Button variant="primary" className="bg-blue-600! text-white! hover:bg-blue-700! flex justify-center items-center">
              <Icon path={ICONS.plus} className="w-5 h-5" />
              <span className="ml-2">Criar Grupo</span>
            </Button>
            <Button variant="primary" className="bg-blue-600! text-white! hover:bg-blue-700! flex justify-center items-center">
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

/*
  [INTEGRAÇÃO]
  Rotas (GrupoRoutes.Js):
  - Listar Rankings: GET /grupos
  - Meus Grupos: GET /usuarios/:id (o back já traz a lista de grupos que eu participo).
  
  Tudo pronto no backend para essa tela funcionar.
*/