import React from 'react';
import Icon from '../components/Icon';
import BottomNav from '../components/BottomNav';
import TopNav from '../components/TopNav';
import { InfoRow, PaymentMethod } from '../components/ProfileComponents';
import { ICONS, BRAND_ICONS } from '../utils/icons.jsx';
import perfil_image from '../assets/foto_perfil.png';

const ProfilePage = () => {
  return (
    <div className="w-full min-h-screen bg-gray-100 flex flex-col items-center">
      <TopNav />
      
      <div className="w-full max-w-md md:max-w-6xl bg-white md:rounded-2xl md:shadow-xl md:my-8 flex flex-col">
        {/* Header Mobile */}
        <header className="bg-blue-600 text-white p-4 flex justify-between items-center md:hidden">
          <button className="hover:opacity-80">
            <Icon path={ICONS.arrowLeft} />
          </button>
          <h1 className="text-xl font-bold">Editar Perfil</h1>
          <div className="w-6"></div>
        </header>

        {/* Main Content */}
        <main className="p-6 pb-24 md:p-8 md:grid md:grid-cols-3 md:gap-12">
          {/* Coluna Esquerda: Foto e Ações */}
          <aside className="md:col-span-1 flex flex-col items-center justify-center text-center mb-8 md:mb-0">
            {/* Foto de Perfil */}
            <div className="relative group mb-4 cursor-pointer">
              <img
                src={perfil_image}
                alt="Foto do perfil de Júnior Cruz"
                className="w-48 h-48 rounded-full object-cover border-4 border-white shadow-lg transition-all duration-300"
              />
              <div className="absolute inset-0 bg-black bg-opacity-50 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <span className="text-white font-bold text-sm">Editar foto</span>
              </div>
              <button className="absolute -bottom-2 -right-2 transition hover:scale-110 bg-blue-600 p-3 rounded-full text-white hover:bg-blue-700 shadow-md">
                <Icon path={ICONS.camera} className="w-6 h-6" />
              </button>
            </div>

            {/* Informações do Usuário */}
            <h2 className="text-2xl font-bold text-gray-800 mt-4">Júnior Cruz</h2>
            <p className="text-md text-gray-500">@junior.cin2007</p>
            
            <button className="w-full text-sm font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-lg py-2 px-4 mt-6 transition-colors">
              Editar Perfil
            </button>
          </aside>

          {/* Coluna Direita: Informações */}
          <div className="md:col-span-2">
            {/* Seção: Informações Pessoais */}
            <section className="mb-8">
              <h2 className="text-xl font-bold text-blue-700 mb-4 border-b pb-2">
                Informações Pessoais
              </h2>
              
              <InfoRow label="Senha" value="********" />
              <InfoRow label="Telefone" value="(81) 9999-9999" />
              <InfoRow label="Email" value="sjcj@cin.ufpe.br" />
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <InfoRow label="Data de Nascimento" value="10/05/2007" />
                <InfoRow label="CPF" value="096.044.789-35" />
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <InfoRow label="CEP" value="52091-235" />
                <InfoRow label="Endereço" value="Rua Alto Santa Luzia" />
                <InfoRow label="No" value="460" />
                <InfoRow label="Bairro" value="Nova Descoberta" />
              </div>
            </section>
          </div>
        </main>
      </div>

      <BottomNav />
    </div>
  );
};

export default ProfilePage;