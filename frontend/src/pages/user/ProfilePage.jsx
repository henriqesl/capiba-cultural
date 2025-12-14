import React, { useState, useEffect, useCallback, useRef } from 'react';
// 🔑 Importamos o contexto para acessar o ID do usuário e a função de logout
import { useAuth } from '../../context/AuthContext';
import api from '../../services/api'; 
// Componentes
import { InfoRow, PerfilImage } from '../../components/user/UserShared.jsx'; 

// Ícones
import { ArrowLeft, Camera, User, LogOut, Mail, Edit, Shield, Lock } from 'lucide-react'; // Lock adicionado para Senha

// 🔑 DEFINIÇÕES GLOBAIS (Verifique se sua porta de backend é 3000)
const BASE_URL = 'http://localhost:3000'; 
const DEFAULT_PROFILE_PIC = '/images/profile-placeholder.png'; // AJUSTE ESTE CAMINHO SE NECESSÁRIO

// Removidas as funções de formatação não utilizadas

const ProfilePage = () => {
    const { user: userContext, logout } = useAuth(); 
    const fileInputRef = useRef(null); 
    
    // ESTADOS:
    const [userData, setUserData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [isEditing, setIsEditing] = useState(false);
    // Inicializamos a senha como vazia para evitar que seja enviada se não for alterada
    const [editFields, setEditFields] = useState({ nome: '', senha: '' }); 
    const [fileToSend, setFileToSend] = useState(null); 
    const [previewUrl, setPreviewUrl] = useState(DEFAULT_PROFILE_PIC); 
    
    // LÓGICA DE BUSCA DE DADOS
    const fetchUserData = useCallback(async () => {
        if (!userContext?.id) {
            setLoading(false);
            return;
        }
        try {
            const response = await api.get(`/usuarios/${userContext.id}`);
            const data = response.data;

            if (data?.senha) {
                delete data.senha;
            }
            setUserData(data);
            
            // Inicializamos o editFields com o nome atual, e a senha vazia
            setEditFields({ nome: data?.nome || '', senha: '' }); 

          const imageUrl = data?.fotoUrl || DEFAULT_PROFILE_PIC;
            setPreviewUrl(imageUrl);

        } catch (error) {
            console.error("Erro ao carregar dados do perfil:", error);
        } finally {
            setLoading(false);
        }
    }, [userContext]);

    useEffect(() => {
        fetchUserData();
    }, [fetchUserData]);
    
    
    // Handler de Edição/Salvar
    const handleChange = (e) => {
        setEditFields({ ...editFields, [e.target.name]: e.target.value });
    };

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setFileToSend(file);
            setPreviewUrl(URL.createObjectURL(file)); // cria URL temporária
        }
    };

    const handleSave = async () => {
        setLoading(true);
        try {
            const formData = new FormData();
            
            // Adiciona Nome
            formData.append('nome', editFields.nome);
            
            // Adiciona Senha SOMENTE se o campo for preenchido
            if (editFields.senha) {
                formData.append('senha', editFields.senha);
            }

            // Adiciona Foto de perfil
            if (fileToSend) {
                formData.append('foto', fileToSend); 
            }

            await api.patch(`/usuarios/${userContext.id}`, formData); 
            
            alert("Perfil atualizado com sucesso!");
            setIsEditing(false); // Sai do modo de edição
            setFileToSend(null); // Limpa o arquivo após o envio
            // Limpa o campo de senha após salvar, mesmo se falhar, por segurança
            setEditFields(prev => ({ ...prev, senha: '' }));
            await fetchUserData(); // Recarrega os dados
        } catch (error) {
            console.error("Erro ao salvar perfil:", error);
            alert(`Erro ao salvar: ${error.response?.data?.erro || 'Tente novamente.'}`);
        } finally {
            setLoading(false);
        }
    };
    
    
    // Componente de Linha Editável SIMPLIFICADO
    const EditableInfoRow = ({ label, name, value, type = 'text', readOnly = false, icon: IconComponent }) => (
        <div className="flex flex-col border-b border-gray-100 py-3">
            <label className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1 flex items-center gap-2">
                {IconComponent && <IconComponent className="w-4 h-4" />}
                {label}
            </label>
            {isEditing && !readOnly ? (
                <input
                    type={type}
                    name={name}
                    value={value || ''}
                    onChange={handleChange}
                    className="mt-1 p-1 border-b-2 border-blue-200 focus:border-blue-600 transition duration-150 outline-none text-gray-800"
                />
            ) : (
                <p className="text-gray-800 font-medium">{value}</p>
            )}
        </div>
    );

    return (
        <div className="w-full min-h-screen bg-gray-100 flex flex-col items-center py-4">
            <div className="w-[95%] max-w-md md:max-w-5xl bg-white md:rounded-2xl md:shadow-xl overflow-hidden flex flex-col">
                
                {/* Header Mobile - Mantido na posição correta */}
                <header className="bg-blue-600 text-white p-4 flex justify-between items-center md:hidden">
                    <a href="#/perfil"><ArrowLeft className="w-6 h-6" /></a>
                    <h1 className="text-xl font-bold">{isEditing ? 'EDITAR PERFIL' : 'MEU PERFIL'}</h1>
                    <button 
                        onClick={isEditing ? handleSave : () => setIsEditing(true)}
                        className={`text-sm font-semibold py-1 px-3 rounded-full transition-colors ${isEditing ? 'bg-yellow-400 text-gray-900' : 'bg-blue-500 hover:bg-blue-400'}`}
                        disabled={loading}
                    >
                        {loading ? '...' : (isEditing ? 'SALVAR' : <Edit className="w-5 h-5" />)}
                    </button>
                </header>
                
                {/* Header Desktop */}
                <header className="hidden md:flex p-6 items-center justify-between border-b border-gray-200 bg-gray-50">
                    <div className="flex items-center">
                        <a href="#/perfil" className="text-gray-600 hover:text-blue-600 transition-colors p-2 rounded-full hover:bg-gray-100">
                            <ArrowLeft className="w-6 h-6" />
                        </a>
                        <h1 className="text-xl font-bold text-gray-800 ml-4">{isEditing ? 'Editando Perfil' : 'Meu Perfil'}</h1>
                    </div>
                    
                    <button 
                        onClick={isEditing ? handleSave : () => setIsEditing(true)}
                        className={`text-sm font-semibold py-2 px-4 rounded-lg transition-colors flex items-center gap-2 ${isEditing ? 'bg-yellow-500 text-gray-900 hover:bg-yellow-600' : 'bg-blue-600 text-white hover:bg-blue-700'}`}
                        disabled={loading}
                    >
                        {loading ? 'Salvando...' : (isEditing ? 'Salvar Alterações' : <> <Edit className="w-4 h-4" /> Editar Perfil </>)}
                    </button>
                </header>


                <main className="p-6 pb-24 md:p-8 md:grid md:grid-cols-12 md:gap-8">
                    
                    {/* Esquerda: foto e nome */}
                    <aside className="md:col-span-4 flex flex-col items-center text-center mb-8 md:mb-0 border-b md:border-b-0 md:border-r border-gray-100 md:pr-6">
                        
                        {/* Input Invisível para o Arquivo */}
                        <input 
                            type="file" 
                            ref={fileInputRef} 
                            onChange={handleFileChange} 
                            accept="image/*"
                            className="hidden" 
                            disabled={!isEditing}
                        />

                        {/* Ao clicar na div ou botão, abre o input de arquivo */}
                        <div 
                            className={`relative group mb-4 ${isEditing ? 'cursor-pointer' : ''}`}
                            onClick={() => isEditing && fileInputRef.current.click()}
                        > 
                            <PerfilImage src={previewUrl} />
                            
                            {isEditing && (
                                <button className="absolute -bottom-2 -right-2 bg-blue-600 p-3 rounded-full text-white hover:bg-blue-700 shadow-md border-2 border-white transition-transform hover:scale-110">
                                    <Camera className="w-5 h-5" />
                                </button>
                            )}
                        </div>
                        
                        {isEditing && (
                            <p className="text-xs text-gray-400 mb-4">Toque na foto para alterar</p>
                        )}
                        
                        {/* Exibe o nome atual ou o campo de edição do Nome */}
                        <EditableInfoRow 
                            label="Nome Completo" 
                            name="nome" 
                            value={editFields?.nome || userData?.nome}
                            readOnly={!isEditing}
                            icon={User}
                        />
                        
                        {/* Botão de Logout */}
                        <div className="w-full mt-6 md:mt-8">
                            <button 
                                onClick={logout} 
                                className="w-full text-sm font-semibold text-red-600 bg-red-100 hover:bg-red-200 rounded-lg py-2.5 px-4 transition-colors shadow-sm flex items-center justify-center gap-2"
                            >
                                <LogOut className="w-5 h-5" /> 
                                Sair da Conta
                            </button>
                        </div>
                    </aside>

                    {/* Direita: informações e campo de senha */}
                    <div className="md:col-span-8">
                        <section>
                            <h2 className="text-lg font-bold text-gray-700 mb-6 flex items-center">
                                <span className="bg-blue-100 text-blue-600 p-2 rounded-lg mr-3">
                                    <Shield className="w-5 h-5"/> 
                                </span>
                                Informações de Acesso
                            </h2>
                            
                            <div className="space-y-4">
                                
                                {/* CAMPO EMAIL (ReadOnly) */}
                                <EditableInfoRow 
                                    label="Email (Login)" 
                                    name="email" 
                                    value={userData?.email}
                                    type="email"
                                    readOnly={true} 
                                    icon={Mail}
                                />
                                
                                {/* CAMPO CPF (ReadOnly) */}
                                <EditableInfoRow 
                                    label="CPF" 
                                    value={userData?.cpf || 'N/A'} 
                                    readOnly={true} 
                                    icon={User}
                                />

                                {/* CAMPO NOVA SENHA (RE-INSERIDO E EDITÁVEL) */}
                                {isEditing && (
                                    <EditableInfoRow
                                        label="Nova Senha"
                                        name="senha"
                                        value={editFields.senha || ''}
                                        type="password"
                                        icon={Lock}
                                    />
                                )}
                                
                                {/* Outras Informações (Endereço, etc.) */}
                                <div className="pt-4 mt-4 border-t border-gray-100">
                                    <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-4">Outras Informações (Endereço)</h3>
                                    
                                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                                        <InfoRow label="CEP" value="52091-235" />
                                        <InfoRow label="Bairro" value="Nova Descoberta" />
                                        <InfoRow label="Rua" value="Rua Alto Santa Luzia" />
                                        <InfoRow label="Número" value="460" />
                                        <InfoRow label="Cidade/Estado" value="Recife/PE" />
                                    </div>
                                </div>
                            </div>
                        </section>
                    </div>
                </main>
            </div>
        </div>
    );
};

export default ProfilePage;