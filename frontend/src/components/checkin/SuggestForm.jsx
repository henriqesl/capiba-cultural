import React, { useState } from 'react';
import api from '../../services/api';
import { geocodeLocation } from '../../services/mapbox';
import LocationMap from './LocationMap.jsx';

import { 
    ArrowLeft, Camera, Calendar, Clock, MapPin, 
    Link as LinkIcon, AlignLeft, Upload, Loader2, CalendarPlus 
} from 'lucide-react';

const SuggestForm = ({ onBack }) => {
    const [name, setName] = useState('');
    const [date, setDate] = useState('');
    const [hour, setHour] = useState('');
    const [local, setLocal] = useState('');
    const [link, setLink] = useState('');
    const [obs, setObs] = useState('');
    const [imagePreview, setImagePreview] = useState(null);
    const [imageFile, setImageFile] = useState(null); 
    const [isLoading, setIsLoading] = useState(false); 
    const [isGeocoding, setIsGeocoding] = useState(false); 
    const [coords, setCoords] = useState(null); 
    
    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setImageFile(file); 
            setImagePreview(URL.createObjectURL(file));
        } else {
             setImageFile(null); 
             setImagePreview(null);
        }
    };
    
    const geocodeAndDisplayMap = async () => {
        if (!local) {
            setCoords(null);
            alert("Por favor, insira um local/endereço primeiro.");
            return;
        }
        setIsGeocoding(true);
        setCoords(null); 
        try {
            const result = await geocodeLocation(local);
            if (result) {
                setCoords(result);
            } else {
                alert("Local não encontrado.");
            }
        } catch (error) {
            alert("Erro de conexão ao localizar.");
        } finally {
            setIsGeocoding(false);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);

        try {
            let finalLatitude = coords ? coords.latitude : null;
            let finalLongitude = coords ? coords.longitude : null;
            
            if (!finalLatitude && local) {
                const result = await geocodeLocation(local);
                if (result) {
                    finalLatitude = result.latitude;
                    finalLongitude = result.longitude;
                }
            }
            
            const finalHour = hour || '00:00';
            const dataSemTimezone = `${date}T${finalHour}:00`;
            
            const formData = new FormData();
            formData.append('nome', name);
            formData.append('local', local);
            formData.append('data', dataSemTimezone); 
            formData.append('descricao', `${obs} \n\n Link oficial: ${link}`);
            formData.append('preco', "A definir"); 
            formData.append('faixaEtaria', 0);
            formData.append('precisaInscricao', false);
            formData.append('ativo', false);
            if (finalLatitude !== null) formData.append('latitude', finalLatitude);
            if (finalLongitude !== null) formData.append('longitude', finalLongitude);
            if (imageFile) formData.append('imagemFile', imageFile); 

            await api.post('/eventos', formData);
            alert("Sugestão enviada! Aguarde aprovação.");
            onBack();
        } catch (error) {
            console.error(error);
            alert("Erro ao enviar sugestão.");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="bg-gray-100 min-h-screen w-full flex justify-center py-6 px-4">
            <div className="w-full max-w-2xl bg-white rounded-3xl shadow-xl overflow-hidden flex flex-col animate-fade-in-up">
                <header className="bg-green-600 text-white p-6 flex items-center gap-4">
                    <button onClick={onBack} className="p-2 hover:bg-white/20 rounded-full transition-colors">
                        <ArrowLeft className="w-6 h-6" />
                    </button>
                    <div>
                        <h1 className="text-xl font-bold">Sugerir Evento (Futuro)</h1>
                        <p className="text-green-100 text-sm">Ajude a construir nossa agenda!</p>
                    </div>
                </header>

                <form className="p-6 md:p-8 space-y-6" onSubmit={handleSubmit}>
                    
                    {/* NOME */}
                    <div>
                        <label className="block text-sm font-bold text-gray-700 mb-1">Nome do Evento</label>
                        <input value={name} onChange={e => setName(e.target.value)} type="text" placeholder="Ex: Calourada CIn" className="w-full p-3 border border-gray-300 rounded-lg outline-none" required /> 
                    </div>
                    
                    {/* IMAGEM */}
                    <div>
                        <label className="block text-sm font-bold text-gray-700 mb-2">Imagem de Divulgação (Opcional)</label>
                        <div className="relative w-full h-48 border-2 border-dashed border-green-300 rounded-xl bg-green-50 flex flex-col items-center justify-center overflow-hidden hover:bg-green-100">
                            <input type="file" accept="image/*" onChange={handleImageChange} className="absolute inset-0 opacity-0 cursor-pointer z-20" />
                            {imagePreview ? (
                                <div className="relative w-full h-full">
                                    <img src={imagePreview} alt="Preview" className="w-full h-full object-cover" />
                                    <div className="absolute inset-0 bg-black/30 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity z-10"><p className="text-white font-bold bg-green-600 px-4 py-2 rounded-full flex items-center gap-2"><Camera className="w-5 h-5" /> Trocar</p></div>
                                </div>
                            ) : (
                                <div className="flex flex-col items-center justify-center py-12 text-green-600"><CalendarPlus className="w-10 h-10 mb-2" /><p className="text-lg font-semibold">Anexar arte</p></div>
                            )}
                        </div>
                    </div>

                    {/* DATA/HORA */}
                    <div>
                        <label className="block text-sm font-bold text-gray-700 mb-1">Data</label>
                        <div className="relative">
                            <Calendar className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
                            <input value={date} onChange={e => setDate(e.target.value)} type="date" className="w-full pl-10 p-2.5 border border-gray-300 rounded-lg outline-none" required />
                        </div>
                    </div>
                    <div>
                        <label className="block text-sm font-bold text-gray-700 mb-1">Horário Previsto</label>
                        <div className="relative">
                            <Clock className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
                            <input value={hour} onChange={e => setHour(e.target.value)} type="time" className="w-full pl-10 p-2.5 border border-gray-300 rounded-lg outline-none" /> 
                        </div>
                    </div>
                
                    {/* LOCAL */}
                    <div>
                        <label className="block text-sm font-bold text-gray-700 mb-1">Local</label>
                        <div className="flex gap-2">
                            <input value={local} onChange={e => {setLocal(e.target.value); setCoords(null);}} type="text" placeholder="Local..." className="flex-1 p-2.5 border border-gray-300 rounded-lg outline-none" required />
                            <button type="button" onClick={geocodeAndDisplayMap} disabled={isGeocoding || !local} className="bg-green-600 hover:bg-green-700 text-white px-4 py-2.5 rounded-lg flex items-center gap-1">
                                {isGeocoding ? <Loader2 className="w-5 h-5 animate-spin" /> : <MapPin className="w-5 h-5" />} Verificar
                            </button>
                        </div>
                        {coords && <LocationMap latitude={coords.latitude} longitude={coords.longitude} name={local} />}
                    </div>

                    {/* EXTRAS */}
                    <div>
                        <label className="block text-sm font-bold text-gray-700 mb-1">Link Oficial</label>
                        <div className="relative"><LinkIcon className="absolute left-3 top-3 w-5 h-5 text-gray-400" /><input value={link} onChange={e => setLink(e.target.value)} type="url" className="w-full pl-10 p-2.5 border border-gray-300 rounded-lg outline-none" /></div>
                    </div>
                    <div>
                        <label className="block text-sm font-bold text-gray-700 mb-1">Observações</label>
                        <div className="relative"><AlignLeft className="absolute left-3 top-3 w-5 h-5 text-gray-400" /><textarea value={obs} onChange={e => setObs(e.target.value)} rows="4" className="w-full pl-10 p-2.5 border border-gray-300 rounded-lg outline-none resize-none"></textarea></div>
                    </div>

                    <button type="submit" className={`w-full text-white font-bold py-4 rounded-xl shadow-lg flex items-center justify-center gap-2 ${isLoading ? 'bg-gray-500 cursor-not-allowed' : 'bg-green-600 hover:bg-green-700'}`} disabled={isLoading}>
                        {isLoading ? <><Loader2 className="w-6 h-6 animate-spin" /> Enviando...</> : <><Upload className="w-6 h-6" /> Sugerir Evento</>}
                    </button>
                </form>
            </div>
        </div>
    );
};

export default SuggestForm;