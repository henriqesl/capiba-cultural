import React, { useState, useEffect, useContext, useRef } from 'react';
import {
    ArrowLeft,
    Camera,
    User,
    Save,
    Lock,
    Mail,
    MapPin,
    Home,
    Calendar,
    Edit2,
    X
} from 'lucide-react';
import { AuthContext } from '../../context/AuthContext';
import api from '../../services/api';

import placeholderImg from '../../assets/profile-placeholder.png';

const BASE_URL_BACKEND = 'http://localhost:3000';

const ProfilePage = () => {
    const { user } = useContext(AuthContext);
    const [loading, setLoading] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    
    const fileInputRef = useRef(null);

    const [formData, setFormData] = useState({
        nome: '',
        email: '',
        cpf: '',
        senha: '',
        dataNascimento: '',
        cep: '',
        endereco: '',
        numero: '',
        bairro: ''
    });

    const [previewUrl, setPreviewUrl] = useState(null);
    const [fileToSend, setFileToSend] = useState(null);

    useEffect(() => {
        if (user?.id) {
            carregarDados();
        }
    }, [user]);

    const carregarDados = async () => {
        try {
            const res = await api.get(`/usuarios/${user.id}`);
            const data = res.data;

            let dataFormatada = '';
            if (data.dataNascimento) {
                const dateObj = new Date(data.dataNascimento);
                if(!isNaN(dateObj)){
                    dataFormatada = dateObj.toISOString().split('T')[0];
                }
            }

            setFormData({
                nome: data.nome || '',
                email: data.email || '',
                cpf: data.cpf || '',
                senha: '', 
                dataNascimento: dataFormatada,
                cep: data.cep || '',
                endereco: data.endereco || '',
                numero: data.numero || '',
                bairro: data.bairro || ''
            });
        } catch (error) {
            console.error("Erro ao carregar dados do usuário", error);
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setFileToSend(file);
            setPreviewUrl(URL.createObjectURL(file));
        }
    };

    const triggerFileInput = () => {
        if (isEditing && fileInputRef.current) {
            fileInputRef.current.click();
        }
    };

    const handleSave = async () => {
        setLoading(true);
        try {
            const data = new FormData();
            
            Object.keys(formData).forEach(key => {
                if (formData[key]) {
                    data.append(key, formData[key]);
                }
            });

            if (fileToSend) {
                data.append('foto', fileToSend);
            }

            await api.put(`/usuarios/${user.id}`, data, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });

            alert("Perfil atualizado com sucesso!");
            setIsEditing(false);
            window.location.reload(); 
        } catch (error) {
            console.error(error);
            alert("Erro ao atualizar perfil.");
        } finally {
            setLoading(false);
        }
    };

    
    const getAvatarUrl = (foto) => {
        if (!foto) return placeholderImg;
        if (foto.startsWith('blob:')) return foto; 
        return foto.startsWith('http') ? foto : `${BASE_URL_BACKEND}${foto.startsWith('/') ? '' : '/'}${foto}`;
    };

    const currentPhoto = previewUrl || user?.foto;

    return (
        <div className="min-h-screen bg-gray-50 pb-24 font-sans">
            
            <div className="bg-white pb-8 rounded-b-[2.5rem] shadow-sm relative mb-6">
                <div className="h-32 bg-gradient-to-r from-blue-600 to-purple-600 relative">
                    <button 
                        onClick={() => window.location.hash = '#/eventos'} 
                        className="absolute top-4 left-4 bg-white/20 backdrop-blur-md p-2 rounded-full text-white hover:bg-white/30 transition-all"
                    >
                        <ArrowLeft size={24} />
                    </button>
                </div>
                
                <div className="px-6 -mt-16 text-center">
                    <div className="relative inline-block group">
                        <div className={`w-32 h-32 rounded-full border-4 border-white shadow-lg overflow-hidden bg-white ${isEditing ? 'cursor-pointer hover:opacity-90' : ''}`} onClick={triggerFileInput}>
                          
                            <img 
                                src={getAvatarUrl(currentPhoto)} 
                                alt="Profile" 
                                className="w-full h-full object-cover"
                                onError={(e) => e.target.src = placeholderImg}
                            />
                        </div>
                        
                        {isEditing && (
                            <>
                                <div 
                                    className="absolute bottom-2 right-2 bg-blue-600 text-white p-2 rounded-full shadow-lg cursor-pointer hover:bg-blue-700 transition-all hover:scale-110"
                                    onClick={triggerFileInput}
                                >
                                    <Camera size={18} />
                                </div>
                                <input 
                                    type="file" 
                                    ref={fileInputRef} 
                                    className="hidden" 
                                    accept="image/*"
                                    onChange={handleFileChange}
                                />
                            </>
                        )}
                    </div>
                    
                    <div className="mt-3">
                        <h1 className="text-2xl font-bold text-gray-800 capitalize">{formData.nome || user?.nome}</h1>
                        <p className="text-gray-500 font-medium">@{formData.email?.split('@')[0] || user?.email?.split('@')[0]}</p>
                    </div>
                </div>
            </div>

            <div className="px-6 max-w-xl mx-auto">
                
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-lg font-bold text-gray-700 flex items-center gap-2">
                        <User size={20} className="text-blue-600"/> Meus Dados
                    </h2>
                    {isEditing ? (
                        <div className="flex gap-2">
                            <button 
                                onClick={() => { setIsEditing(false); setPreviewUrl(null); setFileToSend(null); }} 
                                className="p-2 rounded-xl bg-gray-200 text-gray-600 font-bold hover:bg-gray-300 transition-colors"
                            >
                                <X size={20} />
                            </button>
                            <button 
                                onClick={handleSave} 
                                disabled={loading}
                                className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-xl font-bold hover:bg-green-700 transition-all shadow-md active:scale-95 disabled:opacity-50"
                            >
                                {loading ? '...' : <><Save size={18}/> Salvar</>}
                            </button>
                        </div>
                    ) : (
                        <button 
                            onClick={() => setIsEditing(true)} 
                            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-xl font-bold hover:bg-blue-700 transition-all shadow-md active:scale-95"
                        >
                            <Edit2 size={18}/> Editar
                        </button>
                    )}
                </div>

                <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 space-y-5">
                    
                    <div className="space-y-2">
                        <label className="text-xs font-bold text-gray-400 uppercase tracking-wide ml-1">Nome Completo</label>
                        <div className={`flex items-center border-2 rounded-xl px-4 py-3 transition-all ${isEditing ? 'bg-white border-blue-500 shadow-sm' : 'bg-gray-50 border-transparent'}`}>
                            <User className={`w-5 h-5 mr-3 ${isEditing ? 'text-blue-500' : 'text-gray-400'}`} />
                            <input 
                                name="nome"
                                value={formData.nome} 
                                onChange={handleChange}
                                disabled={!isEditing}
                                className="bg-transparent w-full outline-none text-gray-700 font-medium placeholder-gray-300 disabled:text-gray-500"
                            />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <label className="text-xs font-bold text-gray-400 uppercase tracking-wide ml-1">Email</label>
                        <div className="flex items-center border-2 border-gray-100 bg-gray-50 rounded-xl px-4 py-3">
                            <Mail className="w-5 h-5 mr-3 text-gray-400" />
                            <input 
                                value={formData.email} 
                                disabled 
                                className="bg-transparent w-full outline-none text-gray-500 font-medium"
                            />
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <label className="text-xs font-bold text-gray-400 uppercase tracking-wide ml-1">Nascimento</label>
                            <div className={`flex items-center border-2 rounded-xl px-3 py-3 transition-all ${isEditing ? 'bg-white border-blue-500' : 'bg-gray-50 border-transparent'}`}>
                                <Calendar className={`w-5 h-5 mr-2 ${isEditing ? 'text-blue-500' : 'text-gray-400'}`} />
                                <input 
                                    name="dataNascimento"
                                    type="date"
                                    value={formData.dataNascimento} 
                                    onChange={handleChange}
                                    disabled={!isEditing}
                                    className="bg-transparent w-full outline-none text-gray-700 font-medium text-sm disabled:text-gray-500"
                                />
                            </div>
                        </div>
                        <div className="space-y-2">
                            <label className="text-xs font-bold text-gray-400 uppercase tracking-wide ml-1">CPF</label>
                            <div className={`flex items-center border-2 rounded-xl px-3 py-3 transition-all ${isEditing ? 'bg-white border-blue-500' : 'bg-gray-50 border-transparent'}`}>
                                <input 
                                    name="cpf"
                                    placeholder="000.000.000-00"
                                    value={formData.cpf} 
                                    onChange={handleChange}
                                    disabled={!isEditing}
                                    className="bg-transparent w-full outline-none text-gray-700 font-medium text-sm disabled:text-gray-500"
                                />
                            </div>
                        </div>
                    </div>

                    <div className="h-px bg-gray-100 my-2"></div>

                    <div className="space-y-2">
                        <label className="text-xs font-bold text-gray-400 uppercase tracking-wide ml-1">Endereço</label>
                        <div className={`flex items-center border-2 rounded-xl px-4 py-3 transition-all ${isEditing ? 'bg-white border-blue-500' : 'bg-gray-50 border-transparent'}`}>
                            <MapPin className={`w-5 h-5 mr-3 ${isEditing ? 'text-blue-500' : 'text-gray-400'}`} />
                            <input 
                                name="endereco"
                                placeholder="Rua..."
                                value={formData.endereco} 
                                onChange={handleChange}
                                disabled={!isEditing}
                                className="bg-transparent w-full outline-none text-gray-700 font-medium placeholder-gray-300 disabled:text-gray-500"
                            />
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <label className="text-xs font-bold text-gray-400 uppercase tracking-wide ml-1">Bairro</label>
                            <div className={`flex items-center border-2 rounded-xl px-4 py-3 transition-all ${isEditing ? 'bg-white border-blue-500' : 'bg-gray-50 border-transparent'}`}>
                                <Home className={`w-5 h-5 mr-2 ${isEditing ? 'text-blue-500' : 'text-gray-400'}`} />
                                <input 
                                    name="bairro"
                                    placeholder="Bairro"
                                    value={formData.bairro} 
                                    onChange={handleChange}
                                    disabled={!isEditing}
                                    className="bg-transparent w-full outline-none text-gray-700 font-medium placeholder-gray-300 disabled:text-gray-500"
                                />
                            </div>
                        </div>
                        <div className="space-y-2">
                            <label className="text-xs font-bold text-gray-400 uppercase tracking-wide ml-1">Número</label>
                            <div className={`flex items-center border-2 rounded-xl px-4 py-3 transition-all ${isEditing ? 'bg-white border-blue-500' : 'bg-gray-50 border-transparent'}`}>
                                <input 
                                    name="numero"
                                    placeholder="Nº"
                                    value={formData.numero} 
                                    onChange={handleChange}
                                    disabled={!isEditing}
                                    className="bg-transparent w-full outline-none text-gray-700 font-medium placeholder-gray-300 disabled:text-gray-500"
                                />
                            </div>
                        </div>
                    </div>

                    <hr className="border-gray-100 my-4" />

                    <div className="space-y-2 mb-8">
                        <label className={`text-xs font-bold uppercase tracking-wide ml-1 ${isEditing ? 'text-red-400' : 'text-gray-400'}`}>
                            Alterar Senha {isEditing ? '' : '(Bloqueado)'}
                        </label>
                        <div className={`flex items-center border-2 rounded-xl px-4 py-3 transition-all ${isEditing ? 'bg-white border-red-50 focus-within:border-red-400' : 'bg-gray-50 border-transparent'}`}>
                            <Lock className={`w-5 h-5 mr-3 ${isEditing ? 'text-red-300' : 'text-gray-300'}`} />
                            <input 
                                name="senha"
                                type="password"
                                placeholder={isEditing ? "Digite apenas se quiser trocar" : "********"}
                                value={formData.senha} 
                                onChange={handleChange}
                                disabled={!isEditing}
                                className="bg-transparent w-full outline-none text-gray-700 font-medium placeholder-gray-300 disabled:text-gray-400"
                            />
                        </div>
                    </div>

                </div>
            </div>
        </div>
    );
};

export default ProfilePage;