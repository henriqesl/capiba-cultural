import React, { createContext, useState, useEffect, useContext } from "react";
import api from "../services/api";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const recoveredUser = localStorage.getItem("usuario");
    const token = localStorage.getItem("token");

    if (recoveredUser && token) {
      setUser(JSON.parse(recoveredUser));
      api.defaults.headers.Authorization = `Bearer ${token}`;
    }
    setLoading(false);
  }, []);

  const login = async (email, senha) => {
    try {
      const response = await api.post("/usuarios/login", {
        email,
        senha,
      });

      const { token, usuario } = response.data;

      localStorage.setItem("usuario", JSON.stringify(usuario));
      setUser(usuario);

      api.defaults.headers.Authorization = `Bearer ${token}`;

      localStorage.setItem("token", token);
      localStorage.setItem("usuario", JSON.stringify(usuario));
      localStorage.setItem("usuarioId", usuario.id);

      setUser(usuario);
      return true;
    } catch (error) {
      console.error("Erro no login:", error);
      localStorage.removeItem("token");
      return false;
    }
  };

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("usuario");
    localStorage.removeItem("usuarioId");
    setUser(null);
    window.location.hash = "#/login";
  };

  const register = async (userData) => {
    try {
      const response = await api.post("/usuarios", userData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      return { sucesso: true };
    } catch (error) {
      const errorMessage =
        error.response?.data?.erro ||
        "Erro desconhecido ao cadastrar (Verifique o console do servidor).";
      console.error("Erro de registro:", errorMessage);
      return { sucesso: false, mensagem: errorMessage };
    }
  };

  return (
    <AuthContext.Provider
      value={{ authenticated: !!user, user, login, register, logout, loading }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error("useAuth deve ser usado dentro de um AuthProvider");
  }

  return context;
};
