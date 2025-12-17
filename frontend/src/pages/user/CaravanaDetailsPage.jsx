import React, { useState, useEffect, useCallback } from 'react';
import {
    ArrowLeft,
    Calendar,
    MapPin,
    Copy,
    Check,
    Crown,
    UserCircle2,
    Edit2,
    Camera
} from 'lucide-react';

import api from '../../services/api';
import { useAuth } from '../../context/AuthContext';

// Assumindo que você tem um componente Card ou similar para as seções
// Criando um componente de estilo para simular o NavCard da UserPage
const DetailCard = ({ children, className = '' }) => (
    <div className={`bg-white rounded-xl shadow-sm p-6 ${className}`}>
        {children}
    </div>
);

// Assumindo que este caminho é acessível
import DefaultCaravanaImage from '../../assets/caravana_padrao.png';

const BASE_URL_BACKEND = 'http://localhost:3000';

const CaravanaDetailsPage = ({ onBack }) => {
    const { user } = useAuth();

    const [caravana, setCaravana] = useState(null);
    const [loading, setLoading] = useState(true);
    const [copied, setCopied] = useState(false);
    const [editing, setEditing] = useState(false);
    const [newFoto, setNewFoto] = useState(null);
    const [newDescription, setNewDescription] = useState('');

    // 🔎 ID da caravana pela URL
    const getCaravanaIdFromHash = () => {
        const parts = window.location.hash.split('/');
        return parts[parts.length - 1];
    };

    const caravanaId = getCaravanaIdFromHash();

    // 🔄 Busca caravana
    const fetchCaravana = useCallback(async () => {
        if (!caravanaId) return;

        try {
            const response = await api.get(`/caravanas/${caravanaId}`);
            setCaravana(response.data);
        } catch (error) {
            console.error('Erro ao buscar caravana:', error);
        } finally {
            setLoading(false);
        }
    }, [caravanaId]);

    useEffect(() => {
        fetchCaravana();
    }, [fetchCaravana]);

    // 🖼️ Upload da foto da caravana
    const handleSalvarFoto = async () => {
        if (!newFoto) return; // isOwner check é feito na UI

        try {
            const formData = new FormData();
            formData.append('foto', newFoto);

            await api.put(`/caravanas/${caravanaId}`, formData, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });

            setNewFoto(null);
            setEditing(false);
            await fetchCaravana();

            alert('Foto da caravana atualizada!');
        } catch (error) {
            console.error('Erro ao salvar foto da caravana:', error);
            alert('Erro ao atualizar a foto.');
        }
    };

    // 📝 Atualizar descrição
    const handleSaveDescription = async () => {
        try {
            const response = await api.patch(`/caravanas/${caravanaId}`, {
                descricao: newDescription
            });

            setCaravana(response.data);
            setEditing(false);
        } catch (error) {
            console.error('Erro ao atualizar descrição:', error);
        }
    };

    const handleCopyLink = () => {
        navigator.clipboard.writeText(
            `https://caravana.app/${caravana.nome
                .toLowerCase()
                .replace(/\s+/g, '-')}`
        );
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    if (loading) {
        return <div className="w-full h-screen flex items-center justify-center bg-gray-100">Carregando detalhes da caravana...</div>;
    }

    if (!caravana) {
        return <div className="p-8 text-center bg-gray-100 min-h-screen">Caravana não encontrada.</div>;
    }

    const isOwner = String(caravana.criadorId) === String(user.id);

    // 🖼️ FOTO DA CARAVANA
    const fotoCaravanaUrl = newFoto
        ? URL.createObjectURL(newFoto)
        : caravana.imagemUrl
            ? `${BASE_URL_BACKEND}/${caravana.imagemUrl}?t=${Date.now()}`
            : DefaultCaravanaImage;

    // ✅ USAR APENAS OS MEMBROS VINDOS DO BACKEND
    const membros = (caravana.membros || []).map(m => ({
        ...m,
        isOwner: String(m.id) === String(caravana.criadorId)
    }));

    // Função de formatação para simular o PerfilImage (simples)
    const CaravanaImage = ({ src }) => (
        <div className="w-32 h-32 rounded-full overflow-hidden border-4 border-white shadow-lg bg-gray-200">
            <img src={src} alt="Foto da Caravana" className="w-full h-full object-cover" />
        </div>
    );
    
    const fotoMembroUrl = (fotoUrl) => 
        fotoUrl ? `${BASE_URL_BACKEND}/${fotoUrl}` : '';

    return (
        <div className="w-full bg-gray-100 flex flex-col items-center p-4 sm:p-8 pb-24 md:pb-8 min-h-screen">
            <div className="w-full max-w-md md:max-w-4xl">

                {/* HEADER - Similar ao da UserPage */}
                <header className="relative bg-white md:rounded-2xl md:shadow-xl p-6 md:p-8 mb-8 shadow-sm rounded-xl">
                    <div className='flex items-center justify-between'>
                        <button onClick={onBack} className="p-2 text-gray-500 hover:text-gray-800 transition-all">
                            <ArrowLeft className="w-6 h-6" />
                        </button>

                        <h1 className="text-xl font-bold text-gray-800">Detalhes da Caravana</h1>
                        
                        {isOwner && (
                            <button
                                onClick={() => {
                                    setEditing(!editing);
                                    setNewDescription(caravana.descricao || '');
                                    setNewFoto(null); // Limpa a foto pendente ao sair da edição
                                }}
                                className="p-2 text-gray-400 hover:text-blue-500 hover:bg-blue-50 rounded-full transition-all"
                                title={editing ? "Sair da Edição" : "Editar Caravana"}
                            >
                                <Edit2 className="w-6 h-6" />
                            </button>
                        )}
                        {!isOwner && <div className='w-10'></div>} {/* Espaçador para alinhar */}
                    </div>


                    <div className="flex items-center flex-col place-content-center mt-6">
                        {/* Imagem da Caravana com opção de upload */}
                        <div className="relative">
                            <CaravanaImage src={fotoCaravanaUrl} />

                            {isOwner && editing && (
                                <label className="absolute inset-0 bg-black/50 flex flex-col items-center justify-center text-white cursor-pointer rounded-full w-32 h-32 m-auto">
                                    <Camera />
                                    <span className="text-xs">Mudar foto</span>
                                    <input
                                        type="file"
                                        accept="image/*"
                                        hidden
                                        onChange={(e) => setNewFoto(e.target.files[0])}
                                    />
                                </label>
                            )}
                        </div>
                        
                        {newFoto && (
                            <button
                                className="mt-4 px-4 py-2 bg-green-600 text-white font-semibold rounded-lg text-sm shadow-md hover:bg-green-700 transition"
                                onClick={handleSalvarFoto}
                            >
                                Salvar Foto
                            </button>
                        )}

                        <h2 className="text-3xl font-bold text-blue-700 mt-4 text-center">
                            {caravana.nome}
                        </h2>

                        <div className="flex items-center mt-2 text-gray-600">
                             <p className="text-md font-semibold">{membros.length} Membro(s)</p>
                        </div>
                    </div>
                </header>

                <main className="flex flex-col gap-6">

                    {/* DETALHES DO EVENTO - Similar a um NavCard */}
                    <DetailCard>
                        <h3 className="text-lg font-bold text-gray-800 mb-3 border-b pb-2">Detalhes do Evento</h3>
                        <div className="space-y-3">
                            <div className="flex items-center gap-3 text-base text-gray-700">
                                <Calendar className='w-5 h-5 text-blue-500'/>
                                <span className="font-medium">Data:</span>
                                <span>{caravana.evento?.data
                                    ? new Date(caravana.evento.data).toLocaleDateString()
                                    : 'Não definida'}</span>
                            </div>
                            <div className="flex items-center gap-3 text-base text-gray-700">
                                <MapPin className='w-5 h-5 text-blue-500' />
                                <span className="font-medium">Local:</span>
                                <span>{caravana.evento?.local || 'Local não definido'}</span>
                            </div>
                        </div>
                    </DetailCard>

                    {/* DESCRIÇÃO - Similar a um NavCard */}
                    <DetailCard>
                        <h3 className="text-lg font-bold text-gray-800 mb-3 border-b pb-2">Descrição da Caravana</h3>
                        {editing ? (
                            <>
                                <textarea
                                    className="w-full border rounded p-3 text-gray-700 focus:ring-blue-500 focus:border-blue-500"
                                    rows="4"
                                    value={newDescription}
                                    onChange={(e) => setNewDescription(e.target.value)}
                                    placeholder="Descreva sua caravana..."
                                />
                                <button
                                    className="mt-3 w-full bg-blue-600 text-white font-semibold py-2 rounded-lg hover:bg-blue-700 transition"
                                    onClick={handleSaveDescription}
                                >
                                    Salvar Descrição
                                </button>
                            </>
                        ) : (
                            <p className="text-gray-600 leading-relaxed">
                                {caravana.descricao || 'Nenhuma descrição fornecida.'}
                            </p>
                        )}
                    </DetailCard>

                    {/* LINK DE CONVITE - Integrado como um card */}
                    <DetailCard>
                        <h3 className="text-lg font-bold text-gray-800 mb-3 border-b pb-2">Link de Convite</h3>
                        <div className="flex gap-3 items-center bg-blue-50 p-3 rounded-lg border border-blue-200">
                            <div className="flex-1 bg-blue-100 p-2 rounded text-sm text-blue-700 font-mono truncate">
                                https://caravana.app/{caravana.nome.toLowerCase().replace(/\s+/g, '-')}
                            </div>
                            <button 
                                onClick={handleCopyLink}
                                className="p-1 text-blue-600 hover:bg-blue-200 rounded-full transition-all"
                                title="Copiar link"
                            >
                                {copied ? <Check className='w-5 h-5'/> : <Copy className='w-5 h-5' />}
                            </button>
                        </div>
                        {copied && <p className="text-sm text-green-600 mt-2 text-center">Link copiado!</p>}
                    </DetailCard>


                    {/* MEMBROS - Similar a um NavCard */}
                    <DetailCard>
                        <h3 className="text-lg font-bold text-gray-800 mb-3 border-b pb-2">Membros da Caravana</h3>

                        {membros.map((m) => (
                            <div key={m.id} className="flex items-center gap-4 py-2 border-b last:border-b-0">
                                <div className="w-12 h-12 rounded-full overflow-hidden bg-gray-200 flex items-center justify-center border border-gray-300">
                                    {m.fotoUrl ? (
                                        <img
                                            src={fotoMembroUrl(m.fotoUrl)}
                                            alt={m.nome}
                                            className="w-full h-full object-cover"
                                        />
                                    ) : (
                                        <UserCircle2 className="w-8 h-8 text-gray-500" />
                                    )}
                                </div>

                                <div className="flex items-center gap-2 flex-1">
                                    <span className="font-semibold text-base text-gray-700">{m.nome}</span>
                                    {m.isOwner && (
                                        <div className='flex items-center gap-1 text-yellow-600 bg-yellow-100 px-2 py-0.5 rounded-full text-xs font-bold'>
                                            <Crown className="w-3 h-3 fill-yellow-500" />
                                            Líder
                                        </div>
                                    )}
                                </div>
                            </div>
                        ))}
                    </DetailCard>
                </main>
            </div>
        </div>
    );
};

export default CaravanaDetailsPage;