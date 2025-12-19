import React, { useState, useEffect, useCallback, useContext } from 'react';
import {
    ArrowLeft,
    Calendar,
    MapPin,
    Copy,
    Check,
    Crown,
    Edit2,
    Camera,
    Info,
    Clock,
    Users
} from 'lucide-react';

import api from '../../services/api';
import { AuthContext } from '../../context/AuthContext';

import placeholderImg from '../../assets/profile-placeholder.png';
import DefaultCaravanaImage from '../../assets/caravana_padrao.png';

const BASE_URL_BACKEND = 'http://localhost:3000';

const DetailCard = ({ children, className = "" }) => (
    <div className={`bg-white rounded-xl shadow-sm p-6 ${className}`}>
        {children}
    </div>
);

const CaravanaDetailsPage = ({ onBack }) => {
    const { user } = useContext(AuthContext);

    const [caravana, setCaravana] = useState(null);
    const [loading, setLoading] = useState(true);
    const [copied, setCopied] = useState(false);
    const [editing, setEditing] = useState(false);
    const [newFoto, setNewFoto] = useState(null);
    const [newDescription, setNewDescription] = useState("");

    const getCaravanaIdFromHash = () => {
        const parts = window.location.hash.split('/');
        return parts[parts.length - 1];
    };

    const caravanaId = getCaravanaIdFromHash();

    const fetchCaravana = useCallback(async () => {
        if (!caravanaId) return;
        try {
            const response = await api.get(`/caravanas/${caravanaId}`);
            setCaravana(response.data);
            setNewDescription(response.data.descricao || "");
        } catch (error) {
            console.error("Erro ao buscar caravana:", error);
        } finally {
            setLoading(false);
        }
    }, [caravanaId]);

    useEffect(() => {
        fetchCaravana();
    }, [fetchCaravana]);

    const handleBack = () => {
        if (onBack) {
            onBack(); 
        } else {
            window.location.hash = '#/perfil/caravana';
        }
    };

    const handleCopyCode = () => {
        if (caravana?.codigoAcesso) {
            navigator.clipboard.writeText(caravana.codigoAcesso);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        }
    };

    const handleUpdateCaravana = async () => {
        try {
            const formData = new FormData();
            if (newDescription !== caravana.descricao) {
                formData.append("descricao", newDescription);
            }
            if (newFoto) {
                formData.append("foto", newFoto);
            }

            await api.put(`/caravanas/${caravanaId}`, formData, {
                headers: { "Content-Type": "multipart/form-data" },
            });

            setEditing(false);
            fetchCaravana();
        } catch (error) {
            console.error("Erro ao atualizar caravana:", error);
            alert("Erro ao atualizar caravana.");
        }
    };

    const getImageUrl = (url) => {
        if (!url) return DefaultCaravanaImage;
        return url.startsWith('http') ? url : `${BASE_URL_BACKEND}${url.startsWith('/') ? '' : '/'}${url}`;
    };

    const getMemberAvatarUrl = (url) => {
        if (!url) return placeholderImg;
        return url.startsWith('http') ? url : `${BASE_URL_BACKEND}${url.startsWith('/') ? '' : '/'}${url}`;
    };

    if (loading) return <div className="min-h-screen flex items-center justify-center bg-gray-50"><div className="animate-spin w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full"></div></div>;
    if (!caravana) return <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 p-6"><p className="text-gray-500 mb-4">Caravana não encontrada.</p><button onClick={handleBack} className="text-blue-600 font-bold hover:underline">Voltar</button></div>;

    const isOwner = user?.id === caravana.criadorId;
    const evento = caravana.evento || {};
    
    const membrosNormalizados = (caravana.membros || []).map(m => {
        const dadosUsuario = m.usuario || m; 
        return {
            id: m.id || dadosUsuario.id,
            nome: dadosUsuario.nome || "Membro",
            fotoUrl: dadosUsuario.foto || dadosUsuario.fotoUrl,
            isOwner: (m.usuarioId === caravana.criadorId) || (dadosUsuario.id === caravana.criadorId)
        };
    });

    return (
        <div className="min-h-screen bg-gray-50 pb-20 font-sans">
            <header className="bg-white shadow-sm sticky top-0 z-10 px-4 py-3 flex items-center gap-4">
                <button onClick={handleBack} className="p-2 rounded-full hover:bg-gray-100 transition-colors text-gray-600">
                    <ArrowLeft size={24} />
                </button>
                <h1 className="text-xl font-bold text-gray-800 truncate flex-1">{caravana.nome}</h1>
                {isOwner && (
                    <button onClick={() => setEditing(!editing)} className={`p-2 rounded-full transition-colors ${editing ? 'bg-blue-100 text-blue-600' : 'hover:bg-gray-100 text-gray-500'}`}>
                        <Edit2 size={20} />
                    </button>
                )}
            </header>

            <div className="max-w-3xl mx-auto p-4 space-y-6">
                
                <div className="relative w-full h-48 sm:h-64 rounded-2xl overflow-hidden shadow-md bg-gray-200">
                    <img
                        src={newFoto ? URL.createObjectURL(newFoto) : getImageUrl(caravana.foto)}
                        alt={caravana.nome}
                        className="w-full h-full object-cover"
                        onError={(e) => e.target.src = DefaultCaravanaImage}
                    />
                    {editing && (
                        <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                            <label className="cursor-pointer bg-white/20 backdrop-blur-md p-4 rounded-full hover:bg-white/30 transition-all text-white border-2 border-white/50">
                                <Camera size={32} />
                                <input type="file" className="hidden" accept="image/*" onChange={(e) => setNewFoto(e.target.files[0])} />
                            </label>
                        </div>
                    )}
                </div>

                <DetailCard>
                    <div className="flex flex-col gap-4">
                        <div className="flex items-center gap-2 mb-1">
                            <h2 className="text-lg font-bold text-gray-800">Sobre a Caravana</h2>
                        </div>
                        
                        {editing ? (
                            <textarea value={newDescription} onChange={(e) => setNewDescription(e.target.value)} className="w-full p-3 border border-gray-200 rounded-lg bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500" rows="3" placeholder="Descrição da caravana..." />
                        ) : (
                            <p className="text-gray-600 leading-relaxed text-sm">
                                {caravana.descricao || "O grupo ainda não adicionou uma descrição."}
                            </p>
                        )}

                        {caravana.codigoAcesso && (
                            <div onClick={handleCopyCode} className="mt-2 flex items-center justify-between bg-blue-50 border border-blue-100 p-3 rounded-xl cursor-pointer hover:bg-blue-100 transition-colors group">
                                <div className="flex flex-col">
                                    <span className="text-[10px] text-blue-400 font-bold uppercase tracking-wider">Código de Convite</span>
                                    <span className="text-xl font-mono font-bold text-blue-700 tracking-widest">{caravana.codigoAcesso}</span>
                                </div>
                                <div className="bg-white p-2 rounded-full shadow-sm text-blue-500 group-hover:scale-110 transition-transform">
                                    {copied ? <Check size={18} /> : <Copy size={18} />}
                                </div>
                            </div>
                        )}

                        {editing && (
                            <button onClick={handleUpdateCaravana} className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl shadow-md transition-all mt-2">Salvar Alterações</button>
                        )}
                    </div>
                </DetailCard>

                <DetailCard>
                    <div className="flex items-center gap-2 mb-4 border-b border-gray-100 pb-3">
                        <Info className="text-purple-600" size={20} />
                        <h3 className="text-lg font-bold text-gray-800">Evento Destino</h3>
                    </div>

                    <div className="flex gap-4">
                        <div className="w-24 h-24 sm:w-32 sm:h-32 bg-gray-100 rounded-lg overflow-hidden shrink-0">
                            <img 
                                src={getImageUrl(evento.imagemUrl)} 
                                alt={evento.nome} 
                                className="w-full h-full object-cover"
                                onError={(e) => e.target.src = DefaultCaravanaImage}
                            />
                        </div>

                        <div className="flex-1 space-y-2">
                            <h4 className="font-bold text-gray-900 text-base sm:text-lg leading-tight">{evento.nome || "Evento Desconhecido"}</h4>
                            
                            <div className="space-y-1.5 mt-2">
                                <div className="flex items-center gap-2 text-sm text-gray-600">
                                    <Calendar className="w-4 h-4 text-blue-500 shrink-0" />
                                    <span>{evento.data ? new Date(evento.data).toLocaleDateString('pt-BR', {weekday: 'long', day:'numeric', month:'long'}) : "Data a definir"}</span>
                                </div>
                                {evento.horario && (
                                    <div className="flex items-center gap-2 text-sm text-gray-600">
                                        <Clock className="w-4 h-4 text-orange-500 shrink-0" />
                                        <span>{evento.horario}</span>
                                    </div>
                                )}
                                <div className="flex items-center gap-2 text-sm text-gray-600">
                                    <MapPin className="w-4 h-4 text-red-500 shrink-0" />
                                    <span className="line-clamp-1">{evento.local || "Local a definir"}</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {evento.descricao && (
                        <div className="mt-4 pt-3 border-t border-gray-50">
                            <p className="text-sm text-gray-500 italic line-clamp-3">"{evento.descricao}"</p>
                        </div>
                    )}
                </DetailCard>

                <DetailCard>
                    <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
                        Membros <span className="bg-gray-100 text-gray-600 text-xs px-2 py-1 rounded-full">{membrosNormalizados.length}</span>
                    </h3>

                    <div className="space-y-1">
                        {membrosNormalizados.map((m) => (
                            <div key={m.id} className="flex items-center gap-4 py-3 px-2 hover:bg-gray-50 rounded-lg transition-colors">
                                <div className="w-12 h-12 rounded-full overflow-hidden border-2 border-white shadow-sm shrink-0 bg-gray-100">
                                    <img
                                        src={getMemberAvatarUrl(m.fotoUrl)}
                                        alt={m.nome}
                                        className="w-full h-full object-cover"
                                        onError={(e) => e.target.src = placeholderImg}
                                    />
                                </div>

                                <div className="flex items-center justify-between flex-1">
                                    <span className="font-semibold text-gray-700 truncate max-w-[150px] sm:max-w-xs">{m.nome}</span>
                                    {m.isOwner && (
                                        <div className="flex items-center gap-1 text-yellow-700 bg-yellow-50 border border-yellow-100 px-2 py-1 rounded-full text-[10px] font-bold uppercase tracking-wide">
                                            <Crown size={12} className="fill-yellow-500 text-yellow-500" /> Líder
                                        </div>
                                    )}
                                </div>
                            </div>
                        ))}
                        {membrosNormalizados.length === 0 && <p className="text-center text-gray-400 py-4 italic">Nenhum membro ainda.</p>}
                    </div>
                </DetailCard>
            </div>
        </div>
    );
};

export default CaravanaDetailsPage;