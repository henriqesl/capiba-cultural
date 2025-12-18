import React, { useState, useEffect } from "react";

const Carousel = ({ events }) => {
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    if (!events || events.length === 0) return;
    const interval = setInterval(() => {
      setActiveIndex((current) =>
        current === events.length - 1 ? 0 : current + 1,
      );
    }, 5000);
    return () => clearInterval(interval);
  }, [events]);

  if (!events || events.length === 0) return null;

  const currentEvent = events[activeIndex];

  const imageUrl =
    currentEvent.image ||
    `https://placehold.co/800x400/2563eb/ffffff?text=${encodeURIComponent(currentEvent.title)}`;

  return (
    <div className="w-full max-w-6xl mx-auto mb-10 px-4 sm:px-0">
      <h2 className="text-xl font-bold text-gray-700 mb-4 flex items-center gap-2">
        Destaques da Semana
      </h2>

      <div className="relative w-full h-64 sm:h-80 bg-gray-900 rounded-2xl shadow-xl overflow-hidden group">
        {}
        <img
          src={imageUrl}
          alt={currentEvent.title}
          className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
        />

        {}
        <div className="absolute inset-0 bg-linear-to-t from-black/90 via-black/50 to-transparent"></div>

        {}
        <div className="absolute inset-0 flex flex-col justify-end p-6 sm:p-10 z-10">
          <h3 className="text-3xl sm:text-4xl font-bold text-white mb-2 leading-tight drop-shadow-lg">
            {currentEvent.title}
          </h3>
          <div className="flex flex-col sm:flex-row sm:items-center text-gray-200 text-sm sm:text-base gap-1 sm:gap-4 font-medium drop-shadow-md">
            <span>🗓️ {currentEvent.time}</span>
            <span className="hidden sm:inline">•</span>
            <span>📍 {currentEvent.location}</span>
          </div>

          {}
          <a
            href={`#/evento/${currentEvent.id}`}
            className="mt-4 bg-white text-blue-900 font-bold py-2 px-6 rounded-lg hover:bg-gray-100 transition-colors w-fit shadow-lg"
          >
            Ver Detalhes
          </a>
        </div>

        {}
        <div className="absolute bottom-4 right-4 flex gap-2 z-20">
          {events.map((_, index) => (
            <button
              key={index}
              onClick={() => setActiveIndex(index)}
              className={`h-2 rounded-full transition-all duration-300 shadow-sm ${
                index === activeIndex
                  ? "bg-yellow-400 w-8"
                  : "bg-white/50 w-2 hover:bg-white"
              }`}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default Carousel;

/*
  [INTEGRAÇÃO]
  Esse componente espera receber um array `events`. 
  Quando fizermos o fetch no `EventPage`, precisamos passar os eventos "Destaque" pra cá.
  
  Regra de Negócio:
  Quais eventos aparecem aqui? 
  Podemos filtrar no front os eventos que têm `pequenoPorte = false` ou criar uma flag `destaque` no backend.
*/
