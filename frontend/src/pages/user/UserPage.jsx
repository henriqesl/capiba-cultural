import React, { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../../context/AuthContext'; 
import api from '../../services/api'; 

import { PerfilImage } from '../../components/user/UserShared';
import { NavCard } from '../../components/user/UserNavigation';

import { User, Star, Users, LogOut } from 'lucide-react';

const BASE_URL_BACKEND = 'http://localhost:3000'; // ⬅️ Adicionado para consistência
const DEFAULT_PROFILE_PIC = '../../assets/profile-placeholder.png';

const UserPage = () => {
    const { user: userContext, logout } = useAuth(); 
    
    const [userData, setUserData] = useState(null);
    const [loading, setLoading] = useState(true);
    
    const fetchUserData = useCallback(async () => {
        if (!userContext?.id) {
            setLoading(false);
            return;
        }
        try {
            const response = await api.get(`/usuarios/${userContext.id}`);
            const data = response.data;
            setUserData(data);
            
        } catch (error) {
            console.error("Erro ao carregar dados do usuário na UserPage:", error);
        } finally {
            setLoading(false);
        }
    }, [userContext]);

    useEffect(() => {
        fetchUserData();
    }, [fetchUserData]);
    
    // 🟢 LÓGICA CORRIGIDA: Usa o prefixo do backend para montar a URL completa
    const rawImageUrl = userData?.imagemUrl || userData?.fotoUrl;
    
    const imageUrl = rawImageUrl
        ? `${BASE_URL_BACKEND}/${rawImageUrl}?t=${Date.now()}` // ⬅️ Corrigido: Aplica prefixo e cache-busting
        : DEFAULT_PROFILE_PIC; 

    if (loading) {
        return <div className="w-full h-screen flex items-center justify-center bg-gray-100">Carregando...</div>;
    }
    
    const nomeUsuario = userData?.nome || 'Usuário';
    const pontos = userData?.saldoMoedaCapiba || 0;

    return (
        <div className="w-full bg-gray-100 flex flex-col items-center p-4 sm:p-8 pb-24 md:pb-8">
            <div className="w-full max-w-md md:max-w-4xl">
                
                <header className="relative bg-white md:rounded-2xl md:shadow-xl p-6 md:p-8 mb-8 shadow-sm rounded-xl">
                    
                    <button 
                        onClick={logout}
                        className="absolute top-4 right-4 p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-full transition-all"
                        title="Sair da conta"
                    >
                        <LogOut className="w-6 h-6" />
                    </button>

                    <div className="flex items-center place-content-center">
                        <PerfilImage src={imageUrl} />
                    </div>
                    <div className="flex items-center flex-col place-content-center mt-4 md:mt-3 text-center md:text-left">
                        <h1 className="text-3xl font-bold text-gray-800">{nomeUsuario}</h1>
                        
                        <p className="text-md text-blue-600 font-semibold mt-2">
                            {pontos.toLocaleString('pt-BR')} Capibas
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