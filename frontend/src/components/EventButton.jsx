import React from 'react';


const EventButton = ({ title, time, location }) => {
    return(
        <button 
            className='
                w-full bg-blue-600 text-white rounded-lg shadow-md 
                p-4 px-6 // Ajustei o padding um pouco
                flex items-center justify-between
                text-left
                hover:bg-blue-700 transition-colors'
        >
            <div className="flex flex-col">
                <span className='font-bold text-xl'>{title}</span>
                <span className='text-base'>{time}</span>
                <span className='text-base opacity-80'>{location}</span>
            </div>

            <div className="w-32 h-32 bg-gray-300 rounded-md flex items-center justify-center shrink-0 ml-4">
                <span className="text-gray-700 text-xs">IMG</span>
            </div>
        </button>
    )
}

export default EventButton;