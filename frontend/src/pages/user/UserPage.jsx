import React from 'react';
// Importa do Shared (Imagem) e Navigation (Card)
import { PerfilImage } from '../../components/user/UserShared';
import { NavCard } from '../../components/user/UserNavigation';
import { ICONS } from '../../utils/icons.jsx';

const UserPage = () => {
  return (
    <div className="w-full bg-gray-100 flex flex-col items-center p-4 sm:p-8 pb-24 md:pb-8">
      <div className="w-full max-w-md md:max-w-4xl">
        <header className=" bg-white md:rounded-2xl md:shadow-xl p-6 md:p-8 mb-8">
          <div className="flex items-center place-content-center">
            <PerfilImage /> 
          </div>
          <div className="flex items-center flex-col place-content-center mt-4 md:mt-3 text-center md:text-left">
            <h1 className="text-3xl font-bold text-gray-800">Júnior Cruz</h1>
            <p className="text-lg text-gray-500">@junior.cin2007</p>
            <p className="text-md text-blue-600 font-semibold mt-2">1,250 Pontos</p>
          </div>
        </header>

        <main className="flex flex-col gap-6">
          <NavCard 
            href="#/perfil/editar"
            iconPath={ICONS.user}
            title="Meu Perfil"
            description="Verifique e atualize seus dados"
          />
          <NavCard 
            href="#/perfil/ranking"
            iconPath={ICONS.star} 
            title="Ranking e Status"
            description="Veja sua pontuação e classificação"
          />
          <NavCard 
            href="#/perfil/caravana"
            iconPath={ICONS.dollar} 
            title="Minhas Caravanas"
            description="Embarque com seus amigos nessa jornada"
          />
        </main>
      </div>
    </div>
  );
};

export default UserPage;