import React, { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../../context/AuthContext';
import api from '../../services/api';
import CreateCaravanaPage from './CreateCaravanaPage';
import JoinCaravanaPage from './JoinCaravanaPage';
import { CaravanaItem } from '../../components/caravana/CaravanaItem';
import { Plus, Users, Loader2 } from 'lucide-react';

const CaravanaPage = () => {
    const { user } = useAuth();
    const [view, setView] = useState('landing'); 
    const [caravanas, setCaravanas] = useState([]);
    const [loading, setLoading] = useState(true);

    // Busca a lista atualizada
    const fetchCaravanas = useCallback(async () => {
        if (!user?.id) return;
        try {
            setLoading(true);
            const response = await api.get(`/caravanas/usuario/${user.id}`);
            setCaravanas(response.data);
        } catch (error) {
            console.error("Erro ao buscar caravanas:", error);
        } finally {
            setLoading(false);
        }
    }, [user]);

    useEffect(() => {
        fetchCaravanas();
    }, [fetchCaravanas]);

    const handleSuccess = (caravana) => {
        alert(`Sucesso! Você está na caravana: ${caravana.nome}`);
        setView('landing');
        fetchCaravanas(); 
    };

    if (view === 'create') {
        return <CreateCaravanaPage onBack={() => setView('landing')} onCreate={handleSuccess} />;
    }

    if (view === 'join') {
        return <JoinCaravanaPage onBack={() => setView('landing')} onJoin={handleSuccess} />;
    }

    return (
        <div className="w-full min-h-screen bg-gray-50 flex flex-col items-center p-4 pb-24">
            <div className="w-full max-w-2xl space-y-6">
                
                <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                    <h2 className="text-2xl font-extrabold text-gray-900 mb-2">Minhas Caravanas</h2>
                    <p className="text-gray-500 mb-6 text-sm">Gerencie suas viagens e grupos.</p>
                    
                    <div className="grid grid-cols-2 gap-3">
                        <button onClick={() => setView('create')} className="flex flex-col items-center justify-center p-4 bg-blue-50 text-blue-700 rounded-xl hover:bg-blue-100 border border-blue-100 transition-colors">
                            <Plus className="w-6 h-6 mb-1" />
                            <span className="font-bold text-sm">Criar Nova</span>
                        </button>
                        <button onClick={() => setView('join')} className="flex flex-col items-center justify-center p-4 bg-gray-50 text-gray-700 rounded-xl hover:bg-gray-100 border border-gray-200 transition-colors">
                            <Users className="w-6 h-6 mb-1" />
                            <span className="font-bold text-sm">Entrar com Código</span>
                        </button>
                    </div>
                </div>

                <div>
                    <h3 className="text-lg font-bold text-gray-800 mb-3 px-1">Seus Grupos</h3>
                    {loading ? (
                        <div className="flex justify-center py-8"><Loader2 className="w-8 h-8 animate-spin text-blue-600" /></div>
                    ) : caravanas.length === 0 ? (
                        <div className="text-center py-10 bg-white rounded-xl shadow-sm border border-dashed border-gray-300">
                            <p className="text-gray-400">Nenhuma caravana encontrada.</p>
                        </div>
                    ) : (
                        <div className="space-y-3">
                            {caravanas.map((caravana) => (
                                <CaravanaItem
                                    key={caravana.id}
                                    name={caravana.nome}
                                    eventName={caravana.evento?.nome || "Evento não definido"}
                                    date={caravana.evento?.data ? new Date(caravana.evento.data).toLocaleDateString() : "--/--"}
                                    membersCount={caravana.membros?.length || 0}
                                    isOwner={caravana.criadorId === user.id}
                                    onClick={() => window.location.hash = `#/perfil/caravana/detalhes/${caravana.id}`}
                                />
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default CaravanaPage;
