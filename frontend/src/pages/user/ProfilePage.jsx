import React, { useState, useEffect, useContext, useRef } from 'react';
import { PerfilImage } from '../../components/user/UserShared.jsx'; 
import { ArrowLeft, Camera, User, Save, Lock, Mail, MapPin, Home, Calendar, Edit2, X } from 'lucide-react';
import { AuthContext } from '../../context/AuthContext';
import api from '../../services/api';

const ProfilePage = () => {
  const { user } = useContext(AuthContext);
  const [loading, setLoading] = useState(false);
  
  // === 1. NOVO ESTADO: CONTROLA SE ESTÁ EDITANDO OU NÃO ===
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
  
  // Carrega dados iniciais
  useEffect(() => {
    if (user?.id) {
        carregarDados();
    }
  }, [user]);

  const carregarDados = () => {
    api.get(`/usuarios/${user.id}`).then(res => {
        const data = res.data;
        
        let dataFormatada = '';
        if (data.dataNascimento) {
            dataFormatada = data.dataNascimento.toString().slice(0, 10);
        }

        setFormData({
            nome: data.nome || '',
            email: data.email || '',
            cpf: data.cpf || '',
            senha: '', // Senha sempre vazia por segurança
            dataNascimento: dataFormatada,
            cep: data.cep || '',
            endereco: data.endereco || '',
            numero: data.numero || '',
            bairro: data.bairro || ''
        });

        if (data.fotoUrl) {
            setPreviewUrl(data.fotoUrl); 
        }
    });
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
        setFileToSend(file);
        setPreviewUrl(URL.createObjectURL(file));
    }
  };

  // === CORREÇÃO DO SALVAR ===
  const handleSave = async () => {
    setLoading(true);
    try {
        const data = new FormData();
        
        // Só adiciona campos se tiverem valor para evitar erro no backend
        if (formData.nome) data.append('nome', formData.nome);
        if (formData.cpf) data.append('cpf', formData.cpf);
        
        // Tratamento especial para Senha (só envia se o usuário digitou algo)
        if (formData.senha && formData.senha.trim() !== '') {
            data.append('senha', formData.senha);
        }
        
        // Tratamento especial para Data
        if (formData.dataNascimento) data.append('dataNascimento', formData.dataNascimento);
        
        // Endereço
        if (formData.cep) data.append('cep', formData.cep);
        if (formData.endereco) data.append('endereco', formData.endereco);
        if (formData.numero) data.append('numero', formData.numero);
        if (formData.bairro) data.append('bairro', formData.bairro);

        // Foto
        if (fileToSend) data.append('foto', fileToSend);

        // Envia para o backend
        await api.put(`/usuarios/${user.id}`, data);
        
        alert("Perfil atualizado com sucesso!");
        setIsEditing(false); // Sai do modo de edição
    } catch (error) {
        console.error("Erro no update:", error);
        alert("Erro ao atualizar. Verifique se preencheu os campos obrigatórios.");
    } finally {
        setLoading(false);
    }
  };

  // Função para cancelar edição e voltar os dados ao original
  const handleCancel = () => {
      setIsEditing(false);
      carregarDados(); // Recarrega do banco para desfazer alterações locais
      setFileToSend(null);
  };

  return (
    <div className="w-full min-h-screen bg-gray-50 flex flex-col items-center py-6 pb-24">
      <div className="w-[95%] max-w-5xl bg-white rounded-3xl shadow-xl overflow-hidden flex flex-col md:flex-row">
        
        {/* === COLUNA ESQUERDA === */}
        <aside className="md:w-1/3 bg-blue-600 text-white p-8 flex flex-col items-center justify-center text-center relative">
          <a href="#/perfil" className="absolute top-6 left-6 p-2 bg-white/20 rounded-full hover:bg-white/30 transition">
             <ArrowLeft className="w-6 h-6" />
          </a>

          {/* Foto só permite clique se estiver editando */}
          <div className={`mb-8 relative group ${isEditing ? 'cursor-pointer' : ''}`} onClick={() => isEditing && fileInputRef.current.click()}>
            <div className="rounded-full p-1 bg-white/30 backdrop-blur-md">
                <PerfilImage src={previewUrl} className="w-40 h-40 rounded-full object-cover border-4 border-white shadow-2xl" />
            </div>
            
            {/* Ícone de câmera só aparece se estiver editando */}
            {isEditing && (
                <div className="absolute bottom-2 right-2 bg-yellow-400 text-blue-900 p-2 rounded-full shadow-lg hover:scale-110 transition-transform">
                    <Camera className="w-5 h-5" />
                </div>
            )}
            <input type="file" ref={fileInputRef} onChange={handleFileChange} accept="image/*" className="hidden" disabled={!isEditing} />
          </div>

          <h2 className="text-2xl font-bold">{formData.nome || "Usuário"}</h2>
          <p className="text-blue-200 text-xs mt-1 opacity-80">CPF: {formData.cpf}</p> 
          
          <div className="w-full pt-8 space-y-3">
            {/* LÓGICA DO BOTÃO DE EDIÇÃO */}
            {!isEditing ? (
                <button 
                    onClick={() => setIsEditing(true)}
                    className="w-full py-4 bg-white text-blue-600 font-bold rounded-xl shadow-lg hover:bg-gray-100 active:scale-95 transition-all flex items-center justify-center gap-2"
                >
                    <Edit2 className="w-5 h-5" /> Editar Perfil
                </button>
            ) : (
                <>
                    <button 
                        onClick={handleSave}
                        disabled={loading}
                        className="w-full py-4 bg-green-400 text-blue-900 font-bold rounded-xl shadow-lg hover:bg-green-300 active:scale-95 transition-all flex items-center justify-center gap-2"
                    >
                        {loading ? "Salvando..." : <><Save className="w-5 h-5" /> Salvar</>}
                    </button>
                    
                    <button 
                        onClick={handleCancel}
                        disabled={loading}
                        className="w-full py-3 bg-blue-700 text-white font-semibold rounded-xl hover:bg-blue-800 transition-all flex items-center justify-center gap-2"
                    >
                        <X className="w-5 h-5" /> Cancelar
                    </button>
                </>
            )}
          </div>
        </aside>

        {/* === COLUNA DIREITA === */}
        <main className="flex-1 p-8 md:p-12 bg-white">
          <div className="flex items-center gap-3 mb-8">
            <div className="p-3 bg-blue-50 text-blue-600 rounded-xl">
                <User className="w-6 h-6" />
            </div>
            <div>
                <h1 className="text-2xl font-bold text-gray-800">Dados Pessoais</h1>
                <p className="text-gray-400 text-sm">
                    {isEditing ? "Edite suas informações abaixo" : "Visualize suas informações (clique em Editar para alterar)"}
                </p>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-6 max-w-2xl">
            
            {/* Nome */}
            <div className="space-y-2">
                <label className="text-xs font-bold text-gray-400 uppercase tracking-wide ml-1">Nome Completo</label>
                <div className={`flex items-center rounded-xl px-4 py-3 border transition-all ${isEditing ? 'bg-white border-blue-500 shadow-sm' : 'bg-gray-50 border-transparent'}`}>
                    <User className="w-5 h-5 text-gray-400 mr-3" />
                    <input 
                        name="nome" 
                        value={formData.nome} 
                        onChange={handleChange} 
                        disabled={!isEditing}
                        className="bg-transparent w-full outline-none text-gray-700 font-medium disabled:text-gray-500" 
                    />
                </div>
            </div>

            {/* Email (Sempre Bloqueado) e Data */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                    <label className="text-xs font-bold text-gray-400 uppercase tracking-wide ml-1">Email</label>
                    <div className="flex items-center bg-gray-100 rounded-xl px-4 py-3 border border-gray-200 opacity-70 cursor-not-allowed">
                        <Mail className="w-5 h-5 text-gray-400 mr-3" />
                        <input name="email" value={formData.email} readOnly className="bg-transparent w-full outline-none text-gray-500 font-medium" />
                    </div>
                </div>
                
                <div className="space-y-2">
                    <label className="text-xs font-bold text-gray-400 uppercase tracking-wide ml-1">Data de Nascimento</label>
                    <div className={`flex items-center rounded-xl px-4 py-3 border transition-all ${isEditing ? 'bg-white border-blue-500 shadow-sm' : 'bg-gray-50 border-transparent'}`}>
                        <Calendar className="w-5 h-5 text-gray-400 mr-3" />
                        <input 
                            type="date" 
                            name="dataNascimento" 
                            value={formData.dataNascimento} 
                            onChange={handleChange} 
                            disabled={!isEditing}
                            className="bg-transparent w-full outline-none text-gray-700 font-medium disabled:text-gray-500" 
                        />
                    </div>
                </div>
            </div>

            <hr className="border-gray-100 my-4" />
            
            {/* Endereço */}
            <h3 className="text-sm font-bold text-blue-600 uppercase tracking-wider mb-2 flex items-center gap-2">
                <MapPin className="w-4 h-4" /> Endereço
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-2 md:col-span-1">
                    <label className="text-xs font-bold text-gray-400 uppercase ml-1">CEP</label>
                    <input 
                        name="cep" 
                        value={formData.cep} 
                        onChange={handleChange} 
                        disabled={!isEditing}
                        className={`w-full rounded-xl px-4 py-3 border outline-none text-gray-700 font-medium transition-all ${isEditing ? 'bg-white border-blue-500' : 'bg-gray-50 border-transparent text-gray-500'}`} 
                        placeholder="00000-000" 
                    />
                </div>
                <div className="space-y-2 md:col-span-2">
                    <label className="text-xs font-bold text-gray-400 uppercase ml-1">Rua / Logradouro</label>
                    <input 
                        name="endereco" 
                        value={formData.endereco} 
                        onChange={handleChange} 
                        disabled={!isEditing}
                        className={`w-full rounded-xl px-4 py-3 border outline-none text-gray-700 font-medium transition-all ${isEditing ? 'bg-white border-blue-500' : 'bg-gray-50 border-transparent text-gray-500'}`} 
                    />
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                    <label className="text-xs font-bold text-gray-400 uppercase ml-1">Número</label>
                    <div className={`flex items-center rounded-xl px-4 py-3 border transition-all ${isEditing ? 'bg-white border-blue-500' : 'bg-gray-50 border-transparent'}`}>
                        <Home className="w-4 h-4 text-gray-400 mr-2" />
                        <input 
                            name="numero" 
                            value={formData.numero} 
                            onChange={handleChange} 
                            disabled={!isEditing}
                            className="bg-transparent w-full outline-none text-gray-700 font-medium disabled:text-gray-500" 
                        />
                    </div>
                </div>
                <div className="space-y-2">
                    <label className="text-xs font-bold text-gray-400 uppercase ml-1">Bairro</label>
                    <input 
                        name="bairro" 
                        value={formData.bairro} 
                        onChange={handleChange} 
                        disabled={!isEditing}
                        className={`w-full rounded-xl px-4 py-3 border outline-none text-gray-700 font-medium transition-all ${isEditing ? 'bg-white border-blue-500' : 'bg-gray-50 border-transparent text-gray-500'}`} 
                    />
                </div>
            </div>

            <hr className="border-gray-100 my-4" />

            {/* Senha (Só editável no modo edição) */}
            <div className="space-y-2 mb-8">
                <label className={`text-xs font-bold uppercase tracking-wide ml-1 ${isEditing ? 'text-red-400' : 'text-gray-400'}`}>
                    Alterar Senha {isEditing ? "" : "(Bloqueado)"}
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
        </main>
      </div>
    </div>
  );
};

export default ProfilePage;