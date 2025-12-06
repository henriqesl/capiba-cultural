import React, { useState } from 'react';
import { ArrowLeft, Calendar, MapPin, Type, Link as LinkIcon } from 'lucide-react';

const CreateCaravanaPage = ({ onBack, onCreate }) => {
  const [formData, setFormData] = useState({
    nome: '',
    evento: '',
    data: '',
    local: '',
    link: ''
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.nome || !formData.evento) {
      alert("Por favor, preencha o nome do grupo e o evento.");
      return;
    }
    // Chama a função do App.js para salvar
    onCreate(formData);
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
          {/* Nome */}
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

          {/* Evento */}
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-1">Qual é o evento?</label>
            <input 
              name="evento"
              value={formData.evento}
              onChange={handleChange}
              placeholder="Ex: Show do Coldplay"
              className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Data */}
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-1">Data</label>
            <div className="relative">
              <Calendar className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
              <input 
                name="data"
                type="date"
                value={formData.data}
                onChange={handleChange}
                className="w-full pl-10 p-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          {/* Local */}
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-1">Local</label>
            <div className="relative">
              <MapPin className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
              <input 
                name="local"
                value={formData.local}
                onChange={handleChange}
                placeholder="Ex: Metrô Barra Funda"
                className="w-full pl-10 p-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>


          <div className="pt-4">
            <button 
              type="submit"
              className="w-full bg-blue-600 text-white font-bold py-4 rounded-xl shadow-lg hover:bg-blue-700 transition-colors"
            >
              Criar e Ir para Lista
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateCaravanaPage;