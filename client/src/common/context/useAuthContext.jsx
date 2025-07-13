import { createContext, useContext, useState, useCallback } from 'react';

const AuthContext = createContext({});
const AUTH_STORAGE_KEY = '_HYPER_AUTH';

export function useAuthContext() {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuthContext must be used within an AuthProvider');
    }
    return context;
}

export function AuthProvider({ children }) {

    const [authData, setAuthData] = useState(() => {
        const savedData = localStorage.getItem(AUTH_STORAGE_KEY);
        return savedData ? JSON.parse(savedData) : null;
    });

    const saveSession = useCallback((data) => {
        const authPayload = {
            tokens: {
                access: data.tokens.access,
                refresh: data.tokens.refresh,
                accessExpiresAt: data.tokens.accessExpiresAt,
                refreshExpiresAt: data.tokens.refreshExpiresAt
            },
            user: data.user
        };
 
        localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(authPayload));
        setAuthData(authPayload);
    }, []);

    const removeSession = useCallback(() => {
        localStorage.removeItem(AUTH_STORAGE_KEY);
        setAuthData(null);
    }, []);

    const getAccessToken = useCallback(() => {
        return authData?.tokens?.access;
    }, [authData]);

    const getRefreshToken = useCallback(() => {
        return authData?.tokens?.refresh;
    }, [authData]);

    const isTokenExpired = useCallback((expiryDate) => {
        if (!expiryDate) return true;
        return new Date(expiryDate) <= new Date();
    }, []);

    const isAuthenticated = useCallback(() => {
        if (!authData?.tokens?.access) return false;
        return !isTokenExpired(authData.tokens.accessExpiresAt);
    }, [authData, isTokenExpired]);

    const value = {
        user: authData?.user,
        isAuthenticated: isAuthenticated(),
        getAccessToken,
        getRefreshToken,
        saveSession,
        removeSession,
        isTokenExpired
    };

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
}