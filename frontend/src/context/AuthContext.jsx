import React, { createContext, useState, useEffect } from 'react';
import api from '../services/api';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Ao abrir o app, verifica se já tem token salvo
        const recoveredUser = localStorage.getItem('usuario');
        const token = localStorage.getItem('token');

        if (recoveredUser && token) {
            setUser(JSON.parse(recoveredUser));
        }
        setLoading(false);
    }, []);

    const login = async (email, senha) => {
        try {
            // Chama a rota real do seu backend
            const response = await api.post('/usuarios/login', {
                email,
                senha
            });

            const { token, usuario } = response.data;

            // Salva no navegador e no estado
            localStorage.setItem('token', token);
            localStorage.setItem('usuario', JSON.stringify(usuario));
            localStorage.setItem('usuarioId', usuario.id); // Útil para buscas diretas

            setUser(usuario);
            return true; // Sucesso
        } catch (error) {
            console.error("Erro no login:", error);
            return false; // Falha
        }
    };

    const logout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('usuario');
        localStorage.removeItem('usuarioId');
        setUser(null);
        window.location.hash = '#/login';
    };

    return (
        <AuthContext.Provider value={{ authenticated: !!user, user, login, logout, loading }}>
            {children}
        </AuthContext.Provider>
    );
};