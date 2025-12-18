import React from "react";

const Button = ({
  variant = "primary",
  children,
  onClick,
  className = "",
  href,
  ...props
}) => {
  const Tag = href ? "a" : "button";

  const baseStyle =
    "w-full font-bold py-3 rounded-lg transition-transform transform hover:scale-105 duration-300 shadow-md";

  const styles = {
    primary: "bg-white text-gray-800 hover:bg-gray-300",
    secondary:
      "bg-transparent border-2 border-gray-200 text-white hover:bg-gray-200 hover:text-gray-800",
  };

  const linkStyles = href
    ? " no-underline flex items-center justify-center"
    : "";

  const finalClassName = `${baseStyle} ${styles[variant] || styles.primary} ${className} ${linkStyles}`;

  return (
    <Tag
      className={finalClassName}
      onClick={!href ? onClick : undefined}
      href={href}
      {...props}
    >
      {children}
    </Tag>
  );
};

export default Button;

/*
  Quando formos ligar com a API, vale a pena adicionar uma prop `isLoading`.
  Assim, enquanto o login carrega, o botão fica desabilitado e mostra um spinner, 
  evitando que o usuário clique 10 vezes seguidas.
*/
