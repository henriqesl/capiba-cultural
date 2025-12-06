import React from 'react';
// 1. Mantive apenas InfoRow e PerfilImage, removi o 'Icon' antigo
import { InfoRow, PerfilImage } from '../../components/user/UserShared.jsx'; 

// 2. Importando os ícones novos da Lucide
import { ArrowLeft, Camera, User } from 'lucide-react';

const ProfilePage = () => {
  return (
    <div className="w-full min-h-screen bg-gray-100 flex flex-col items-center py-4">
      
      <div className="w-[95%] max-w-md md:max-w-5xl bg-white md:rounded-2xl md:shadow-xl overflow-hidden flex flex-col">
        
        {/* Header Mobile */}
        <header className="bg-blue-600 text-white p-4 flex justify-between items-center md:hidden ">
          <a href="#/perfil" className="hover:opacity-80">
            {/* Ícone Voltar (Mobile) */}
            <ArrowLeft className="w-6 h-6" />
          </a>
          <h1 className="text-xl font-bold">Editar Perfil</h1>
          <div className="w-6"></div>
        </header>

        {/* Header Desktop */}
        <header className="hidden md:flex p-6 items-center border-b border-gray-200 bg-gray-50">
          <a href="#/perfil" className="text-gray-600 hover:text-blue-600 transition-colors p-2 rounded-full hover:bg-gray-100">
            {/* Ícone Voltar (Desktop) */}
            <ArrowLeft className="w-6 h-6" />
          </a>
          <h1 className="text-xl font-bold text-gray-800 ml-4">Editar Perfil</h1>
        </header>

        <main className="p-6 pb-24 md:p-8 md:grid md:grid-cols-12 md:gap-8">

          {/* Coluna Esquerda */}
          <aside className="md:col-span-4 flex flex-col items-center text-center mb-8 md:mb-0 border-b md:border-b-0 md:border-r border-gray-100 md:pr-6">
            <div className="relative group mb-4 cursor-pointer"> 
              <PerfilImage />
              
              <div className="absolute inset-0 bg-black bg-opacity-50 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <span className="text-white font-bold text-sm">Editar</span>
              </div>
              
              <button className="absolute -bottom-2 -right-2 transition hover:scale-110 bg-blue-600 p-3 rounded-full text-white hover:bg-blue-700 shadow-md border-2 border-white">
                {/* Ícone Camera */}
                <Camera className="w-5 h-5" />
              </button>
            </div>

            <h2 className="text-2xl font-bold text-gray-800 mt-2">Júnioro Cruz</h2>
            <p className="text-sm text-gray-500 font-medium">@junior.cin2007</p>
            
            <div className="w-full mt-6">
              <button className="w-full text-sm font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-lg py-2.5 px-4 transition-colors shadow-sm">
                Salvar Alterações
              </button>
            </div>
          </aside>

          {/* Coluna Direita */}
          <div className="md:col-span-8">
            <section>
              <h2 className="text-lg font-bold text-gray-700 mb-6 flex items-center">
                <span className="bg-blue-100 text-blue-600 p-2 rounded-lg mr-3">
                  {/* Ícone User */}
                  <User className="w-5 h-5"/> 
                </span>
                Informações Pessoais
              </h2>
              
              <div className="space-y-4">
                <InfoRow label="Email" value="sjcj@cin.ufpe.br" />
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <InfoRow label="Telefone" value="(81) 9999-9999" />
                    <InfoRow label="Senha" value="********" />
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <InfoRow label="Data de Nasc." value="10/05/2007" />
                  <InfoRow label="CPF" value="096.044.xxx-xx" />
                </div>
                
                <div className="pt-4 mt-4 border-t border-gray-100">
                    <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-4">Endereço</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <InfoRow label="CEP" value="52091-235" />
                        <InfoRow label="Bairro" value="Nova Descoberta" />
                        <InfoRow label="Rua" value="Rua Alto Santa Luzia" />
                        <InfoRow label="Número" value="460" />
                    </div>
                </div>
              </div>
            </section>
          </div>
        </main>
      </div>
    </div>
  );
};

export default ProfilePage;