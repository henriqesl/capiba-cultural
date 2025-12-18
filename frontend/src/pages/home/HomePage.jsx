// frontend/src/pages/home/HomePage.jsx

import React from 'react';
import { useAuth } from '../../context/AuthContext';
import Carousel from '../../components/event/Carousel';
import EventsData from '../../components/event/EventsData';

const HomePage = () => {
    const { user } = useAuth();
    // Seleciona os primeiros 3 eventos para destaque
    const featuredEvents = EventsData.slice(0, 3);

    return (
        <div className="bg-gray-100 min-h-screen pb-24">
            <section className="bg-blue-600 pt-12 pb-10 px-6 rounded-b-[3rem] text-white shadow-lg">
                <div className="max-w-4xl mx-auto">
                    <h1 className="text-3xl font-bold">
                        {/* Exibe o primeiro nome do usuário vindo do contexto */}
                        Olá, {user?.nome?.split(' ')[0] || 'Capiba'}! 👋
                    </h1>
                    <p className="text-blue-100 mt-1 opacity-90">
                        O que vamos explorar hoje no Recife?
                    </p>
                </div>
            </section>

            <div className="max-w-4xl mx-auto px-4 mt-6">
                <section className="rounded-2xl overflow-hidden shadow-sm">
                    <Carousel events={featuredEvents} />
                </section>
            </div>
        </div>
    );
};

export default HomePage;