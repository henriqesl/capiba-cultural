import React, { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../../context/AuthContext'; 
import api from '../../services/api'; 

import { PerfilImage } from '../../components/user/UserShared';
import { NavCard } from '../../components/user/UserNavigation';

// 1. Importando os ícones
import { User, Star, Users } from 'lucide-react';

// 🔑 DEFINIÇÕES GLOBAIS (Ajuste conforme o seu setup)
const BASE_URL = 'http://localhost:3000'; // A URL do seu backend
const DEFAULT_PROFILE_PIC = '/images/profile-placeholder.png'; // Caminho para a pasta 'public'

const UserPage = () => {
    const { user: userContext } = useAuth(); 
    
    // 🔑 ESTADOS
    const [userData, setUserData] = useState(null);
    const [loading, setLoading] = useState(true);
    
    // 🔑 FUNÇÃO DE BUSCA DE DADOS (Reutilizada do ProfilePage)
    const fetchUserData = useCallback(async () => {
        if (!userContext?.id) {
            setLoading(false);
            return;
        }
        try {
            // Buscando os dados do usuário usando a rota que já existe
            const response = await api.get(`/usuarios/${userContext.id}`);
            const data = response.data;
            setUserData(data);
            
            // 🚨 LOG para verificar o campo retornado (você viu 'imagemUrl' no último log)
            // console.log("Dados do usuário para UserPage:", data); 
            
        } catch (error) {
            console.error("Erro ao carregar dados do usuário na UserPage:", error);
        } finally {
            setLoading(false);
        }
    }, [userContext]);

    useEffect(() => {
        fetchUserData();
    }, [fetchUserData]);
    
    
    // 🔑 LÓGICA DA FOTO DE PERFIL (usando o campo 'imagemUrl' que o backend envia)
    // Se o backend enviar 'uploads/perfil/...', precisamos concatenar
    const imagemRelativa = userData?.imagemUrl; 
    
    const imageUrl = imagemRelativa
        ? `${BASE_URL}/${imagemRelativa}` // Concatena BASE_URL com o caminho DB
        : DEFAULT_PROFILE_PIC;          // Usa a foto padrão (fallback)

    if (loading) {
        return <div className="w-full h-screen flex items-center justify-center bg-gray-100">Carregando...</div>;
    }
    
    const nomeUsuario = userData?.nome || 'Usuário';
    const username = userData?.username || 'username';
    const pontos = userData?.saldoMoedaCapiba || 0;


    return (
        <div className="w-full bg-gray-100 flex flex-col items-center p-4 sm:p-8 pb-24 md:pb-8">
            <div className="w-full max-w-md md:max-w-4xl">
                
                <header className="bg-white md:rounded-2xl md:shadow-xl p-6 md:p-8 mb-8">
                    <div className="flex items-center place-content-center">
                        {/* 🔑 PASSA A URL CONSTRUÍDA PARA O COMPONENTE PerfilImage */}
                        <PerfilImage imageUrl={imageUrl} />
                    </div>
                    <div className="flex items-center flex-col place-content-center mt-4 md:mt-3 text-center md:text-left">
                        {/* 🔑 DADOS DINÂMICOS */}
                        <h1 className="text-3xl font-bold text-gray-800">{nomeUsuario}</h1>
                        <p className="text-lg text-gray-500">@{username}</p>
                        <p className="text-md text-blue-600 font-semibold mt-2">{pontos.toLocaleString('pt-BR')} Pontos</p>
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