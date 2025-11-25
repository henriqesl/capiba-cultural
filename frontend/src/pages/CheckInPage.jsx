import React from 'react';
import Button from '../components/Button';

const CheckInPage =  () =>{
    return(
        <div className="bg-gray-100 p-4 sm:p-8 pb-24 md:pb-8">
            <h1 className="text-3xl sm:text-4xl font-bold text-center mb-8 sm:mb-12 text-gray-800 capitalize">
                Check-In
            </h1>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-6xl mx-auto">
                <Button variant='primary'>
                <div className="flex flex-col leading-tight">
                    <span className="text-xl">Check-in em Eventos</span>
                    <span className="text-xs font-normal opacity-80 mt-1">Registre quais eventos você marcou presença e ganhou Capibas.</span>
                </div>
                </Button>

                <Button variant='primary'>
                <div className="flex flex-col leading-tight">
                    <span className="text-xl">Informar Acontecimento</span>
                    <span className="text-xs font-normal opacity-80 mt-1">Viu algo legal acontecendo agora por aí? Avise a todos em tempo real!</span>
                </div>
                </Button>

                <Button variant='primary'>
                <div className="flex flex-col leading-tight">
                    <span className="text-xl">Sugerir um Evento</span>
                    <span className="text-xs font-normal opacity-80 mt-1">Conhece um evento futuro que não está aqui? Informe-nos!</span>
                </div>
                </Button>
            </div>
        </div>

    );
};

export default CheckInPage;

