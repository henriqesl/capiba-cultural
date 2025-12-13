import React, { createContext, useState, useEffect, useContext } from 'react'; 
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
            api.defaults.headers.Authorization = `Bearer ${token}`;
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


            api.defaults.headers.Authorization = `Bearer ${token}`;

            // Salva no navegador e no estado
            localStorage.setItem('token', token);
            localStorage.setItem('usuario', JSON.stringify(usuario));
            localStorage.setItem('usuarioId', usuario.id); // Útil para buscas diretas

            setUser(usuario);
            return true; // Sucesso
        } catch (error) {
            console.error("Erro no login:", error);
            localStorage.removeItem('token');
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

export const useAuth = () => {
     const context = useContext(AuthContext); 
    
     if (!context) {
         throw new Error('useAuth deve ser usado dentro de um AuthProvider');
     }

     return context;
};