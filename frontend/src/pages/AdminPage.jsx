import React, { useState, useEffect } from 'react';
import { Shield, Plus, AlertTriangle, CheckCircle, Target, Users, Calendar } from 'lucide-react';
import api from '../services/api';

const AdminPage = () => {
    const [activeTab, setActiveTab] = useState('dashboard'); // 'dashboard', 'missoes', 'reportes'
    const [reportes, setReportes] = useState([]);
    
    // Form de Missão
    const [novaMissao, setNovaMissao] = useState({
        titulo: '',
        descricao: '',
        recompensaCapibas: 50,
        tipoRequisito: 'COUNT_CHECKINS', // COUNT_CHECKINS, UNIQUE_LOCATIONS, SPECIFIC_TAG
        valorRequisito: 1,
        tagRequisito: ''
    });

    // Carregar dados ao mudar de aba
    useEffect(() => {
        if (activeTab === 'reportes') fetchReportes();
    }, [activeTab]);

    const fetchReportes = async () => {
        try {
            const res = await api.get('/reportes');
            setReportes(res.data);
        } catch (error) {
            console.error("Erro reportes:", error);
        }
    };

    const handleCriarMissao = async (e) => {
        e.preventDefault();
        try {
            await api.post('/missoes', novaMissao);
            alert("✅ Missão Criada com Sucesso!");
            setNovaMissao({ ...novaMissao, titulo: '', descricao: '' }); // Limpa form
        } catch (error) {
            alert("Erro ao criar missão: " + (error.response?.data?.erro || error.message));
        }
    };

    return (
        <div className="min-h-screen bg-gray-100 p-6 pb-24">
            
            {/* Header */}
            <header className="mb-8 flex items-center gap-3">
                <div className="bg-blue-600 p-3 rounded-2xl shadow-lg shadow-blue-200">
                    <Shield className="w-8 h-8 text-white" />
                </div>
                <div>
                    <h1 className="text-2xl font-bold text-gray-800">Painel Administrativo</h1>
                    <p className="text-gray-500 text-sm">Controle total do Capiba Cultural</p>
                </div>
            </header>

            {/* Menu de Abas */}
            <div className="flex gap-2 mb-8 overflow-x-auto pb-2">
                {[
                    { id: 'dashboard', label: 'Dashboard', icon: Users },
                    { id: 'missoes', label: 'Criar Missões', icon: Target },
                    { id: 'reportes', label: 'Moderação', icon: AlertTriangle },
                ].map(tab => (
                    <button
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id)}
                        className={`
                            flex items-center gap-2 px-6 py-3 rounded-xl font-bold transition-all whitespace-nowrap
                            ${activeTab === tab.id 
                                ? 'bg-blue-600 text-white shadow-md' 
                                : 'bg-white text-gray-500 hover:bg-gray-50'}
                        `}
                    >
                        <tab.icon className="w-4 h-4" />
                        {tab.label}
                    </button>
                ))}
            </div>

            {/* CONTEÚDO */}
            
            {/* 1. DASHBOARD (Visão Geral Simples) */}
            {activeTab === 'dashboard' && (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100">
                        <div className="flex justify-between items-start">
                            <div>
                                <p className="text-gray-400 text-sm font-bold uppercase">Usuários Ativos</p>
                                <h3 className="text-3xl font-black text-gray-800 mt-2">1,240</h3>
                            </div>
                            <div className="bg-green-100 p-2 rounded-lg"><Users className="text-green-600" /></div>
                        </div>
                    </div>
                    <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100">
                        <div className="flex justify-between items-start">
                            <div>
                                <p className="text-gray-400 text-sm font-bold uppercase">Eventos Hoje</p>
                                <h3 className="text-3xl font-black text-gray-800 mt-2">8</h3>
                            </div>
                            <div className="bg-blue-100 p-2 rounded-lg"><Calendar className="text-blue-600" /></div>
                        </div>
                    </div>
                    <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100">
                        <div className="flex justify-between items-start">
                            <div>
                                <p className="text-gray-400 text-sm font-bold uppercase">Reportes Pendentes</p>
                                <h3 className="text-3xl font-black text-red-500 mt-2">{reportes.length || 0}</h3>
                            </div>
                            <div className="bg-red-100 p-2 rounded-lg"><AlertTriangle className="text-red-500" /></div>
                        </div>
                    </div>
                </div>
            )}

            {/* 2. CRIAR MISSÕES */}
            {activeTab === 'missoes' && (
                <div className="max-w-2xl mx-auto bg-white p-8 rounded-3xl shadow-sm border border-gray-100">
                    <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
                        <Plus className="w-5 h-5 text-blue-600" /> Nova Missão Semanal
                    </h2>
                    
                    <form onSubmit={handleCriarMissao} className="space-y-4">
                        <div>
                            <label className="block text-sm font-bold text-gray-700 mb-1">Título da Missão</label>
                            <input 
                                className="w-full p-3 bg-gray-50 rounded-xl border border-gray-200 focus:border-blue-500 outline-none"
                                placeholder="Ex: Explorador de Museus"
                                value={novaMissao.titulo}
                                onChange={e => setNovaMissao({...novaMissao, titulo: e.target.value})}
                                required
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-bold text-gray-700 mb-1">Descrição</label>
                            <textarea 
                                className="w-full p-3 bg-gray-50 rounded-xl border border-gray-200 focus:border-blue-500 outline-none"
                                placeholder="Ex: Visite 3 museus diferentes esta semana..."
                                value={novaMissao.descricao}
                                onChange={e => setNovaMissao({...novaMissao, descricao: e.target.value})}
                                required
                            />
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-bold text-gray-700 mb-1">Tipo de Requisito</label>
                                <select 
                                    className="w-full p-3 bg-gray-50 rounded-xl border border-gray-200"
                                    value={novaMissao.tipoRequisito}
                                    onChange={e => setNovaMissao({...novaMissao, tipoRequisito: e.target.value})}
                                >
                                    <option value="COUNT_CHECKINS">Contagem de Check-ins</option>
                                    <option value="UNIQUE_LOCATIONS">Locais Diferentes</option>
                                    <option value="SPECIFIC_TAG">Categoria Específica</option>
                                </select>
                            </div>
                            <div>
                                <label className="block text-sm font-bold text-gray-700 mb-1">Meta (Qtd)</label>
                                <input 
                                    type="number"
                                    className="w-full p-3 bg-gray-50 rounded-xl border border-gray-200"
                                    value={novaMissao.valorRequisito}
                                    onChange={e => setNovaMissao({...novaMissao, valorRequisito: e.target.value})}
                                />
                            </div>
                        </div>

                        {novaMissao.tipoRequisito === 'SPECIFIC_TAG' && (
                             <div>
                                <label className="block text-sm font-bold text-gray-700 mb-1">Tag (Ex: TEATRO)</label>
                                <input 
                                    className="w-full p-3 bg-gray-50 rounded-xl border border-gray-200"
                                    value={novaMissao.tagRequisito}
                                    onChange={e => setNovaMissao({...novaMissao, tagRequisito: e.target.value})}
                                />
                            </div>
                        )}

                        <div>
                            <label className="block text-sm font-bold text-gray-700 mb-1">Recompensa (Capibas)</label>
                            <input 
                                type="number"
                                className="w-full p-3 bg-gray-50 rounded-xl border border-gray-200"
                                value={novaMissao.recompensaCapibas}
                                onChange={e => setNovaMissao({...novaMissao, recompensaCapibas: e.target.value})}
                            />
                        </div>

                        <button type="submit" className="w-full py-4 bg-black text-white font-bold rounded-xl hover:bg-gray-800 transition-colors">
                            Lançar Missão
                        </button>
                    </form>
                </div>
            )}

            {/* 3. MODERAÇÃO DE REPORTES */}
            {activeTab === 'reportes' && (
                <div className="space-y-4">
                    {reportes.length === 0 ? (
                        <div className="text-center py-12 text-gray-400">Nenhum reporte pendente. Tudo tranquilo!</div>
                    ) : (
                        reportes.map(rep => (
                            <div key={rep.id} className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100 flex items-start gap-4">
                                <div className="bg-red-100 p-3 rounded-full">
                                    <AlertTriangle className="text-red-600" />
                                </div>
                                <div className="flex-1">
                                    <div className="flex justify-between">
                                        <h3 className="font-bold text-gray-800">{rep.categoria}</h3>
                                        <span className="text-xs text-gray-400">{new Date(rep.dataReporte).toLocaleDateString()}</span>
                                    </div>
                                    <p className="text-gray-600 mt-1">{rep.descricao}</p>
                                    <div className="mt-3 text-sm text-gray-500 bg-gray-50 p-3 rounded-lg border border-gray-100">
                                        <p><b>Evento:</b> {rep.evento?.nome || 'Evento ID ' + rep.eventoId}</p>
                                        <p><b>Denunciante:</b> {rep.usuario?.nome || 'Usuário ID ' + rep.usuarioId}</p>
                                    </div>
                                    
                                    <div className="flex gap-3 mt-4">
                                        <button className="px-4 py-2 bg-red-50 text-red-600 font-bold rounded-lg text-sm hover:bg-red-100">
                                            Deletar Evento
                                        </button>
                                        <button className="px-4 py-2 bg-gray-100 text-gray-600 font-bold rounded-lg text-sm hover:bg-gray-200">
                                            Ignorar
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))
                    )}
                </div>
            )}
        </div>
    );
};

export default AdminPage;