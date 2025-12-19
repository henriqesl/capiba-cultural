import React, { useState, useEffect } from 'react';
import { MapPin, Clock, ChevronLeft, ChevronRight } from 'lucide-react';

const Carousel = ({ events }) => {
    const [currentIndex, setCurrentIndex] = useState(0);

    if (!events || events.length === 0) {
        return null; 
    }

    const prevSlide = () => {
        const isFirstSlide = currentIndex === 0;
        const newIndex = isFirstSlide ? events.length - 1 : currentIndex - 1;
        setCurrentIndex(newIndex);
    };

    const nextSlide = () => {
        const isLastSlide = currentIndex === events.length - 1;
        const newIndex = isLastSlide ? 0 : currentIndex + 1;
        setCurrentIndex(newIndex);
    };


    useEffect(() => {
        const interval = setInterval(() => {
            nextSlide();
        }, 5000); 
        return () => clearInterval(interval);
    }, [currentIndex, events.length]);


    const currentEvent = events[currentIndex];
    if (!currentEvent) return null;

    return (
        <div className="relative group w-full max-w-6xl mx-auto h-56 sm:h-72 rounded-2xl overflow-hidden shadow-lg">

            <div 
                style={{ backgroundImage: `url(${currentEvent.image || 'https://via.placeholder.com/800x400?text=Sem+Foto'})` }} 
                className="w-full h-full bg-center bg-cover duration-500 transition-all"
            >
               
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent"></div>
            </div>

   
            <div className="absolute bottom-0 left-0 p-5 text-white w-full">
                <h2 className="text-xl sm:text-2xl font-bold mb-1 drop-shadow-md truncate">{currentEvent.title}</h2>
                
                <div className="flex items-center gap-3 text-sm sm:text-base opacity-90">
                    <div className="flex items-center gap-1">
                        <Clock className="w-4 h-4" />
                        <span>{currentEvent.time}</span>
                    </div>
                    <div className="flex items-center gap-1">
                        <MapPin className="w-4 h-4" />
                        <span className="truncate max-w-[150px] sm:max-w-xs">{currentEvent.location}</span>
                    </div>
                </div>
            </div>

            <div className="hidden group-hover:block absolute top-[50%] -translate-x-0 translate-y-[-50%] left-5 text-2xl rounded-full p-2 bg-black/20 text-white cursor-pointer hover:bg-black/40 transition-all">
                <ChevronLeft onClick={prevSlide} size={30} />
            </div>
            <div className="hidden group-hover:block absolute top-[50%] -translate-x-0 translate-y-[-50%] right-5 text-2xl rounded-full p-2 bg-black/20 text-white cursor-pointer hover:bg-black/40 transition-all">
                <ChevronRight onClick={nextSlide} size={30} />
            </div>

      
            <div className="flex top-4 justify-center py-2 absolute w-full gap-2">
                {events.map((_, slideIndex) => (
                    <div
                        key={slideIndex}
                        onClick={() => setCurrentIndex(slideIndex)}
                        className={`text-2xl cursor-pointer transition-all duration-300 h-1.5 rounded-full ${currentIndex === slideIndex ? 'bg-white w-6' : 'bg-white/40 w-2'}`}
                    ></div>
                ))}
            </div>
            
            <a href={`#/eventos/${currentEvent.id}`} className="absolute inset-0 z-0" onClick={(e) => {

                if(e.target.closest('svg')) e.preventDefault();
            }}></a>
        </div>
    );
};

export default Carousel;