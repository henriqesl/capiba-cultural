import React from 'react';
import { Icon } from '../../components/user/PersonalComponents.jsx';
import { PerfilImage } from '../../components/user/PersonalComponents.jsx';
import { ICONS } from '../../utils/icons.jsx';

// Componente de Cartão de Navegação
const NavCard = ({ href, iconPath, title, description }) => (
  <a 
    href={href}
    className="
      flex items-center p-6 bg-white rounded-2xl shadow-lg 
      transition-all duration-300 transform 
      hover:shadow-xl hover:-translate-y-1"
  >
    <div className="p-4 bg-blue-100 rounded-full">
      <Icon path={iconPath} className="w-8 h-8 text-blue-600" />
    </div>
    <div className="ml-5">
      <h3 className="text-xl font-bold text-gray-800">{title}</h3>
      <p className="text-gray-500">{description}</p>
    </div>
    <Icon path={ICONS.arrowLeft} className="w-6 h-6 text-gray-400 ml-auto transform rotate-180" />
  </a>
);

const UserPage = () => {
  return (
    <div className="w-full bg-gray-100 flex flex-col items-center p-4 sm:p-8 pb-24 md:pb-8">
      
      {/* Container Principal */}
      <div className="w-full max-w-md md:max-w-4xl">
        
        {/* Cabeçalho com Infos do Usuário */}
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

        {/* Opções de Navegação */}
        <main className="flex flex-col gap-6">
          <NavCard 
            href="#/perfil/editar"
            iconPath={ICONS.user}
            title="Meu Perfil"
            description="Verifique e atualize seus dados"
          />
          <NavCard 
            href="#/ranking"
            iconPath={ICONS.star} 
            title="Ranking e Status"
            description="Veja sua pontuação e classificação"
          />
          <NavCard 
            href="#/caravana"
            iconPath={ICONS} 
            title="Minhas Caravanas"
            description="Embarque com seus amigos nessa jornada"
          />
        </main>

      </div>
    </div>
  );
};

export default UserPage;