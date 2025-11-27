import React from 'react';

const ConfirmedEventRow = ({ title, date }) => {
  return (
    <div className="bg-white p-5 rounded-lg shadow-md flex justify-between items-center hover:shadow-lg transition-shadow">
      <div>
        <h3 className="font-bold text-lg text-gray-800">{title}</h3>
        <p className="text-sm text-gray-500 mt-1">📅 {date}</p>
      </div>
      <span className="text-3xl text-blue-600 font-bold">OK</span>
    </div>
  );
};

export default ConfirmedEventRow;