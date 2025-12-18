import { createContext, useContext, useState } from 'react';
import api from '../config/api';

const AuthContext = createContext();

/* eslint-disable react-refresh/only-export-components */
export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(() => {
        const storedUser = localStorage.getItem('user_data');
        return storedUser ? JSON.parse(storedUser) : null;
    });
    const [token, setToken] = useState(() => localStorage.getItem('auth_token'));
    const [loading, setLoading] = useState(false);



    const login = async (identifier, password) => {
        try {
            const response = await api.login(identifier, password);

            // Strapi returns: { jwt, user }
            const { jwt, user: userData } = response;

            setToken(jwt);
            setUser(userData);
            localStorage.setItem('auth_token', jwt);
            localStorage.setItem('user_data', JSON.stringify(userData));

            return userData;
        } catch {
            throw new Error('Invalid credentials');
        }
    };

    const register = async (username, email, password) => {
        try {
            const response = await api.register(username, email, password);
            const { jwt, user: userData } = response;

            setToken(jwt);
            setUser(userData);
            localStorage.setItem('auth_token', jwt);
            localStorage.setItem('user_data', JSON.stringify(userData));

            return userData;
        } catch {
            throw new Error('Registration failed');
        }
    };

    const logout = () => {
        setUser(null);
        setToken(null);
        localStorage.removeItem('auth_token');
        localStorage.removeItem('user_data');
    };

    return (
        <AuthContext.Provider value={{ user, token, login, register, logout, loading }}>
            {!loading && children}
        </AuthContext.Provider>
    );
};
