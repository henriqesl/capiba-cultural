import React, { useState, useEffect } from 'react';
import { ArrowLeft, Users, Lock, Type, Calendar } from 'lucide-react'; 
import { useAuth } from '../../context/AuthContext'; 

// 🚨 SIMULAÇÃO DE DADOS: Esta lista viria de uma chamada à sua API (ex: GET /api/eventos)
const eventosMock = [
    { id: 1, nome: "Show do Coldplay - São Paulo", data: "2025-12-15", local: "Estádio do Morumbi" },
    { id: 2, nome: "Rock in Rio 2026", data: "2026-09-01", local: "Cidade do Rock" },
    { id: 3, nome: "Lollapalooza Brasil", data: "2026-03-20", local: "Autódromo de Interlagos" }
];

const CreateCaravanaPage = ({ onBack, onCreate }) => {
    
    const { user: userContext } = useAuth(); 
    const [selectedEventId, setSelectedEventId] = useState('');
    
    const [formData, setFormData] = useState({
        nome: '',
        codigoAcesso: ''
    });

    // 🎯 FUNÇÃO DE GERAÇÃO DE CÓDIGO 🎯
    const generateAccessCode = () => {
        // Caracteres permitidos (letras maiúsculas e números)
        const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
        let code = '';
        
        // Gera 6 caracteres (ou o tamanho que você definir como padrão)
        for (let i = 0; i < 6; i++) {
            const randomIndex = Math.floor(Math.random() * characters.length);
            code += characters.charAt(randomIndex);
        }
        
        // Atualiza o estado do formulário com o novo código
        setFormData(prev => ({ ...prev, codigoAcesso: code }));
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        const updatedValue = name === 'codigoAcesso' ? value.toUpperCase() : value;
        setFormData(prev => ({ ...prev, [name]: updatedValue }));
    };

    const handleSelectEvent = (e) => {
        setSelectedEventId(e.target.value);
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        
        if (!userContext?.id) {
            alert("Erro de autenticação: ID do usuário não encontrado.");
            return;
        }

        // 🚨 VALIDAÇÃO: Exige Nome, Evento e Código de Acesso
        if (!formData.nome || !selectedEventId || !formData.codigoAcesso) {
            alert("Por favor, preencha o Nome do Grupo, selecione o Evento e o Código de Acesso.");
            return;
        }

        // Constrói o objeto final para o Backend
        const newCaravanaData = {
            nome: formData.nome,
            codigoAcesso: formData.codigoAcesso,
            eventoId: Number(selectedEventId), // 🔑 ENVIA APENAS O ID DO EVENTO
            criadorId: userContext.id, 
        };

        // Chama a função do App.js para salvar
        onCreate(newCaravanaData);
    };

    return (
        <div className="w-full min-h-screen bg-gray-50 flex flex-col items-center pb-20">
            <div className="w-full max-w-md bg-white min-h-screen md:min-h-fit md:rounded-2xl md:shadow-xl md:my-8 flex flex-col">
                
                {/* Header */}
                <header className="bg-white p-4 flex items-center border-b border-gray-100 sticky top-0">
                    <button onClick={onBack} className="p-2 -ml-2 hover:bg-gray-100 rounded-full text-gray-600">
                        <ArrowLeft className="w-6 h-6" />
                    </button>
                    <h1 className="text-lg font-bold text-gray-800 ml-2">Criar Nova Caravana</h1>
                </header>

                <form onSubmit={handleSubmit} className="p-6 flex flex-col gap-5">
                    
                    {/* Nome do Grupo */}
                    <div>
                        <label className="block text-sm font-bold text-gray-700 mb-1">Nome do Grupo</label>
                        <div className="relative">
                            <Type className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
                            <input 
                                name="nome"
                                value={formData.nome}
                                onChange={handleChange}
                                placeholder="Ex: Van do Rock"
                                className="w-full pl-10 p-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                        </div>
                    </div>

                    {/* 🚨 CAMPO: Seleção de Evento */}
                    <div>
                        <label className="block text-sm font-bold text-gray-700 mb-1">Evento de Destino</label>
                        <div className="relative">
                            <Calendar className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
                            <select 
                                value={selectedEventId}
                                onChange={handleSelectEvent}
                                className="w-full pl-10 p-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 appearance-none"
                                required
                            >
                                <option value="">Selecione um evento</option>
                                {eventosMock.map(evento => (
                                    <option key={evento.id} value={evento.id}>
                                        {evento.nome} ({new Date(evento.data).toLocaleDateString()})
                                    </option>
                                ))}
                            </select>
                        </div>
                        <p className="text-xs text-gray-500 mt-1">A caravana será vinculada ao evento e sua data.</p>
                    </div>

                    {/* 🔑 CÓDIGO DE ACESSO COM BOTÃO GERAR */}
                    <div>
                        <label className="block text-sm font-bold text-gray-700 mb-1">Código de Acesso (Senha)</label>
                        <div className="flex gap-2"> 
                            <div className="relative flex-grow">
                                <Lock className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
                                <input 
                                    name="codigoAcesso"
                                    value={formData.codigoAcesso}
                                    onChange={handleChange}
                                    placeholder="Gerar ou digitar código"
                                    className="w-full pl-10 p-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 font-mono tracking-widest uppercase"
                                    maxLength={10}
                                />
                            </div>
                            <button
                                type="button" 
                                onClick={generateAccessCode}
                                className="p-3 bg-gray-600 text-white rounded-xl text-sm font-semibold hover:bg-gray-700 transition-colors"
                            >
                                Gerar
                            </button>
                        </div>
                        <p className="text-xs text-gray-500 mt-1">Seus amigos usarão este código para entrar no grupo.</p>
                    </div>

                    <div className="pt-4">
                        <button 
                            type="submit"
                            className="w-full bg-blue-600 text-white font-bold py-4 rounded-xl shadow-lg hover:bg-blue-700 transition-colors flex items-center justify-center gap-2"
                        >
                            <Users className='w-5 h-5' /> Criar Nova Caravana
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default CreateCaravanaPage;