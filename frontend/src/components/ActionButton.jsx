import React from 'react';

const ActionButton = ({ children, onClick, type = 'primary' }) => {
    const baseStyle = "w-full font-bold py-3 rounded-lg transition-transform transform hover:scale-105 duration-300 shadow-md";
    const styles = {
        primary: "bg-gray-200 text-gray-800 hover:bg-gray-300",
        secondary: "bg-transparent border-2 border-gray-200 text-white hover:bg-gray-200 hover:text-gray-800"
    };

    return (
        <button onClick={onClick} className={`${baseStyle} ${styles[type]}`}>
            {children}
        </button>
    );
};

export default ActionButton;
