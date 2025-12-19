import React from "react";

const EventCard = ({
  title,
  time,
  location,
  href,
  className = "",
  onClick,
  image,
  ...props
}) => {
  const Tag = href ? "a" : "div";

  const imageUrl = image
    ? image
    : "https://via.placeholder.com/150?text=Sem+Imagem";

  const interactProps = href ? { href } : { onClick };

  return (
    <Tag
      className={`
                w-full bg-white text-gray-800 rounded-xl shadow-lg border border-gray-200 
                p-4 
                flex items-center justify-between
                text-left
                hover:shadow-xl hover:scale-[1.01] transition-all duration-200
                cursor-pointer
                ${className}
            `}
      {...interactProps}
      {...props}
    >
      <div className="w-24 h-24 sm:w-32 sm:h-32 rounded-lg overflow-hidden shrink-0 ml-0 mr-4 bg-gray-100 flex items-center justify-center border border-gray-100">
        <img
          src={imageUrl}
          alt={title || "Evento"}
          className="w-full h-full object-cover"
          onError={(e) => {
            e.target.src = "https://via.placeholder.com/150?text=Erro+Img";
          }}
        />
      </div>

      <div className="flex flex-col flex-grow min-w-0 h-full justify-between py-1">
        <div>
          <h3 className="font-bold text-lg sm:text-xl truncate text-gray-900 leading-tight mb-1">
            {title}
          </h3>
          <p className="text-sm text-blue-600 font-semibold flex items-center gap-1">
            🕒 {time}
          </p>
        </div>

        <p className="text-sm text-gray-500 truncate flex items-center gap-1 mt-auto">
          📍 {location}
        </p>
      </div>

      <div className="shrink-0 ml-2 text-blue-500 text-xl font-bold opacity-0 group-hover:opacity-100 transition-opacity">
        &rarr;
      </div>
    </Tag>
  );
};

export default EventCard;
