import React, { useState, useRef, useEffect } from "react";
import api from "../../services/api";
import { geocodeLocation, reverseGeocodeLocation } from "../../services/mapbox";
import LocationMap, { RECIFE_BOUNDS, isInsideBounds } from "./LocationMap.jsx";
import { useAuth } from "../../context/AuthContext";

import {
  ArrowLeft,
  Camera,
  StopCircle,
  Video,
  Megaphone,
  MapPin,
  Loader2,
  CheckCircle,
} from "lucide-react";

const ReportForm = ({ onBack }) => {
  const { user: userContext } = useAuth();
  const [nome, setNome] = useState("");
  const [local, setLocal] = useState("");
  const [value, setValue] = useState("");
  const [noAgeLimit, setNoAgeLimit] = useState(false);
  const [unknownTime, setUnknownTime] = useState(false);
  const [imagePreview, setImagePreview] = useState(null);
  const [imageFile, setImageFile] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isGeocoding, setIsGeocoding] = useState(false);
  const [isGeolocating, setIsGeolocating] = useState(false);
  const [coords, setCoords] = useState(null);

  const [isCameraActive, setIsCameraActive] = useState(false);
  const videoRef = useRef(null);
  const canvasRef = useRef(null);

  const stopCameraStream = () => {
    const video = videoRef.current;
    if (video && video.srcObject) {
      video.srcObject.getTracks().forEach((track) => track.stop());
      video.srcObject = null;
    }
  };

  useEffect(() => {
    if (isCameraActive) {
      stopCameraStream();
      navigator.mediaDevices
        .getUserMedia({ video: { facingMode: "environment" } })
        .then((stream) => {
          let video = videoRef.current;
          if (video) {
            video.srcObject = stream;
            video.play();
          }
        })
        .catch((err) => {
          console.error("Erro ao acessar a câmera: ", err);
          setIsCameraActive(false);
          alert("Não foi possível acessar a câmera.");
        });
    } else {
      stopCameraStream();
    }
    return () => {
      stopCameraStream();
    };
  }, [isCameraActive]);

  const handleCapture = () => {
    const video = videoRef.current;
    const canvas = canvasRef.current;
    if (video && canvas) {
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      canvas
        .getContext("2d")
        .drawImage(video, 0, 0, canvas.width, canvas.height);
      canvas.toBlob((blob) => {
        if (blob) {
          const capturedFile = new File([blob], "report_camera_image.jpeg", {
            type: "image/jpeg",
          });
          setImageFile(capturedFile);
          setImagePreview(URL.createObjectURL(capturedFile));
          setIsCameraActive(false);
        }
      }, "image/jpeg");
    }
  };

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

  const handleCurrentLocation = () => {
    if (!navigator.geolocation) {
      alert("Seu navegador não suporta geolocalização.");
      return;
    }
    setIsGeolocating(true);
    setCoords(null);
    setLocal("Localizando...");
    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude } = position.coords;
        try {
          const address = await reverseGeocodeLocation(latitude, longitude);
          if (address) {
            setLocal(address);
            setCoords({ latitude, longitude });
          } else {
            setLocal(`Coordenadas: ${latitude}, ${longitude}`);
            setCoords({ latitude, longitude });
            alert("Não foi possível resolver o endereço. Coordenadas salvas.");
          }
        } catch (error) {
          setLocal("");
          setCoords(null);
          alert("Erro ao resolver o endereço.");
        } finally {
          setIsGeolocating(false);
        }
      },
      (error) => {
        setIsGeolocating(false);
        setLocal("");
        alert(`Erro de GPS: ${error.message}.`);
      },
      { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 },
    );
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
        const { latitude, longitude } = result;
        if (!isInsideBounds(latitude, longitude, RECIFE_BOUNDS)) {
          alert("A busca encontrou um local fora de Recife.");
          setCoords(null);
          return;
        }
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
    if (isCameraActive) {
      alert("Capture a foto ou cancele antes de enviar.");
      setIsLoading(false);
      return;
    }

    if (!nome.trim()) {
      alert("Por favor, insira um Título para o evento.");
      setIsLoading(false);
      return;
    }

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

      const formData = new FormData();
      formData.append("nome", nome);
      formData.append("local", local);
      formData.append("data", new Date().toISOString());
      formData.append("preco", value || "Gratuito");
      formData.append("faixaEtaria", noAgeLimit ? 0 : 18);
      formData.append(
        "descricao",
        "Evento reportado pela comunidade em tempo real.",
      );
      formData.append("precisaInscricao", false);
      formData.append("ativo", true);
      formData.append("reportadoPorUsuario", "true");

      if (finalLatitude !== null) formData.append("latitude", finalLatitude);
      if (finalLongitude !== null) formData.append("longitude", finalLongitude);

      if (imageFile) formData.append("imagemFile", imageFile);

      const eventoResponse = await api.post("/eventos", formData);
      alert("Reporte enviado com sucesso!");
      onBack();

      const eventoCriado = eventoResponse.data.evento;

      await api.post("/reportes", {
        evento: eventoCriado,
        descricao: "Reporte automático após criar o evento",
        usuarioId: userContext.id,
      });

      alert("Evento criado e reportado com sucesso!");
      onBack();
    } catch (error) {
      console.error("Erro:", error);
      alert("Erro ao enviar reporte.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-gray-100 min-h-screen w-full flex justify-center py-6 px-4">
      <div className="w-full max-w-2xl bg-white rounded-3xl shadow-xl overflow-hidden flex flex-col animate-fade-in-up">
        <header className="bg-red-600 text-white p-6 flex items-center gap-4">
          <button
            onClick={onBack}
            className="p-2 hover:bg-white/20 rounded-full transition-colors"
          >
            <ArrowLeft className="w-6 h-6" />
          </button>
          <div>
            <h1 className="text-xl font-bold">Reportar Evento (Agora)</h1>
            <p className="text-red-100 text-sm">
              O que está acontecendo neste momento?
            </p>
          </div>
        </header>

        <form className="p-6 md:p-8 space-y-6" onSubmit={handleSubmit}>
          {}
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-1">
              Título do Evento
            </label>
            <div className="relative">
              <input
                value={nome}
                onChange={(e) => setNome(e.target.value)}
                type="text"
                placeholder="Ex: Show de Maracatu na Praça"
                className="w-full pl-10 p-2.5 border border-gray-300 rounded-lg outline-none"
                required
              />
              {}
              <Megaphone className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
            </div>
          </div>

          {}
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-2">
              Foto do local/evento
            </label>
            {isCameraActive ? (
              <div className="relative w-full rounded-xl overflow-hidden shadow-lg bg-gray-900">
                <video
                  ref={videoRef}
                  className="w-full h-auto object-cover"
                  autoPlay
                  playsInline
                  muted
                ></video>
                <canvas ref={canvasRef} style={{ display: "none" }}></canvas>
                <div className="absolute inset-x-0 bottom-0 p-4 flex justify-center gap-4 bg-black/30">
                  <button
                    type="button"
                    onClick={handleCapture}
                    className="bg-red-500 text-white p-4 rounded-full shadow-xl hover:bg-red-600"
                  >
                    <Camera className="w-8 h-8" />
                  </button>
                  <button
                    type="button"
                    onClick={() => setIsCameraActive(false)}
                    className="bg-gray-500 text-white p-4 rounded-full shadow-xl hover:bg-gray-600"
                  >
                    <StopCircle className="w-8 h-8" />
                  </button>
                </div>
              </div>
            ) : (
              <div className="relative w-full h-48 border-2 border-dashed border-red-300 rounded-xl bg-red-50 flex flex-col items-center justify-center overflow-hidden hover:bg-red-100">
                {imagePreview ? (
                  <div className="relative w-full h-full">
                    <img
                      src={imagePreview}
                      alt="Preview"
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-black/30 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity z-10 pointer-events-none">
                      <p className="text-white font-bold bg-red-600 px-4 py-2 rounded-full flex items-center gap-2">
                        <Camera className="w-5 h-5" /> Imagem Capturada
                      </p>
                    </div>
                  </div>
                ) : (
                  <div className="flex flex-col sm:flex-row items-center justify-center gap-4 p-4 text-red-600">
                    <button
                      type="button"
                      onClick={() => setIsCameraActive(true)}
                      className="flex flex-col items-center justify-center p-4 bg-red-100 rounded-xl hover:bg-red-200 transition-colors shadow"
                    >
                      <Video className="w-8 h-8" />
                      <span className="mt-1 font-semibold">Câmera</span>
                    </button>
                    <span className="text-gray-400">OU</span>
                    <div className="relative flex flex-col items-center justify-center p-4 bg-white rounded-xl hover:bg-gray-50 transition-colors shadow border border-gray-300">
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleImageChange}
                        className="absolute inset-0 opacity-0 cursor-pointer z-20"
                      />
                      <Megaphone className="w-8 h-8" />
                      <span className="mt-1 font-semibold">Galeria</span>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>

          {}
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-1">
              Local
            </label>
            <div className="flex flex-col sm:flex-row gap-2">
              <input
                value={local}
                onChange={(e) => {
                  setLocal(e.target.value);
                  setCoords(null);
                }}
                type="text"
                placeholder="Endereço..."
                className="flex-1 p-2.5 border border-gray-300 rounded-lg outline-none"
                required
              />
              <button
                type="button"
                onClick={handleCurrentLocation}
                disabled={isGeolocating || isGeocoding}
                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2.5 rounded-lg flex items-center justify-center gap-1"
              >
                {isGeolocating ? (
                  <Loader2 className="w-5 h-5 animate-spin" />
                ) : (
                  <MapPin className="w-5 h-5" />
                )}{" "}
                GPS
              </button>
              <button
                type="button"
                onClick={geocodeAndDisplayMap}
                disabled={isGeocoding || !local}
                className="bg-red-500 hover:bg-red-600 text-white px-4 py-2.5 rounded-lg flex items-center justify-center gap-1"
              >
                {isGeocoding ? (
                  <Loader2 className="w-5 h-5 animate-spin" />
                ) : (
                  <MapPin className="w-5 h-5" />
                )}{" "}
                Verificar
              </button>
            </div>
            {coords && (
              <LocationMap
                latitude={coords.latitude}
                longitude={coords.longitude}
                name={local}
              />
            )}
          </div>

          {}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-1">
                Valor
              </label>
              <input
                value={value}
                onChange={(e) => setValue(e.target.value)}
                type="text"
                placeholder="Ex: Grátis"
                className="w-full p-2.5 border border-gray-300 rounded-lg outline-none"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-bold text-gray-700">
                Faixa Etária
              </label>
              <div className="flex gap-2">
                <input
                  type="text"
                  placeholder="+18"
                  disabled={noAgeLimit}
                  className={`w-full p-2.5 border rounded-lg ${noAgeLimit ? "bg-gray-100" : ""}`}
                />
                <label className="flex items-center gap-1 cursor-pointer whitespace-nowrap">
                  <input
                    type="checkbox"
                    checked={noAgeLimit}
                    onChange={(e) => setNoAgeLimit(e.target.checked)}
                  />{" "}
                  Livre
                </label>
              </div>
            </div>
          </div>

          <div>
            <label className="block text-sm font-bold text-gray-700">
              Horário
            </label>
            <div className="flex gap-2">
              <input
                type="time"
                disabled={unknownTime}
                className={`w-full p-2.5 border rounded-lg ${unknownTime ? "bg-gray-100" : ""}`}
              />
              <label className="flex items-center gap-1 cursor-pointer whitespace-nowrap">
                <input
                  type="checkbox"
                  checked={unknownTime}
                  onChange={(e) => setUnknownTime(e.target.checked)}
                />{" "}
                Não sei
              </label>
            </div>
          </div>

          <button
            type="submit"
            className={`w-full text-white font-bold py-4 rounded-xl shadow-lg flex items-center justify-center gap-2 ${isLoading || isCameraActive ? "bg-gray-500 cursor-not-allowed" : "bg-red-600 hover:bg-red-700"}`}
            disabled={isLoading || isCameraActive}
          >
            {isLoading ? (
              <>
                <Loader2 className="w-6 h-6 animate-spin" /> Enviando...
              </>
            ) : (
              <>
                <CheckCircle className="w-6 h-6" /> Enviar Reporte
              </>
            )}
          </button>
        </form>
      </div>
    </div>
  );
};

export default ReportForm;
