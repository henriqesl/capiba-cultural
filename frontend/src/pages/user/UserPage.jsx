import React, { useContext, useEffect, useState } from 'react';
import { PerfilImage } from '../../components/user/UserShared';
import { NavCard } from '../../components/user/UserNavigation';
import { User, Star, Users, LogOut } from 'lucide-react';
import { AuthContext } from '../../context/AuthContext';
import api from '../../services/api';

const UserPage = () => {
  const { user, logout } = useContext(AuthContext);
  
  // estado para guardar os dados completos do perfil
  const [perfil, setPerfil] = useState({
    nome: 'Carregando...',
    email: user?.email || '...', // Usa o email do contexto enquanto carrega
    saldoMoedaCapiba: 0
  });

  useEffect(() => {
    const fetchDadosUsuario = async () => {
      if (user?.id) {
        try {
          // busca os dados completos na rota GET /usuarios/:id
          const response = await api.get(`/usuarios/${user.id}`);
          setPerfil(response.data);
        } catch (error) {
          console.error("Erro ao buscar dados do perfil:", error);
        }
      }
    };

    fetchDadosUsuario();
  }, [user]);

  return (
    <div className="w-full bg-gray-100 flex flex-col items-center p-4 sm:p-8 pb-24 md:pb-8">
      <div className="w-full max-w-md md:max-w-4xl">
        
        <header className="bg-white md:rounded-2xl md:shadow-xl p-6 md:p-8 mb-8 relative">
          
          {/* Botão de Logout (Sair) */}
          <button 
            onClick={logout} 
            className="absolute top-4 right-4 text-gray-400 hover:text-red-500 transition-colors"
            title="Sair da conta"
          >
             <LogOut className="w-6 h-6" />
          </button>

          <div className="flex items-center place-content-center">
            <PerfilImage src={perfil.fotoUrl}/>
          </div>
          
          <div className="flex items-center flex-col place-content-center mt-4 md:mt-3 text-center md:text-left">
            {/* DADOS REAIS AQUI */}
            <h1 className="text-3xl font-bold text-gray-800 capitalize">
              {perfil.nome || "Usuário"}
            </h1>
            <p className="text-lg text-gray-500">
              {perfil.email}
            </p>
            <p className="text-md text-blue-600 font-semibold mt-2">
              {perfil.saldoMoedaCapiba} Capibas
            </p>
          </div>
        </header>

        <main className="flex flex-col gap-6">
          <NavCard
            href="#/perfil/editar"
            icon={User} 
            title="Meu Perfil"
            description="Verifique e atualize seus dados"
          />

          <NavCard
            href="#/perfil/ranking"
            icon={Star}
            title="Ranking e Status"
            description="Veja sua pontuação e classificação"
          />

          <NavCard
            href="#/perfil/caravana"
            icon={Users}
            title="Minhas Caravanas"
            description="Embarque com seus amigos nessa jornada"
          />
        </main>
      </div>
    </div>
  );
};

export default UserPage;