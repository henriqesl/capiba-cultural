import React, { useState, useEffect } from 'react';
import { 
    Shield, Target, LayoutDashboard, CheckCircle, Calendar, 
    Trash2, MapPin, Plus, FileText, Clock 
} from 'lucide-react';
import api from '../services/api';

const getFullImageUrl = (relativePath) => {
    if (!relativePath) return null; 
    const path = relativePath.startsWith('/') ? relativePath : `/${relativePath}`;
    return `http://localhost:3000${path}`; 
};

const AdminPage = () => {
    const [activeTab, setActiveTab] = useState('dashboard');
    
    const [pendentes, setPendentes] = useState([]); 
    const [eventosAtivos, setEventosAtivos] = useState([]);
    const [filtroAprovacao, setFiltroAprovacao] = useState('todos');

    // Forms
    const [novoEvento, setNovoEvento] = useState({
        nome: '', local: '', data: '', descricao: '', horario: ''
    });

    const [novaMissao, setNovaMissao] = useState({
        titulo: '', descricao: '', recompensaCapibas: 50, 
        tipoRequisito: 'COUNT_CHECKINS', valorRequisito: 1, tagRequisito: ''
    });

    useEffect(() => {
        carregarDados();
    }, [activeTab]);

    const carregarDados = () => {
        if (activeTab === 'dashboard' || activeTab === 'aprovacoes') fetchPendentes();
        if (activeTab === 'dashboard' || activeTab === 'gestao_eventos') fetchEventosAtivos();
    };

    const fetchPendentes = async () => {
        try { const res = await api.get('/eventos?pendentes=true'); setPendentes(res.data); } catch (e) { console.error(e); }
    };

    const fetchEventosAtivos = async () => {
        try { 
            const hoje = new Date();
            const res = await api.get(`/eventos?mes=${hoje.getMonth() + 1}&ano=${hoje.getFullYear()}`); 
            setEventosAtivos(res.data); 
        } catch (e) { console.error(e); }
    };

    const handleAprovar = async (id) => {
        try {
            await api.put(`/eventos/${id}/aprovar`);
            alert("✅ Evento Aprovado!");
            fetchPendentes();
        } catch (error) { alert("Erro ao aprovar."); }
    };

    const handleRejeitar = async (id) => {
        if(!confirm("Tem certeza que deseja apagar este evento?")) return;
        try {
            await api.delete(`/eventos/${id}`);
            fetchPendentes();
            fetchEventosAtivos();
        } catch (error) { alert("Erro ao excluir."); }
    };

    const handleCriarEventoOficial = async (e) => {
        e.preventDefault();
        try {
            await api.post('/eventos', {
                ...novoEvento,
                data: new Date(novoEvento.data).toISOString(),
                ativo: 'true',  
                reportadoPorUsuario: 'false',
                pequenoPorte: 'false' 
            });
            alert("📅 Evento Oficial Adicionado!");
            setNovoEvento({ nome: '', local: '', data: '', descricao: '', horario: '' });
            fetchEventosAtivos();
        } catch (error) { alert("Erro ao criar evento."); }
    };

    const handleCriarMissao = async (e) => {
        e.preventDefault();
        try {
            await api.post('/missoes', novaMissao);
            alert("🏆 Missão Criada!");
            setNovaMissao({ ...novaMissao, titulo: '', descricao: '' });
        } catch (error) { alert("Erro: " + (error.response?.data?.erro || error.message)); }
    };

    const getPendentesFiltrados = () => {
        return pendentes.filter(evt => {
            if (filtroAprovacao === 'todos') return true;
            if (filtroAprovacao === 'sugestoes') return evt.pequenoPorte === true;
            if (filtroAprovacao === 'reportes') return evt.pequenoPorte === false;
            return true;
        });
    };

    return (
        <div className="min-h-screen bg-gray-50 font-sans text-gray-800 flex flex-col items-center pb-20">
            
            {/* Header */}
            <header className="w-full bg-white shadow-sm border-b border-gray-100 sticky top-0 z-20">
                <div className="max-w-5xl mx-auto px-4 py-3 flex justify-between items-center">
                    <div className="flex items-center gap-2">
                        <div className="bg-gray-900 p-2 rounded-lg text-white"><Shield size={20} /></div>
                        <h1 className="text-lg font-bold text-gray-900">Admin Capiba</h1>
                    </div>
                    
                    <nav className="flex gap-1">
                        {[
                            { id: 'dashboard', label: 'Painel', icon: LayoutDashboard },
                            { id: 'aprovacoes', label: 'Moderação', icon: CheckCircle, count: pendentes.length },
                            { id: 'gestao_eventos', label: 'Eventos', icon: Calendar },
                            { id: 'gestao_missoes', label: 'Missões', icon: Target },
                        ].map(tab => (
                            <button
                                key={tab.id}
                                onClick={() => setActiveTab(tab.id)}
                                className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-bold transition-all relative ${activeTab === tab.id ? 'bg-gray-100 text-gray-900' : 'text-gray-500 hover:bg-gray-50'}`}
                            >
                                <tab.icon size={16} />
                                <span className="hidden sm:inline">{tab.label}</span>
                                {tab.count > 0 && <span className="bg-red-500 text-white text-[10px] px-1.5 rounded-full">{tab.count}</span>}
                            </button>
                        ))}
                    </nav>
                </div>
            </header>

            <main className="w-full max-w-4xl p-6 flex-1">

                {/* DASHBOARD */}
                {activeTab === 'dashboard' && (
                    <div className="animate-in fade-in space-y-6">
                        <div className="grid grid-cols-2 gap-4">
                            <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm text-center">
                                <span className="p-3 bg-orange-100 text-orange-600 rounded-full mb-2 inline-block"><Clock size={24} /></span>
                                <h3 className="text-3xl font-black text-gray-800">{pendentes.length}</h3>
                                <p className="text-xs font-bold text-gray-400 uppercase">Pendentes</p>
                            </div>
                            <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm text-center">
                                <span className="p-3 bg-blue-100 text-blue-600 rounded-full mb-2 inline-block"><Calendar size={24} /></span>
                                <h3 className="text-3xl font-black text-gray-800">{eventosAtivos.length}</h3>
                                <p className="text-xs font-bold text-gray-400 uppercase">Agenda Ativa</p>
                            </div>
                        </div>
                    </div>
                )}

                {/* APROVAÇÕES */}
                {activeTab === 'aprovacoes' && (
                    <div className="space-y-4 animate-in slide-in-from-bottom-2">
                        <div className="flex justify-center mb-4">
                            <div className="bg-white p-1 rounded-lg border border-gray-200 flex">
                                {['todos', 'reportes', 'sugestoes'].map(filtro => (
                                    <button
                                        key={filtro}
                                        onClick={() => setFiltroAprovacao(filtro)}
                                        className={`px-4 py-1.5 rounded-md text-xs font-bold uppercase ${filtroAprovacao === filtro ? 'bg-gray-900 text-white' : 'text-gray-400 hover:text-gray-600'}`}
                                    >
                                        {filtro}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {getPendentesFiltrados().length === 0 ? (
                            <div className="text-center py-12 bg-white rounded-2xl border border-dashed border-gray-200"><p className="text-gray-400 font-medium">Tudo limpo!</p></div>
                        ) : (
                            getPendentesFiltrados().map(evt => {
                                const isReporte = !evt.pequenoPorte;
                                return (
                                    <div key={evt.id} className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100 flex flex-col sm:flex-row gap-4">
                                        <div className="w-full sm:w-24 h-24 bg-gray-100 rounded-xl overflow-hidden shrink-0 relative">
                                            {evt.imagemUrl ? <img src={getFullImageUrl(evt.imagemUrl)} className="w-full h-full object-cover" /> : <div className="w-full h-full flex items-center justify-center text-gray-300"><FileText size={20}/></div>}
                                            <div className={`absolute top-0 inset-x-0 h-1 ${isReporte ? 'bg-red-500' : 'bg-blue-500'}`} />
                                        </div>
                                        <div className="flex-1">
                                            <div className="flex justify-between items-start">
                                                <h3 className="font-bold text-gray-800">{evt.nome}</h3>
                                                <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded ${isReporte ? 'bg-red-100 text-red-600' : 'bg-blue-100 text-blue-600'}`}>{isReporte ? 'REPORTE' : 'SUGESTÃO'}</span>
                                            </div>
                                            <p className="text-xs text-gray-500 flex items-center gap-1 mt-1"><MapPin size={12}/> {evt.local}</p>
                                            <p className="text-xs text-gray-600 mt-2 bg-gray-50 p-2 rounded italic">"{evt.descricao}"</p>
                                            <div className="flex gap-2 mt-3">
                                                <button onClick={() => handleAprovar(evt.id)} className="flex-1 py-2 bg-green-50 text-green-700 hover:bg-green-100 rounded-lg text-xs font-bold">Aprovar</button>
                                                <button onClick={() => handleRejeitar(evt.id)} className="flex-1 py-2 bg-red-50 text-red-700 hover:bg-red-100 rounded-lg text-xs font-bold">Rejeitar</button>
                                            </div>
                                        </div>
                                    </div>
                                );
                            })
                        )}
                    </div>
                )}

                {/* GESTÃO DE EVENTOS */}
                {activeTab === 'gestao_eventos' && (
                    <div className="space-y-6 animate-in slide-in-from-right-2">
                        {/* form */}
                        <div className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100">
                            <h2 className="text-sm font-bold text-gray-800 mb-4 flex items-center gap-2"><Plus size={16} className="text-blue-600"/> Novo Evento Oficial</h2>
                            <form onSubmit={handleCriarEventoOficial} className="grid grid-cols-2 gap-3">
                                <input className="col-span-2 p-2.5 bg-gray-50 rounded-lg text-sm border outline-none focus:border-blue-500 font-bold" placeholder="Nome do Evento" value={novoEvento.nome} onChange={e => setNovoEvento({...novoEvento, nome: e.target.value})} required />
                                <input className="p-2.5 bg-gray-50 rounded-lg text-sm border outline-none focus:border-blue-500" placeholder="Local" value={novoEvento.local} onChange={e => setNovoEvento({...novoEvento, local: e.target.value})} required />
                                <input type="datetime-local" className="p-2.5 bg-gray-50 rounded-lg text-sm border outline-none focus:border-blue-500" value={novoEvento.data} onChange={e => setNovoEvento({...novoEvento, data: e.target.value})} required />
                                <input className="col-span-2 p-2.5 bg-gray-50 rounded-lg text-sm border outline-none focus:border-blue-500" placeholder="Horário (Ex: 19h)" value={novoEvento.horario} onChange={e => setNovoEvento({...novoEvento, horario: e.target.value})} />
                                <textarea rows="2" className="col-span-2 p-2.5 bg-gray-50 rounded-lg text-sm border outline-none focus:border-blue-500 resize-none" placeholder="Descrição" value={novoEvento.descricao} onChange={e => setNovoEvento({...novoEvento, descricao: e.target.value})} required />
                                <button className="col-span-2 py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-lg text-sm transition-colors">Publicar na Agenda</button>
                            </form>
                        </div>

                        <div className="space-y-2">
                            <h3 className="text-xs font-bold text-gray-400 uppercase ml-1">Agenda do Mês</h3>
                            {eventosAtivos.map(evt => (
                                <div key={evt.id} className="bg-white p-3 rounded-xl border border-gray-100 flex justify-between items-center">
                                    <div className="flex items-center gap-3">
                                        <div className="text-center bg-gray-100 p-2 rounded-lg min-w-[50px]">
                                            <span className="block text-xs font-bold text-gray-500 uppercase">{new Date(evt.data).toLocaleDateString('pt-BR', {month:'short'})}</span>
                                            <span className="block text-lg font-black text-gray-800 leading-none">{new Date(evt.data).getDate()}</span>
                                        </div>
                                        <div>
                                            <h4 className="font-bold text-gray-800 text-sm">{evt.nome}</h4>
                                            <p className="text-xs text-gray-500">{evt.local}</p>
                                        </div>
                                    </div>
                                    <button onClick={() => handleRejeitar(evt.id)} className="p-2 text-gray-300 hover:text-red-500 hover:bg-red-50 rounded-lg"><Trash2 size={16}/></button>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* MISSÕES */}
                {activeTab === 'gestao_missoes' && (
                    <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 animate-in slide-in-from-right-2">
                        <div className="flex items-center gap-3 mb-6">
                            <div className="bg-purple-100 p-2 rounded-lg text-purple-600"><Target size={24} /></div>
                            <h2 className="text-lg font-bold text-gray-800">Criar Missão</h2>
                        </div>
                        <form onSubmit={handleCriarMissao} className="space-y-4">
                            <input className="w-full p-3 bg-gray-50 rounded-xl font-bold border outline-none focus:border-purple-500" placeholder="Título da Missão" value={novaMissao.titulo} onChange={e => setNovaMissao({...novaMissao, titulo: e.target.value})} required />
                            <textarea className="w-full p-3 bg-gray-50 rounded-xl text-sm border outline-none focus:border-purple-500 resize-none" rows="3" placeholder="Descrição" value={novaMissao.descricao} onChange={e => setNovaMissao({...novaMissao, descricao: e.target.value})} required />
                            <div className="grid grid-cols-2 gap-4">
                                <select className="w-full p-3 bg-gray-50 rounded-xl text-sm font-medium outline-none" value={novaMissao.tipoRequisito} onChange={e => setNovaMissao({...novaMissao, tipoRequisito: e.target.value})}>
                                    <option value="COUNT_CHECKINS">Check-ins</option>
                                    <option value="UNIQUE_LOCATIONS">Locais Únicos</option>
                                </select>
                                <input type="number" className="w-full p-3 bg-gray-50 rounded-xl text-sm font-bold outline-none" placeholder="Qtd" value={novaMissao.valorRequisito} onChange={e => setNovaMissao({...novaMissao, valorRequisito: e.target.value})} />
                            </div>
                            <input type="number" className="w-full p-3 bg-yellow-50 text-yellow-700 rounded-xl font-bold outline-none border border-yellow-100" placeholder="Recompensa (Capibas)" value={novaMissao.recompensaCapibas} onChange={e => setNovaMissao({...novaMissao, recompensaCapibas: e.target.value})} />
                            <button type="submit" className="w-full py-4 bg-gray-900 hover:bg-black text-white font-bold rounded-xl transition-all shadow-lg mt-2">Lançar Missão</button>
                        </form>
                    </div>
                )}
            </main>
        </div>
    );
};

export default AdminPage;