import React, { useState, useEffect, useCallback, useRef } from 'react';
// 🔑 Importamos o contexto para acessar o ID do usuário e a função de logout
import { useAuth } from '../../context/AuthContext'; 
import api from '../../services/api'; 
// Componentes
// IMPORTANTE: Adicionado o useRef para o input de arquivo e o Save para o botão
import { InfoRow, PerfilImage } from '../../components/user/UserShared.jsx'; 
import { Save } from 'lucide-react'; // Adicionado Save para o botão de salvar

// Ícones
import { ArrowLeft, Camera, User, LogOut, Phone, Calendar, Mail, Edit } from 'lucide-react';

// 🔑 DEFINIÇÕES GLOBAIS (Verifique se sua porta de backend é 3000)
const BASE_URL = 'http://localhost:3000'; 
const DEFAULT_PROFILE_PIC = '/images/profile-placeholder.png'; // AJUSTE ESTE CAMINHO SE NECESSÁRIO

// 🔑 Funções de Formatação (Recomendado fora do componente)
const formatarTelefone = (tel) => {
    if (!tel) return 'N/A';
    tel = String(tel).replace(/\D/g, ''); 
    if (tel.length >= 10) { 
        return `(${tel.substring(0, 2)}) ${tel.substring(2, tel.length - 4)}-${tel.substring(tel.length - 4)}`;
    }
    return tel;
};

const formatarData = (dataISO) => {
    if (!dataISO) return 'N/A';
    const data = new Date(dataISO);
    return data.toLocaleDateString('pt-BR'); 
};


const ProfilePage = () => {
    const { user: userContext, logout } = useAuth(); 
    // Usado para a foto de perfil
    const fileInputRef = useRef(null); 
    
    // ESTADOS:
    const [userData, setUserData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [isEditing, setIsEditing] = useState(false);
    const [editFields, setEditFields] = useState({}); 
    // Estado para o arquivo de foto a ser enviado e URL de preview
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
            setUserData(data);
            setEditFields(data); 

            // Configura a URL da foto de perfil
            const imagemRelativa = data?.imagemUrl || data?.fotoUrl; // Verifique qual campo o backend retorna
            const fullUrl = imagemRelativa 
                ? `${BASE_URL}/${imagemRelativa.replace(/\\/g, '/')}`
                : DEFAULT_PROFILE_PIC;
            setPreviewUrl(fullUrl);
            
        } catch (error) {
            console.error("Erro ao carregar dados do perfil:", error);
        } finally {
            setLoading(false);
        }
    }, [userContext]);

    useEffect(() => {
        fetchUserData();
    }, [fetchUserData]);
    
    
    // Handler de Edição/Salvar (ÚNICA DEFINIÇÃO CORRETA)
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
            // Campos de texto
            formData.append('nome', editFields.nome);
            formData.append('username', editFields.username);
            formData.append('telefone', editFields.telefone.replace(/\D/g, ''));
            // Adicione outros campos editáveis aqui (ex: dataNascimento)
            if (editFields.dataNascimento) {
                formData.append('dataNascimento', editFields.dataNascimento);
            }
            // Foto de perfil
            if (fileToSend) {
                formData.append('foto', fileToSend); // 'foto' deve ser o nome esperado pelo backend
            }

            // A requisição de edição usa PATCH e pode enviar FormData ou JSON, dependendo do backend
            await api.patch(`/usuarios/${userContext.id}`, formData); 
            
            alert("Perfil atualizado com sucesso!");
            setIsEditing(false); // Sai do modo de edição
            setFileToSend(null); // Limpa o arquivo após o envio
            await fetchUserData(); // Recarrega os dados
        } catch (error) {
            console.error("Erro ao salvar perfil:", error);
            alert(`Erro ao salvar: ${error.response?.data?.erro || 'Tente novamente.'}`);
        } finally {
            setLoading(false);
        }
    };
    
    
    // Componente de Linha Editável
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
                    
                    {/* Esquerda: foto e botão salvar */}
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
                            {/* Passamos o previewUrl para o componente mostrar a foto atual/nova */}
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
                        

                        <h2 className="text-2xl font-bold text-gray-800 mt-2">{userData?.nome || "Usuário"}</h2>
                        <p className="text-sm text-gray-500 font-medium">{userData?.email}</p>
                        
                        {/* Botão de Salvar/Editar Desktop (Movido para o Header Desktop) */}
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

                    {/* Direita: formulário (Informações) */}
                    <div className="md:col-span-8">
                        <section>
                            <h2 className="text-lg font-bold text-gray-700 mb-6 flex items-center">
                                <span className="bg-blue-100 text-blue-600 p-2 rounded-lg mr-3">
                                    <User className="w-5 h-5"/> 
                                </span>
                                Informações Pessoais
                            </h2>
                            
                            <div className="space-y-4">
                                
                                {/* CAMPO NOME (Editável) */}
                                <EditableInfoRow 
                                    label="Nome Completo" 
                                    name="nome" 
                                    value={editFields?.nome || userData?.nome}
                                    icon={User}
                                />
                                
                                {/* CAMPO EMAIL (ReadOnly) */}
                                <EditableInfoRow 
                                    label="Email" 
                                    name="email" 
                                    value={userData?.email}
                                    type="email"
                                    readOnly={true} 
                                    icon={Mail}
                                />
                                
                                {/* Username (Editável) */}
                                <EditableInfoRow 
                                    label="Username" 
                                    name="username" 
                                    value={editFields?.username}
                                    icon={User}
                                />
                                
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    {/* CAMPO TELEFONE */}
                                    <EditableInfoRow 
                                        label="Telefone" 
                                        name="telefone" 
                                        value={isEditing ? editFields?.telefone : formatarTelefone(userData?.telefone)}
                                        type="tel"
                                        icon={Phone}
                                    />
                                    {/* Senha (ReadOnly, com placeholder para edição) */}
                                    <EditableInfoRow
                                        label="Nova Senha"
                                        name="senha"
                                        value={editFields.senha || ''}
                                        type="password"
                                        icon={Mail}
                                    />
                                </div>
                                
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    {/* CAMPO DATA DE NASCIMENTO */}
                                    <EditableInfoRow 
                                        label="Data de Nasc." 
                                        name="dataNascimento" 
                                        value={isEditing 
                                            ? editFields?.dataNascimento?.split('T')[0] // Se for editar, mostra no formato YYYY-MM-DD
                                            : formatarData(userData?.dataNascimento)}
                                        type={isEditing ? "date" : "text"} 
                                        icon={Calendar}
                                    />
                                    {/* CAMPO CPF (ReadOnly) */}
                                    <EditableInfoRow label="CPF" value={userData?.cpf || 'N/A'} readOnly={true} />
                                </div>
                                
                                {/* Outras Informações (Endereço, etc.) - Mantido como InfoRow simples, assumindo não editável aqui */}
                                <div className="pt-4 mt-4 border-t border-gray-100">
                                    <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-4">Outras Informações</h3>
                                    {/* Estes campos estão hardcoded no seu código, eles deveriam vir de userData se fossem reais */}
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <InfoRow label="CEP" value="52091-235" />
                                        <InfoRow label="Bairro" value="Nova Descoberta" />
                                        <InfoRow label="Rua" value="Rua Alto Santa Luzia" />
                                        <InfoRow label="Número" value="460" />
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