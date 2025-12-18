import React, { useEffect, useState } from 'react';
import { ArrowLeft, MapPin, Info, Clock, Heart, Globe, Navigation, Star, Zap } from 'lucide-react';
import api from '../../services/api';
import ScannerScreen from '../../components/checkin/ScannerScreen';
const API_URL = "http://localhost:3000";

const PlaceDetailPage = ({ placeId, onBack }) => {
    const [placeData, setPlaceData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [showScanner, setShowScanner] = useState(false);

    useEffect(() => {
        const fetchDetails = async () => {
            try {
                const response = await api.get(`/eventos/${placeId}`);
                setPlaceData(response.data);
            } catch (error) {
                console.error("Erro ao carregar detalhes:", error);
            } finally {
                setLoading(false);
            }
        };
        if (placeId) fetchDetails();
    }, [placeId]);

    const handleDirections = () => {
        if (!placeData) return;
        const { latitude, longitude, nome, local } = placeData;
        const url = (latitude && longitude) 
            ? `https://www.google.com/maps/dir/?api=1&destination=${latitude},${longitude}`
            : `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(`${nome} ${local} Recife`)}`;
        window.open(url, '_blank');
    };

    const handleBackAction = () => {
        if (onBack) {
                onBack(); // Se estiver aberto como um modal/overlay
            } else {
                window.history.back(); // Se veio da Agenda, do Mapa ou do Check-in Oficial, ele volta exatamente para lá
            }
        };

        // E no botão de voltar da sua UI, troquei o <Link> ou a rota fixa por:
        <button onClick={handleBackAction} className="...">
            <ArrowLeft className="w-6 h-6" />
        </button>

    if (showScanner) return <ScannerScreen onBack={() => setShowScanner(false)} onScanResult={() => window.location.hash = '#/status'} />;
    if (loading) return <div className="h-screen flex items-center justify-center font-black text-purple-600 uppercase italic tracking-tighter">Carregando...</div>;
    if (!placeData) return <div className="p-10 text-center font-bold text-gray-400 font-sans">Local não encontrado.</div>;

    return (
        <div className="min-h-screen bg-gray-50 font-sans text-gray-900">
            {/* Header Roxo Limpo e Bonito (Apenas cor e título) */}
            <div className="relative h-[35vh] w-full bg-purple-700 flex items-center justify-center overflow-hidden">
                {/* Detalhe sutil de fundo para não ficar chapado */}
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,_var(--tw-gradient-stops))] from-purple-500 via-transparent to-transparent opacity-50" />
                
                <h2 className="text-white font-black text-3xl md:text-5xl p-8 z-20 text-center uppercase tracking-tighter leading-none drop-shadow-xl">
                    {placeData.nome}
                </h2>
                <button onClick={onBack} className="absolute top-6 left-6 z-30 p-3 bg-white/20 backdrop-blur-md rounded-2xl text-white border border-white/30 hover:bg-white/40 transition-all">
                    <ArrowLeft className="w-6 h-6" />
                </button>
            </div>

            <div className="max-w-5xl mx-auto px-6 -mt-10 relative z-20 pb-20">
                <div className="bg-white rounded-[40px] shadow-2xl p-6 md:p-12 border border-gray-100">
                    
                    {/* Badge de Recompensa */}
                    <div className="flex justify-end mb-6">
                        <div className="flex items-center gap-2 bg-green-100 px-4 py-2 rounded-2xl border border-green-200">
                            <Star className="w-4 h-4 text-green-600 fill-current" />
                            <span className="text-green-700 font-black text-xs">+{placeData.moedasCapibasDestribuidas ?? 100} CAPIBAS</span>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
                        <div className="md:col-span-2 space-y-8">
                            
                            {/* A IMAGEM AGORA FICA AQUI - Dentro do corpo, com bordas arredondadas */}
                            <div className="relative w-full h-64 md:h-80 rounded-[30px] overflow-hidden shadow-lg border-4 border-white">
                                <img 
                                    src={placeData.imagemUrl ? `${API_URL}/${placeData.imagemUrl}` : "https://images.unsplash.com/photo-1492684223066-81342ee5ff30"} 
                                    className="w-full h-full object-cover"
                                    alt={placeData.nome}
                                />
                                <div className="absolute bottom-4 left-4 bg-black/50 backdrop-blur-md text-white text-[10px] px-3 py-1 rounded-full font-bold uppercase tracking-widest">
                                    Galeria Oficial
                                </div>
                            </div>

                            {/* Descrição */}
                            <div>
                                <h3 className="text-gray-400 font-bold text-[10px] uppercase tracking-[0.2em] mb-3 flex items-center gap-2">
                                    <Info className="w-3 h-3 text-purple-500" /> Sobre o local
                                </h3>
                                <p className="text-gray-700 text-xl leading-relaxed font-semibold italic">
                                    "{placeData.descricao || "Um tesouro da cultura pernambucana esperando por sua visita."}"
                                </p>
                            </div>

                            {/* Horários e Site */}
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <div className="p-5 bg-gray-50 rounded-3xl border border-gray-100 flex items-center gap-4">
                                    <Clock className="w-5 h-5 text-purple-600" />
                                    <div>
                                        <p className="text-[9px] font-black text-gray-400 uppercase">Aberto até às</p>
                                        <p className="text-sm font-bold">{placeData.horario || "17:00"}</p>
                                    </div>
                                </div>
                                    <div className="p-5 bg-gray-50 rounded-3xl border border-gray-100 flex items-center gap-4 overflow-hidden">
                                        <Globe className="w-5 h-5 text-blue-600 shrink-0" />
                                        <div className="min-w-0 flex-1">
                                            <p className="text-[9px] font-black text-gray-400 uppercase tracking-wider">Site Oficial</p>
                                            {placeData.preco ? (
                                                <a 
                                                    href={placeData.preco.startsWith('http') ? placeData.preco : `https://${placeData.preco}`}
                                                    target="_blank" 
                                                    rel="noopener noreferrer"
                                                    className="text-sm font-bold text-blue-600 hover:underline block truncate"
                                                >
                                                    {placeData.preco.replace(/^https?:\/\//, '')}
                                                </a>
                                            ) : (
                                                <p className="text-sm font-bold text-gray-400">Não disponível</p>
                                            )}
                                        </div>
                                    </div>
                            </div>
                        </div>

                        {/* Card Lateral Preto (Intocado) */}
                        <div className="bg-gray-950 rounded-[35px] p-8 text-white h-fit shadow-xl flex flex-col gap-6 self-start">
                            <div className="flex items-start gap-3">
                                <MapPin className="w-5 h-5 text-purple-400 shrink-0" />
                                <div>
                                    <p className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">Localização</p>
                                    <p className="text-sm font-bold leading-tight">{placeData.local}</p>
                                </div>
                            </div>
                            
                            <p className="text-[11px] text-gray-400 leading-relaxed opacity-80 border-l-2 border-purple-500 pl-4 py-1">
                                {placeData.endereco || "Recife, Pernambuco - Brasil."}
                            </p>
                            
                            <div className="space-y-3 pt-4">
                                <button 
                                    onClick={handleDirections}
                                    className="w-full bg-purple-600 hover:bg-purple-500 py-4 rounded-2xl font-black text-xs flex items-center justify-center gap-3 transition-all active:scale-95 shadow-lg shadow-purple-900/20"
                                >
                                    <Navigation className="w-4 h-4 fill-current" /> TRAÇAR ROTA
                                </button>
                                <button className="w-full bg-white/5 py-4 rounded-2xl font-bold text-[10px] flex items-center justify-center gap-3 border border-white/10 hover:bg-white/10 transition-all uppercase tracking-widest">
                                    <Heart className="w-3 h-3" /> Salvar
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* Botão de Check-in (O Astro Verde) */}
                    <div className="mt-12 pt-8 border-t border-gray-100 text-center">
                        <button 
                            onClick={() => setShowScanner(true)}
                            className="w-full bg-green-600 hover:bg-green-700 text-white py-5 rounded-[2rem] font-black text-xl shadow-xl shadow-green-100 transition-all flex items-center justify-center gap-3 active:scale-[0.97]"
                        >
                            <Zap className="w-7 h-7 fill-current text-yellow-300" />
                            COLETAR MEUS CAPIBAS
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PlaceDetailPage;