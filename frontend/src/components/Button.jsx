import React from 'react';

// - variant: 'primary', 'secondary' (para o ActionButton) ou 'event' (para o EventButton)
// - children: Usado para os variants 'primary' e 'secondary'
// - title, time, location: Usado para o variant 'event'
// - onClick: A função "click"
// - className: Para qualquer estilo extra

const Button = ({ 
    variant = 'primary', 
    children, 
    onClick, 
    title, 
    time, 
    location, 
    className = '',
    href,
    ...props 
}) => {

    const Tag = href ? 'a' : 'button';
    
    const commonProps = {
        onClick: !href ? onClick : undefined, 
        href: href,
        className: className, 
        ...props,
    };

    // --- ActionButton ---
    if (variant === 'primary' || variant === 'secondary') {
        const baseStyle = "w-full font-bold py-3 rounded-lg transition-transform transform hover:scale-105 duration-300 shadow-md";
        const styles = {
            primary: "bg-white text-gray-800 hover:bg-gray-300",
            secondary: "bg-transparent border-2 border-gray-200 text-white hover:bg-gray-200 hover:text-gray-800"
        };
        
        const linkStyles = href ? " no-underline flex items-center justify-center" : "";
        
        commonProps.className = `${baseStyle} ${styles[variant]} ${className} ${linkStyles}`;
        
        return (
            <Tag {...commonProps}>
                {children}
            </Tag>
        );
    }

    // --- EventButton ---
    if (variant === 'event') {
        commonProps.className = `
            w-full bg-blue-600 text-white rounded-lg shadow-md 
            p-4 px-6 
            flex items-center justify-between
            text-left
            hover:bg-blue-700 transition-colors
            ${className}`;

        return (
            <Tag {...commonProps}>
                <div className="flex flex-col">
                    <span className='font-bold text-xl'>{title}</span>
                    <span className='text-base'>{time}</span>
                    <span className='text-base opacity-80'>{location}</span>
                </div>
                <div className="w-32 h-32 bg-gray-300 rounded-md flex items-center justify-center shrink-0 ml-4">
                    <span className="text-gray-700 text-xs">IMG</span>
                </div>
            </Tag>
        );
    }

    return null; 
};

export default Button;