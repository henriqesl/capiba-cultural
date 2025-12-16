import React, { useState, useEffect } from 'react';
import { ArrowLeft, Users, Lock, Type, Calendar, AlignLeft } from 'lucide-react'; // Adicionei AlignLeft
import { useAuth } from '../../context/AuthContext'; 
import api from '../../services/api'; 

const CreateCaravanaPage = ({ onBack, onCreate }) => {
    const { user: userContext } = useAuth(); 
    const [eventos, setEventos] = useState([]); 
    const [selectedEventId, setSelectedEventId] = useState('');
    const [loading, setLoading] = useState(false);
    
    const [formData, setFormData] = useState({
        nome: '',
        codigoAcesso: '',
        descricao: '' 
    });

    useEffect(() => {
        api.get('/eventos')
            .then(response => {
                setEventos(response.data);
            })
            .catch(error => console.error("Erro ao carregar eventos:", error));
    }, []);

    const generateAccessCode = () => {
        const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
        let code = '';
        for (let i = 0; i < 6; i++) {
            code += characters.charAt(Math.floor(Math.random() * characters.length));
        }
        setFormData(prev => ({ ...prev, codigoAcesso: code }));
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ 
            ...prev, 
            [name]: name === 'codigoAcesso' ? value.toUpperCase() : value 
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        if (!userContext?.id) return alert("Erro de autenticação.");
        if (!formData.nome || !selectedEventId || !formData.codigoAcesso) {
            return alert("Preencha os campos obrigatórios (Nome, Evento e Código).");
        }

        setLoading(true);
        try {
            // ✅ Envia a descrição junto com os outros dados
            const response = await api.post('/caravanas', {
                nome: formData.nome,
                codigoAcesso: formData.codigoAcesso,
                eventoId: Number(selectedEventId),
                descricao: formData.descricao // Campo novo
            });

            onCreate(response.data.caravana); 

        } catch (error) {
            console.error(error);
            const msg = error.response?.data?.erro || "Erro ao criar caravana.";
            alert(msg);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="w-full min-h-screen bg-gray-50 flex flex-col items-center pb-20">
            <div className="w-full max-w-md bg-white min-h-screen md:min-h-fit md:rounded-2xl md:shadow-xl md:my-8 flex flex-col">
                <header className="bg-white p-4 flex items-center border-b border-gray-100 sticky top-0">
                    <button onClick={onBack} className="p-2 -ml-2 hover:bg-gray-100 rounded-full text-gray-600">
                        <ArrowLeft className="w-6 h-6" />
                    </button>
                    <h1 className="text-lg font-bold text-gray-800 ml-2">Criar Nova Caravana</h1>
                </header>

                <form onSubmit={handleSubmit} className="p-6 flex flex-col gap-5">
                    
                    {/* Nome do Grupo */}
                    <div>
                        <label className="block text-sm font-bold text-gray-700 mb-1">Nome do Grupo *</label>
                        <div className="relative">
                            <Type className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
                            <input 
                                name="nome" 
                                value={formData.nome} 
                                onChange={handleChange} 
                                placeholder="Ex: Van do Rock" 
                                className="w-full pl-10 p-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500" 
                                maxLength={30}
                            />
                        </div>
                    </div>

                    {/* ✅ NOVA PARTE: Descrição Breve */}
                    <div>
                        <label className="block text-sm font-bold text-gray-700 mb-1">Descrição Breve (Opcional)</label>
                        <div className="relative">
                            <AlignLeft className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
                            <input 
                                name="descricao" 
                                value={formData.descricao} 
                                onChange={handleChange} 
                                placeholder="Ex: Saída às 14h da Praça..." 
                                className="w-full pl-10 p-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500" 
                                maxLength={60} // Limite para ser "bem breve"
                            />
                        </div>
                        <p className="text-xs text-gray-400 mt-1 text-right">{formData.descricao.length}/60 caracteres</p>
                    </div>

                    {/* Evento */}
                    <div>
                        <label className="block text-sm font-bold text-gray-700 mb-1">Evento de Destino *</label>
                        <div className="relative">
                            <Calendar className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
                            <select value={selectedEventId} onChange={(e) => setSelectedEventId(e.target.value)} className="w-full pl-10 p-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 appearance-none" required>
                                <option value="">Selecione um evento</option>
                                {eventos.map(evento => (
                                    <option key={evento.id} value={evento.id}>
                                        {evento.nome} ({new Date(evento.data).toLocaleDateString()})
                                    </option>
                                ))}
                            </select>
                        </div>
                    </div>

                    {/* Código de Acesso */}
                    <div>
                        <label className="block text-sm font-bold text-gray-700 mb-1">Código de Acesso *</label>
                        <div className="flex gap-2"> 
                            <div className="relative flex-grow">
                                <Lock className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
                                <input name="codigoAcesso" value={formData.codigoAcesso} onChange={handleChange} className="w-full pl-10 p-3 bg-gray-50 border border-gray-200 rounded-xl font-mono tracking-widest uppercase" maxLength={10} />
                            </div>
                            <button type="button" onClick={generateAccessCode} className="p-3 bg-gray-600 text-white rounded-xl text-sm font-semibold hover:bg-gray-700 transition-colors">Gerar</button>
                        </div>
                    </div>

                    <div className="pt-4">
                        <button type="submit" disabled={loading} className="w-full bg-blue-600 text-white font-bold py-4 rounded-xl shadow-lg hover:bg-blue-700 transition-colors flex items-center justify-center gap-2">
                            {loading ? "Criando..." : <><Users className='w-5 h-5' /> Criar Nova Caravana</>}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default CreateCaravanaPage;