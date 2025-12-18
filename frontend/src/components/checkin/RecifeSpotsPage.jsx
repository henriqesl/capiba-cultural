import React, { useState, useEffect } from 'react';
import { ArrowLeft, MapPin, Landmark, ChevronRight, Star, Sparkles, Map } from 'lucide-react';
import api from '../../services/api';

const API_URL = "http://localhost:3000";

const SpotCard = ({ spot }) => {
    const handleNavigation = () => {
        window.location.hash = `#/locais/${spot.id}/spots`;
    };

    return (
        <div 
            onClick={handleNavigation}
            className="bg-white rounded-[2rem] shadow-sm border border-gray-100 p-4 flex items-center gap-5 transition-all hover:shadow-xl hover:shadow-purple-200/40 hover:scale-[1.02] cursor-pointer group mb-2"
        >
            <div className="relative flex-shrink-0 w-24 h-24 rounded-2xl overflow-hidden shadow-md bg-gray-50 border-2 border-white">
                <img 
                    src={spot.imagemUrl ? `${API_URL}${spot.imagemUrl.startsWith('/') ? '' : '/'}${spot.imagemUrl}` : "https://images.unsplash.com/photo-1518998053502-51908d17ce3b"} 
                    alt={spot.nome} 
                    className="w-full h-full object-cover transition-transform group-hover:scale-110 duration-700" 
                />
            </div>
            
            <div className="flex-1 min-w-0">
                <div className="flex items-center gap-1.5 mb-1">
                    <span className="text-[9px] font-black text-blue-600 bg-blue-50 px-2 py-0.5 rounded-full uppercase tracking-wider border border-blue-100 flex items-center gap-1">
                        <Landmark className="w-2.5 h-2.5" /> Oficial
                    </span>
                </div>
                <h3 className="text-lg font-extrabold text-gray-900 truncate leading-tight group-hover:text-purple-600 transition-colors">
                    {spot.nome}
                </h3>
                
                <div className="flex items-center gap-3 mt-2">
                    <div className="flex items-center gap-1 text-green-600 font-bold text-xs bg-green-50 px-2 py-1 rounded-lg border border-green-100">
                        <Star className="w-3.5 h-3.5 fill-green-500" />
                        <span>+{spot.moedasCapibasDestribuidas ?? 100} CAPIBAS</span>
                    </div>
                </div>
            </div>
            
            <div className="bg-gray-50 p-2 rounded-full text-gray-300 group-hover:bg-purple-600 group-hover:text-white transition-all">
                <ChevronRight className="w-5 h-5" />
            </div>
        </div>
    );
};

const RecifeSpotsPage = () => {
    const [spots, setSpots] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const loadSpots = async () => {
            try {
                const response = await api.get('/eventos'); 
                
                // FILTRO RESTRITIVO: Pega apenas o que NÃO é reporte de usuário
                const oficiais = response.data.filter(spot => 
                    spot.reportadoPorUsuario === false && 
                    !spot.usuario_id // Garante que não tem um ID de usuário vinculado
                );
                
                setSpots(oficiais);
            } catch (error) {
                console.error("Erro ao carregar locais:", error);
            } finally {
                setLoading(false);
            }
        };
        loadSpots();
    }, []);

    return (
        <div className="w-full bg-[#FDFDFF] min-h-screen">
            <div className="w-full bg-gradient-to-br from-purple-700 via-purple-800 to-indigo-900 pt-14 pb-24 px-6 flex flex-col items-center text-center relative overflow-hidden">
                <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
                    <div className="absolute top-[-10%] right-[-5%] w-72 h-72 bg-purple-400/20 rounded-full blur-[80px]"></div>
                    <div className="absolute bottom-[-10%] left-[-5%] w-72 h-72 bg-blue-400/20 rounded-full blur-[80px]"></div>
                </div>

                <div className="w-full max-w-4xl flex items-center justify-between mb-10 z-10">
                    <button 
                        onClick={() => window.location.hash = '#/eventos'} 
                        className="p-3 text-white bg-white/10 hover:bg-white/20 rounded-2xl backdrop-blur-md border border-white/20 transition-all shadow-lg"
                    >
                        <ArrowLeft className="w-5 h-5" />
                    </button>
                    <div className="flex items-center gap-2 bg-yellow-400 px-4 py-2 rounded-2xl shadow-lg border-2 border-white animate-bounce-subtle">
                        <Sparkles className="w-4 h-4 text-purple-900" />
                        <span className="text-purple-900 font-black text-xs uppercase italic tracking-tighter">Capiba Cultural</span>
                    </div>
                </div>

                <h1 className="text-4xl md:text-5xl font-black text-white mb-3 italic uppercase tracking-tighter z-10 drop-shadow-2xl">
                    Check-in <span className="text-yellow-400">Oficial</span>
                </h1>
                <p className="text-purple-100 text-sm max-w-xs opacity-90 z-10 leading-relaxed font-medium">
                    Patrimônios históricos certificados para você colecionar pontos.
                </p>
            </div>

            <main className="w-full max-w-2xl mx-auto px-6 -mt-12 pb-24 relative z-20">
                {loading ? (
                    <div className="bg-white rounded-[3rem] p-20 shadow-xl border border-gray-100 flex flex-col items-center">
                        <div className="w-12 h-12 border-4 border-purple-600 border-t-transparent rounded-full animate-spin mb-4"></div>
                        <p className="text-purple-600 font-black text-xs uppercase tracking-widest">Carregando...</p>
                    </div>
                ) : (
                    <div className="flex flex-col gap-3">
                        {spots.length > 0 ? (
                            spots.map(spot => <SpotCard key={spot.id} spot={spot} />)
                        ) : (
                            <div className="bg-white rounded-[3rem] p-16 text-center shadow-lg border border-gray-100">
                                <Landmark className="text-purple-100 w-16 h-16 mx-auto mb-4" />
                                <h3 className="text-gray-900 font-black text-xl mb-2 uppercase italic tracking-tighter">Nenhum Local Oficial</h3>
                                <p className="text-gray-400 text-sm">Estamos atualizando os pontos históricos.</p>
                            </div>
                        )}
                    </div>
                )}
            </main>

            <style>{`
                @keyframes bounce-subtle {
                    0%, 100% { transform: translateY(0); }
                    50% { transform: translateY(-5px); }
                }
                .animate-bounce-subtle {
                    animation: bounce-subtle 3s ease-in-out infinite;
                }
            `}</style>
        </div>
    );
};

export default RecifeSpotsPage;