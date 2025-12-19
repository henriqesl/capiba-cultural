import React from "react";
import { ICONS } from "../../utils/icons";


export const Icon = ({ path, className = "w-6 h-6" }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="currentColor"
    className={className}
  >
    <path fillRule="evenodd" d={path} clipRule="evenodd" />
  </svg>
);

export const PerfilImage = ({ src, className = "w-48 h-48" }) => {
  const FALLBACK = "https://placehold.co/200x200/e2e8f0/94a3b8?text=USER";

  const imageSource =
    src && typeof src === "string" && src.length > 5 ? src : FALLBACK;

  return (
    <img
      src={imageSource}
      alt="Foto de perfil"
      className={`${className} rounded-full object-cover border-4 border-white shadow-lg bg-gray-200`}
      onError={(e) => {
        e.currentTarget.src = FALLBACK;
      }}
    />
  );
};

export const InfoRow = ({ label, value }) => (
  <div className="flex justify-between items-center py-4 border-b border-gray-200 px-2 rounded-lg">
    <div>
      <p className="text-sm text-gray-500">{label}</p>
      <p className="font-semibold text-gray-800">{value ?? "N/A"}</p>
    </div>
  </div>
);
