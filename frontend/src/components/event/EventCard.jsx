import React from 'react';

const EventCard = ({ title, time, location, href, className = '', onClick, ...props }) => {
    const Tag = href ? 'a' : 'div';
    
    const interactProps = href ? { href } : { onClick };

    return (
        <Tag 
            className={`
                w-full bg-blue-600 text-white rounded-lg shadow-md 
                p-4 px-6 
                flex items-center justify-between
                text-left
                hover:bg-blue-700 transition-colors
                cursor-pointer
                ${className}
            `}
            {...interactProps}
            {...props}
        >
            <div className="flex flex-col">
                <span className='font-bold text-xl'>{title}</span>
                <span className='text-base'>{time}</span>
                <span className='text-base opacity-80'>{location}</span>
            </div>
            {/* Placeholder de Imagem do Card */}
            <div className="w-32 h-32 bg-gray-300 rounded-md flex items-center justify-center shrink-0 ml-4">
                <span className="text-gray-700 text-xs">IMG</span>
            </div>
        </Tag>
    );
};

export default EventCard;