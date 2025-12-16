import React, { useState, useEffect } from 'react';
import { ArrowLeft, Calendar, MapPin, Copy, Check, Crown, UserCircle2, Edit2 } from 'lucide-react';
import api from '../../services/api';
import { useAuth } from '../../context/AuthContext';

const CaravanaDetailsPage = ({ onBack }) => {
  const { user } = useAuth();
  const [caravana, setCaravana] = useState(null);
  const [loading, setLoading] = useState(true);
  const [copied, setCopied] = useState(false);
  const [editing, setEditing] = useState(false);
  const [newFoto, setNewFoto] = useState(null);

  // Extrai o ID do hash da URL
  const getCaravanaIdFromHash = () => {
    const hash = window.location.hash; // ex: "#/perfil/caravana/detalhes/3"
    const parts = hash.split('/');
    return parts[parts.length - 1]; // pega o último pedaço
  };

  const caravanaId = getCaravanaIdFromHash();

  // Busca caravana
  useEffect(() => {
    const fetchCaravana = async () => {
      try {
        setLoading(true);
        const response = await api.get(`/caravanas/${caravanaId}`);
        setCaravana(response.data);
      } catch (error) {
        console.error("Erro ao buscar caravana:", error);
      } finally {
        setLoading(false);
      }
    };

    if (caravanaId) fetchCaravana();
  }, [caravanaId]);

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

  // Usuário atual
  const currentUser = {
    id: user.id,
    nome: user.nome || "Você",
    isOwner
  };

  // Lista de membros sem duplicar o dono
  const listaMembros = (caravana.membros || []).filter(
    (m) => String(m.id) !== String(user.id)
  );

  const handleCopyLink = () => {
    const link = `https://caravana.app/${caravana.nome.toLowerCase().replace(/\s+/g, '-')}`;
    navigator.clipboard.writeText(link);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // Upload de foto (apenas dono)
  const handleFotoChange = (e) => {
    setNewFoto(e.target.files[0]);
  };

  const handleSalvarFoto = async () => {
    if (!newFoto) return;
    try {
      const formData = new FormData();
      formData.append('foto', newFoto);

      const response = await api.post(`/caravanas/${caravanaId}/foto`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });

      setCaravana(response.data); // atualiza caravana com nova foto
      setEditing(false);
    } catch (error) {
      console.error("Erro ao atualizar foto da caravana:", error);
      alert("Falha ao atualizar foto.");
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
                onClick={() => setEditing(!editing)}
              />
            )}
          </div>
        </header>

        <main className="p-6 flex flex-col gap-6">
          
          {/* Info Principal */}
          <section>
            <h2 className="text-2xl font-bold text-blue-600 mb-1">{caravana.nome}</h2>
            <p className="text-gray-700 font-medium mb-4">{caravana.evento?.nome}</p>
            
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

            {editing && isOwner && (
              <div className="mt-4 flex flex-col gap-2">
                <input type="file" onChange={handleFotoChange} />
                <button
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg"
                  onClick={handleSalvarFoto}
                >
                  Salvar Foto
                </button>
              </div>
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
                      {m.fotoUrl ? (
                        <img src={m.fotoUrl} alt={m.nome} className="w-full h-full object-cover" />
                      ) : (
                        <UserCircle2 className="w-6 h-6 text-gray-500" />
                      )}
                    </div>
                    <div>
                      <p className="text-sm font-bold text-gray-800 flex items-center gap-1">
                        {m.nome}
                        {m.isOwner && <Crown className="w-3 h-3 text-yellow-500 fill-yellow-500" />}
                      </p>
                      {m.isOwner && <p className="text-xs text-blue-600 font-semibold">Organizador</p>}
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
