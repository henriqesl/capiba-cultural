import React, { useState, useEffect, useCallback } from 'react';
import { ArrowLeft, Calendar, MapPin, Copy, Check, Crown, UserCircle2, Edit2, Camera } from 'lucide-react';
import api from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import DefaultCaravanaImage from '../../assets/caravana_padrao.png'; 

const CaravanaDetailsPage = ({ onBack }) => {
  const { user } = useAuth();
  const [caravana, setCaravana] = useState(null);
  const [loading, setLoading] = useState(true);
  const [copied, setCopied] = useState(false);
  const [editing, setEditing] = useState(false);
  const [newFoto, setNewFoto] = useState(null);
  const [newDescription, setNewDescription] = useState('');

  const BASE_URL_BACKEND = 'http://localhost:3000';

  // Extrai o ID do hash da URL
  const getCaravanaIdFromHash = () => {
    const hash = window.location.hash;
    const parts = hash.split('/');
    return parts[parts.length - 1];
  };

  const caravanaId = getCaravanaIdFromHash();

  // 🔄 Função de Busca para Recarregar Dados (Inspirado no UserPage)
  const fetchCaravana = useCallback(async () => {
    if (!caravanaId) {
        setLoading(false);
        return;
    }
    try {
      // Note: A linha abaixo define loading como true, que é bom para recarga visual
      // mas se estiver sendo chamada DENTRO de handleSalvarFoto, pode ser rápido demais.
      // Manteremos aqui para a busca inicial.
      // setLoading(true); 
      const response = await api.get(`/caravanas/${caravanaId}`);
      setCaravana(response.data);
    } catch (error) {
      console.error("Erro ao buscar caravana:", error);
      // Se der erro na busca, garantimos que o estado é limpo ou permanece.
      // Aqui, vamos deixar o erro ser tratado pelo catch principal se for a busca inicial.
      throw error; // Propaga o erro para o bloco catch de quem a chamou (ex: handleSalvarFoto)
    } finally {
      setLoading(false);
    }
  }, [caravanaId]);

  // 🚀 Chamada Inicial de Dados
  useEffect(() => {
    fetchCaravana();
  }, [fetchCaravana]);

const fotoPreviewUrl = newFoto 
  ? URL.createObjectURL(newFoto) // Preview local do arquivo novo
  : caravana?.imagemUrl // Se a URL existir no objeto da caravana
    ? `${BASE_URL_BACKEND}/${caravana.imagemUrl}?t=${Date.now()}` // 🟢 CORREÇÃO CRÍTICA AQUI!
    : DefaultCaravanaImage;


  if (loading) {
    return (
      <div className="w-full min-h-screen flex items-center justify-center">
        <p>Carregando detalhes da caravana...</p>
      </div>
    );
  }

  if (!caravana) {
    return <div className="p-8 text-center">Caravana não encontrada.</div>;
  }

  // Define se o usuário atual é o dono
  const isOwner = String(caravana.criadorId) === String(user.id);

  // Usuário atual e lista de membros
  const currentUser = {
    id: user.id,
    nome: user.nome || "Você",
    isOwner: isOwner 
  };
  const listaMembros = (caravana.membros || []).filter(
    (m) => String(m.id) !== String(user.id)
  );

  const handleCopyLink = () => {
    const link = `https://caravana.app/${caravana.nome.toLowerCase().replace(/\s+/g, '-')}`;
    navigator.clipboard.writeText(link);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // 💾 LÓGICA DE UPLOAD CORRIGIDA COM RECARGA SEGURA
  const handleSalvarFoto = async () => {
    if (!newFoto || !isOwner) return;

    const currentCaravanaData = caravana; 

    try {
      const formData = new FormData();
      formData.append('foto', newFoto);

      // 1. Tenta fazer o PUT do arquivo (Atualiza no DB e salva o arquivo)
      await api.put(`/caravanas/${caravanaId}`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });

      // 2. Limpa o preview local
      setNewFoto(null);
      setEditing(false);
      
      // 3. Tenta recarregar os dados (tratamento de erro para evitar dados sumidos)
      try {
          // Garante que o estado de loading é visível durante a recarga
          await fetchCaravana(); 
          alert("Foto atualizada com sucesso!");
      } catch (reloadError) {
          console.error("Erro ao recarregar dados após upload:", reloadError);
          // Se a recarga falhar (e os dados sumirem), restaura o estado anterior
          setCaravana(currentCaravanaData);
          alert("Foto atualizada, mas houve falha ao recarregar os detalhes. Tente um Hard Refresh (Ctrl+Shift+R).");
      }


    } catch (uploadError) {
        // Se o PUT original falhar (400, 500, etc.)
        console.error("Erro no upload da foto:", uploadError);
        alert("Falha no upload da foto. Verifique o servidor.");
    }
  };

  // Lógica para salvar os detalhes de texto (descrição)
  const handleSaveDetails = async () => {
    if (!isOwner) return;
    
    if (newDescription === (caravana.descricao || '')) {
        setEditing(false);
        return;
    }

    try {
      const response = await api.patch(`/caravanas/${caravanaId}`, {
        descricao: newDescription,
      });

      setCaravana(response.data);
      setEditing(false);
      alert("Descrição atualizada com sucesso!");
    } catch (error) {
      console.error("Erro ao atualizar descrição da caravana:", error);
      alert("Falha ao atualizar descrição.");
    }
  };

  return (
    <div className="w-full min-h-screen bg-gray-50 flex flex-col items-center pb-20">
      <div className="w-full max-w-md bg-white min-h-screen md:min-h-fit md:rounded-2xl md:shadow-xl md:my-8 flex flex-col">
        
        {/* Header */}
        <header className="bg-white p-4 flex items-center border-b border-gray-100 sticky top-0 z-10 justify-between">
          <button onClick={onBack} className="p-2 -ml-2 hover:bg-gray-100 rounded-full text-gray-600">
            <ArrowLeft className="w-6 h-6" />
          </button>
          <div className="flex items-center gap-2">
            <h1 className="text-lg font-bold text-gray-800">Detalhes do Grupo</h1>
            {isOwner && (
              <Edit2
                className="w-5 h-5 text-blue-600 cursor-pointer"
                onClick={() => {
                  const newEditingState = !editing;
                  setEditing(newEditingState);
                  setNewFoto(null); 
                  if (newEditingState) {
                    setNewDescription(caravana.descricao || '');
                  }
                }}
              />
            )}
          </div>
        </header>

        {/* Seção de Foto Centralizada */}
        <section className="p-6 pb-0 flex flex-col items-center">
          <div className="relative w-32 h-32 rounded-full overflow-hidden bg-gray-200 flex items-center justify-center border-4 border-white shadow-lg">
            {fotoPreviewUrl ? (
              <img src={fotoPreviewUrl} alt={caravana.nome} className="w-full h-full object-cover" />
            ) : (
              <UserCircle2 className="w-20 h-20 text-gray-500" />
            )}

            {/* Overlay para edição de foto */}
            {isOwner && editing && (
              <label 
                htmlFor="foto-input" 
                className="absolute inset-0 flex flex-col items-center justify-center bg-black bg-opacity-50 text-white cursor-pointer transition-opacity hover:opacity-100"
              >
                <Camera className="w-6 h-6 mb-1" />
                <span className="text-xs font-semibold">Mudar Foto</span>
              </label>
            )}

            {/* Input de Arquivo (Escondido) */}
            {isOwner && (
                <input 
                    id="foto-input"
                    type="file" 
                    onChange={(e) => setNewFoto(e.target.files[0])}
                    className="hidden" 
                    accept="image/*"
                />
            )}
          </div>
          
          {/* Botões de Salvar/Cancelar Foto */}
          {editing && isOwner && newFoto && (
            <div className="mt-4 flex gap-2">
                <button
                    className="px-4 py-2 bg-green-500 text-white text-sm font-semibold rounded-lg hover:bg-green-600"
                    onClick={handleSalvarFoto}
                >
                    Salvar Foto
                </button>
                <button
                    className="px-4 py-2 bg-gray-300 text-gray-800 text-sm font-semibold rounded-lg hover:bg-gray-400"
                    onClick={() => setNewFoto(null)}
                >
                    Cancelar
                </button>
            </div>
          )}
        </section>

        <main className="p-6 pt-4 flex flex-col gap-6"> 
          
          {/* Info Principal: Nome, Evento e Infos de Data/Local */}
          <section>
            <div className='text-center'>
                <h2 className="text-2xl font-bold text-blue-600 mb-1">{caravana.nome}</h2>
                <p className="text-gray-700 font-medium mb-4">{caravana.evento?.nome}</p>
            </div>
            
            <div className="space-y-3 bg-blue-50 p-4 rounded-xl border border-blue-100">
              <div className="flex items-center gap-3 text-gray-600 text-sm">
                <Calendar className="w-5 h-5 text-blue-500" />
                <span>{caravana.evento?.data ? new Date(caravana.evento.data).toLocaleDateString() : "--/--"} • {caravana.evento?.horario || "19:00"}</span>
              </div>
              <div className="flex items-center gap-3 text-gray-600 text-sm">
                <MapPin className="w-5 h-5 text-blue-500" />
                <span>{caravana.evento?.local || "Local não definido"}</span>
              </div>
            </div>
          </section>

          {/* Seção de Descrição (Editável pelo líder) */}
          <section className="border-t border-gray-100 pt-6">
            <h3 className="text-lg font-bold text-gray-800 mb-2">Descrição da Caravana</h3>
            
            {editing && isOwner ? (
              <div className='flex flex-col'>
                <textarea
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                  rows="4"
                  value={newDescription}
                  onChange={(e) => setNewDescription(e.target.value)}
                  placeholder="Adicione uma descrição para o seu grupo..."
                />
                {/* Botão de salvar detalhes (só aparece no modo de edição e se não estiver salvando foto) */}
                {!newFoto && (
                    <button
                      className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 disabled:bg-gray-400"
                      onClick={handleSaveDetails}
                      disabled={newDescription === (caravana.descricao || '')}
                    >
                      Salvar Descrição
                    </button>
                )}
              </div>
            ) : (
              // Exibe a descrição formatada
              <p className="text-gray-600 whitespace-pre-wrap">
                {caravana.descricao || "Nenhuma descrição adicionada para este grupo."}
              </p>
            )}
          </section>

          {/* Compartilhar */}
          <section className="border-t border-gray-100 pt-6">
            <h3 className="text-sm font-bold text-gray-500 uppercase tracking-wider mb-3">Convidar amigos</h3>
            <div className="flex gap-2">
              <div className="grow bg-gray-100 p-3 rounded-lg text-sm text-gray-600 font-mono truncate border border-gray-200">
                {`https://caravana.app/${caravana.nome.toLowerCase().replace(/\s+/g, '-')}`}
              </div>
              <button 
                onClick={handleCopyLink}
                className={`px-4 rounded-lg font-medium transition-colors flex items-center justify-center ${copied ? 'bg-green-500 text-white' : 'bg-blue-600 text-white hover:bg-blue-700'}`}
              >
                {copied ? <Check className="w-5 h-5" /> : <Copy className="w-5 h-5" />}
              </button>
            </div>
          </section>

          {/* Lista de Membros */}
          <section className="border-t border-gray-100 pt-6">
            <div className="flex justify-between items-end mb-4">
              <h3 className="text-lg font-bold text-gray-800">Quem vai</h3>
              <span className="text-sm text-gray-500">{listaMembros.length + 1} pessoas</span>
            </div>

            <div className="space-y-3">
              {[currentUser, ...listaMembros].map((m) => (
                <div key={m.id} className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center overflow-hidden">
                      {m.imagemUrl ? (
                        <img src={m.imagemUrl} alt={m.nome} className="w-full h-full object-cover" />
                      ) : (
                        <UserCircle2 className="w-6 h-6 text-gray-500" />
                      )}
                    </div>
                    <div>
                      <p className="text-sm font-bold text-gray-800 flex items-center gap-1">
                        {m.nome}
                        {(m.isOwner || (String(caravana.criadorId) === String(m.id))) && <Crown className="w-3 h-3 text-yellow-500 fill-yellow-500" />}
                      </p>
                      {(m.isOwner || (String(caravana.criadorId) === String(m.id))) && <p className="text-xs text-blue-600 font-semibold">Organizador</p>}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>
        </main>
      </div>
    </div>
  );
};

export default CaravanaDetailsPage;