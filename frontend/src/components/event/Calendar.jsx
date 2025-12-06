// src/components/Calendar.jsx
import React, { useState } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

const Calendar = ({ onDateChange }) => {
  const [selectedDate, setSelectedDate] = useState(null);

  const handleChange = (date) => {
    setSelectedDate(date);
    if (onDateChange) onDateChange(date);
  };

  return (
    <div className="flex flex-col items-center bg-white p-4 rounded-2xl shadow-md w-fit">
      <label className="text-gray-700 font-semibold mb-2">Selecione a data:</label>
      <DatePicker
        selected={selectedDate}
        onChange={handleChange}
        dateFormat="dd/MM/yyyy"
        className="border border-gray-300 rounded-lg px-3 py-2 w-40 text-center focus:outline-none focus:ring-2 focus:ring-blue-500"
        placeholderText="Escolher data"
      />
    </div>
  );
};

export default Calendar;
