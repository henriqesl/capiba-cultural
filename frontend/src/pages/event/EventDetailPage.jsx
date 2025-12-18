import React, { useEffect, useState } from "react";
import {
  ArrowLeft,
  Calendar,
  MapPin,
  Share2,
  Info,
  Clock,
  Bell,
  CheckCircle,
} from "lucide-react";
import api from "../../services/api";

const getFullImageUrl = (relativePath) => {
  if (!relativePath)
    return "https://images.unsplash.com/photo-1492684223066-81342ee5ff30";
  if (relativePath.startsWith("http")) return relativePath;
  const path = relativePath.startsWith("/") ? relativePath : `/${relativePath}`;
  return `http://localhost:3000${path}`;
};

const EventDetailPage = ({ event, eventId, onBack }) => {
  const handleBack = onBack || (() => (window.location.hash = "#/eventos"));

  const [eventData, setEventData] = useState(event);
  const [loading, setLoading] = useState(!event);
  const [hasReminder, setHasReminder] = useState(false);

  useEffect(() => {
    if (!event && eventId) {
      const fetchEvent = async () => {
        try {
          const response = await api.get(`/eventos/${eventId}`);
          setEventData(response.data);
        } catch (error) {
          console.error("Erro ao carregar evento:", error);
        } finally {
          setLoading(false);
        }
      };
      fetchEvent();
    }
  }, [event, eventId]);

  useEffect(() => {
    if (eventData?.id) {
      const savedReminders = JSON.parse(
        localStorage.getItem("capiba_reminders") || "[]",
      );
      setHasReminder(savedReminders.includes(eventData.id));
    }
  }, [eventData]);

  const toggleReminder = () => {
    if (!eventData?.id) return;
    const savedReminders = JSON.parse(
      localStorage.getItem("capiba_reminders") || "[]",
    );
    let newReminders;

    if (hasReminder) {
      newReminders = savedReminders.filter((id) => id !== eventData.id);
      alert("Lembrete removido.");
    } else {
      newReminders = [...savedReminders, eventData.id];
      if (
        confirm(
          "✅ Lembrete definido!\nDeseja ver sua lista de lembretes agora?",
        )
      ) {
        handleBack();
      }
    }
    localStorage.setItem("capiba_reminders", JSON.stringify(newReminders));
    setHasReminder(!hasReminder);
  };

  if (loading)
    return (
      <div className="flex justify-center items-center h-screen bg-gray-50">
        <div className="text-gray-400 animate-pulse font-medium">
          Carregando detalhes...
        </div>
      </div>
    );

  if (!eventData)
    return (
      <div className="flex justify-center items-center h-screen bg-gray-50">
        <div className="text-red-400 font-medium">Evento não encontrado.</div>
      </div>
    );

  const dataFormatada = eventData.data
    ? new Date(eventData.data).toLocaleDateString("pt-BR", {
        weekday: "long",
        day: "2-digit",
        month: "long",
      })
    : "Data a confirmar";

  const horario =
    eventData.horario ||
    (eventData.data
      ? new Date(eventData.data).toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        })
      : "--:--");

  return (
    <div className="min-h-screen bg-gray-100 md:py-10 flex justify-center items-start">
      <div className="w-full max-w-3xl bg-white md:rounded-3xl shadow-xl overflow-hidden relative min-h-screen md:min-h-fit flex flex-col">
        {}
        <div className="relative h-72 md:h-96 w-full group">
          <img
            src={getFullImageUrl(eventData.imagemUrl)}
            alt={eventData.nome}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-transparent to-transparent opacity-80"></div>

          <button
            onClick={handleBack}
            className="absolute top-4 left-4 p-2.5 bg-white/20 backdrop-blur-md rounded-full text-white hover:bg-white/40 transition-all border border-white/10 shadow-lg"
          >
            <ArrowLeft className="w-6 h-6" />
          </button>

          <span className="absolute top-4 right-4 bg-blue-600/90 backdrop-blur-md text-white text-xs font-bold px-4 py-1.5 rounded-full shadow-lg border border-white/10 uppercase tracking-wider">
            {eventData.categoria || "Evento"}
          </span>
        </div>

        {}
        <div className="flex-1 px-6 py-8 md:px-10 relative">
          <div className="flex justify-between items-start gap-4 mb-6">
            <h1 className="text-2xl md:text-4xl font-extrabold text-gray-900 leading-tight">
              {eventData.nome}
            </h1>
            <button className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-full transition-colors">
              <Share2 className="w-6 h-6" />
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            <div className="flex items-start gap-4 p-4 rounded-2xl bg-blue-50/50 border border-blue-100">
              <div className="bg-white p-2.5 rounded-xl shadow-sm text-blue-600">
                <Calendar className="w-6 h-6" />
              </div>
              <div>
                <p className="text-xs font-bold text-blue-400 uppercase tracking-wide mb-1">
                  Quando?
                </p>
                <p className="font-semibold text-gray-900 capitalize">
                  {dataFormatada}
                </p>
                <p className="text-sm text-gray-500 flex items-center gap-1 mt-1">
                  <Clock className="w-3 h-3" /> {horario}
                </p>
              </div>
            </div>

            <div className="flex items-start gap-4 p-4 rounded-2xl bg-red-50/50 border border-red-100">
              <div className="bg-white p-2.5 rounded-xl shadow-sm text-red-500">
                <MapPin className="w-6 h-6" />
              </div>
              <div>
                <p className="text-xs font-bold text-red-400 uppercase tracking-wide mb-1">
                  Onde?
                </p>
                <p className="font-semibold text-gray-900">{eventData.local}</p>
                <p className="text-sm text-gray-500 truncate max-w-[200px]">
                  {eventData.endereco || "Ver no mapa"}
                </p>
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <h3 className="font-bold text-xl text-gray-900 flex items-center gap-2">
              <Info className="w-5 h-5 text-gray-400" /> Sobre o evento
            </h3>
            <p className="text-gray-600 leading-relaxed text-lg">
              {eventData.descricao || "Sem descrição disponível."}
            </p>
          </div>
        </div>

        {}
        <div className="p-6 md:p-10 border-t border-gray-100 bg-gray-50/50 flex flex-col md:flex-row gap-4 items-center justify-between">
          <div className="hidden md:block">
            <p className="text-sm text-gray-500">Não quer esquecer?</p>
            <p className="text-lg font-bold text-gray-900">
              Adicione aos seus lembretes
            </p>
          </div>

          <button
            onClick={toggleReminder}
            className={`
                            w-full md:w-auto md:px-12 font-bold py-4 rounded-2xl shadow-lg transition-all active:scale-95 flex items-center justify-center gap-2 text-lg
                            ${
                              hasReminder
                                ? "bg-green-500 hover:bg-green-600 text-white shadow-green-200"
                                : "bg-blue-600 hover:bg-blue-700 text-white shadow-blue-200"
                            }
                        `}
          >
            {hasReminder ? (
              <>
                <CheckCircle className="w-6 h-6" />
                Lembrete Definido
              </>
            ) : (
              <>
                <Bell className="w-6 h-6" />
                Criar Lembrete
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default EventDetailPage;
