import React from "react";
import { Icon } from "../user/UserShared";
import { ICONS } from "../../utils/icons";

export const CaravanaItem = ({
  imageUrl,
  name,
  date,
  eventName,
  membersCount,
  isOwner,
  onClick,
}) => {
  return (
    <div
      onClick={onClick}
      className="flex items-center bg-white p-4 mb-3 rounded-lg shadow-md hover:shadow-lg transition-all duration-200 cursor-pointer border border-gray-200"
    >
            {}     {" "}
      <div className="w-12 h-12 rounded-full flex items-center justify-center shrink-0 overflow-hidden bg-gray-200 border border-gray-300">
        {imageUrl ? (
          <img
            src={imageUrl}
            alt={`Capa da caravana ${name}`}
            className="w-full h-full object-cover"
          />
        ) : (
          <span className="text-2xl">🚌</span>
        )}
             {" "}
      </div>
                 {" "}
      <div className="ml-4 grow">
                <h3 className="text-lg font-bold text-gray-800">{name}</h3>     
                  {}       {" "}
        <div className="flex flex-col sm:flex-row sm:items-center text-sm text-gray-500 gap-1 sm:gap-3">
                   {" "}
          <p className="flex items-center gap-1">
                        <span>📍</span> {eventName}         {" "}
          </p>
                    {}         {" "}
          <p className="flex items-center gap-1 text-blue-600 font-medium">
                        <span>📅</span> {date}         {" "}
          </p>
                 {" "}
        </div>
             {" "}
      </div>
            {}     {" "}
      <div className="ml-4 text-right shrink-0 flex flex-col items-end gap-1">
               {" "}
        <div className="flex items-center text-blue-600 font-bold text-sm">
                     <Icon path={ICONS.user} className="w-4 h-4 mr-1" />       
             {membersCount}       {" "}
        </div>
                        {}       {" "}
        {isOwner && (
          <span className="text-xs bg-amber-400 text-gray-900 px-2 py-0.5 rounded-full font-bold shadow-sm">
                        Líder 👑          {" "}
          </span>
        )}
             {" "}
      </div>
         {" "}
    </div>
  );
};
