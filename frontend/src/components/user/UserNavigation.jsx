import React from "react";
import { ChevronRight } from "lucide-react";

export const NavCard = ({ href, icon: Icon, title, description }) => {
  return (
    <a
      href={href}
      className="flex items-center p-4 bg-white rounded-xl shadow-sm border border-gray-100 transition-transform hover:scale-[1.02] hover:shadow-md group"
    >
      <div className="bg-blue-50 p-3 rounded-full mr-4 group-hover:bg-blue-100 transition-colors">
        <Icon className="w-6 h-6 text-blue-600" />
      </div>

      <div className="flex-1">
        <h3 className="text-lg font-bold text-gray-800">{title}</h3>
        <p className="text-sm text-gray-500">{description}</p>
      </div>

      <ChevronRight className="w-5 h-5 text-gray-300 group-hover:text-blue-500 transition-colors" />
    </a>
  );
};
