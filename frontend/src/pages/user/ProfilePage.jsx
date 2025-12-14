import React, { useState, useEffect, useContext, useRef } from 'react';
import { PerfilImage } from '../../components/user/UserShared.jsx'; 
import { ArrowLeft, Camera, User, Save, Lock, Mail, FileText } from 'lucide-react';
import { AuthContext } from '../../context/AuthContext';
import api from '../../services/api';

const ProfilePage = () => {
  const { user } = useContext(AuthContext);
  const [loading, setLoading] = useState(false);
  const fileInputRef = useRef(null);

  const [formData, setFormData] = useState({
    nome: '',
    email: '',
    cpf: '',
    senha: '' 
  });

  const [previewUrl, setPreviewUrl] = useState(null);
  const [fileToSend, setFileToSend] = useState(null);
  
  const BASE_URL = 'http://localhost:3000/'; 

  useEffect(() => {
    if (user?.id) {
        api.get(`/usuarios/${user.id}`).then(res => {
            setFormData(prev => ({
                ...prev,
                nome: res.data.nome || '',
                email: res.data.email || '',
                cpf: res.data.cpf || '',
            }));

            if (res.data.fotoUrl) {
                const pathFixed = res.data.fotoUrl.replace(/\\/g, '/');
                setPreviewUrl(`${BASE_URL}${pathFixed}`);
            }
        });
    }
  }, [user]);

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

  const handleSave = async () => {
    setLoading(true);
    try {
        const data = new FormData();
        
        if (formData.nome) data.append('nome', formData.nome);
        if (formData.email) data.append('email', formData.email);
        if (formData.cpf) data.append('cpf', formData.cpf);
        if (formData.senha) data.append('senha', formData.senha);
        if (fileToSend) data.append('foto', fileToSend);

        await api.put(`/usuarios/${user.id}`, data);
        
        alert("Perfil atualizado com sucesso!");
    } catch (error) {
        console.error("Erro no update:", error);
        alert("Erro ao atualizar perfil. Verifique os dados.");
    } finally {
        setLoading(false);
    }
  };

  return (
    <div className="w-full min-h-screen bg-gray-50 flex flex-col items-center py-6">
      <div className="w-[95%] max-w-5xl bg-white rounded-3xl shadow-xl overflow-hidden flex flex-col md:flex-row min-h-[600px]">
        
        {/* === COLUNA ESQUERDA (Foto e Identidade) === */}
        <aside className="md:w-1/3 bg-blue-600 text-white p-8 flex flex-col items-center text-center relative">
          <a href="#/perfil" className="absolute top-6 left-6 p-2 bg-white/20 rounded-full hover:bg-white/30 transition">
             <ArrowLeft className="w-6 h-6" />
          </a>

          <div className="mt-12 mb-6 relative group cursor-pointer" onClick={() => fileInputRef.current.click()}>
            <div className="rounded-full p-1 bg-white/30 backdrop-blur-md">
                <PerfilImage src={previewUrl} className="w-40 h-40 rounded-full object-cover border-4 border-white shadow-2xl" />
            </div>
            <div className="absolute bottom-2 right-2 bg-yellow-400 text-blue-900 p-2 rounded-full shadow-lg hover:scale-110 transition-transform">
                <Camera className="w-5 h-5" />
            </div>
            <input type="file" ref={fileInputRef} onChange={handleFileChange} accept="image/*" className="hidden" />
          </div>

          <h2 className="text-2xl font-bold">{formData.nome || "Usuário"}</h2>
          <p className="text-blue-200 text-sm mt-1">{formData.email}</p>
          
          <div className="mt-auto w-full pt-8">
            <p className="text-xs text-blue-200 mb-4 uppercase tracking-widest opacity-70">Ações</p>
            <button 
                onClick={handleSave}
                disabled={loading}
                className="w-full py-4 bg-white text-blue-600 font-bold rounded-xl shadow-lg hover:bg-gray-100 active:scale-95 transition-all flex items-center justify-center gap-2"
            >
                {loading ? "Salvando..." : (
                    <>
                        <Save className="w-5 h-5" /> Salvar Alterações
                    </>
                )}
            </button>
          </div>
        </aside>

        {/* === COLUNA DIREITA (Formulário) === */}
        <main className="flex-1 p-8 md:p-12 bg-white">
          <div className="flex items-center gap-3 mb-8">
            <div className="p-3 bg-blue-50 text-blue-600 rounded-xl">
                <User className="w-6 h-6" />
            </div>
            <div>
                <h1 className="text-2xl font-bold text-gray-800">Dados Pessoais</h1>
                <p className="text-gray-400 text-sm">Atualize suas informações básicas</p>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-6 max-w-2xl">
            {/* Nome */}
            <div className="space-y-2">
                <label className="text-xs font-bold text-gray-400 uppercase tracking-wide ml-1">Nome Completo</label>
                <div className="flex items-center bg-gray-50 rounded-xl px-4 py-3 border border-transparent focus-within:border-blue-500 focus-within:bg-white transition-all">
                    <User className="w-5 h-5 text-gray-400 mr-3" />
                    <input 
                        name="nome"
                        value={formData.nome}
                        onChange={handleChange}
                        className="bg-transparent w-full outline-none text-gray-700 font-medium placeholder-gray-300"
                        placeholder="Seu nome"
                    />
                </div>
            </div>

            {/* Email & CPF */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                    <label className="text-xs font-bold text-gray-400 uppercase tracking-wide ml-1">Email</label>
                    <div className="flex items-center bg-gray-100 rounded-xl px-4 py-3 border border-gray-200 cursor-not-allowed opacity-70">
                        <Mail className="w-5 h-5 text-gray-400 mr-3" />
                        <input 
                            name="email"
                            value={formData.email}
                            readOnly
                            className="bg-transparent w-full outline-none text-gray-500 font-medium"
                        />
                    </div>
                </div>

                <div className="space-y-2">
                    <label className="text-xs font-bold text-gray-400 uppercase tracking-wide ml-1">CPF</label>
                    <div className="flex items-center bg-gray-50 rounded-xl px-4 py-3 border border-transparent focus-within:border-blue-500 focus-within:bg-white transition-all">
                        <FileText className="w-5 h-5 text-gray-400 mr-3" />
                        <input 
                            name="cpf"
                            value={formData.cpf}
                            onChange={handleChange}
                            className="bg-transparent w-full outline-none text-gray-700 font-medium placeholder-gray-300"
                        />
                    </div>
                </div>
            </div>

            <hr className="border-gray-100 my-2" />

            {/* Senha */}
            <div className="space-y-2">
                <label className="text-xs font-bold text-blue-500 uppercase tracking-wide ml-1">Alterar Senha</label>
                <div className="flex items-center bg-white border-2 border-blue-50 rounded-xl px-4 py-3 focus-within:border-blue-500 transition-all">
                    <Lock className="w-5 h-5 text-blue-300 mr-3" />
                    <input 
                        name="senha"
                        type="password"
                        placeholder="Digite apenas se quiser trocar"
                        value={formData.senha}
                        onChange={handleChange}
                        className="bg-transparent w-full outline-none text-gray-700 font-medium placeholder-gray-300"
                    />
                </div>
                <p className="text-xs text-gray-400 ml-1">Deixe em branco para manter a senha atual.</p>
            </div>

          </div>
        </main>
      </div>
    </div>
  );
};

export default ProfilePage;