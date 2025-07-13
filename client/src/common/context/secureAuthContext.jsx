import { createContext, useContext, useState, useCallback, useEffect } from 'react';

const AuthContext = createContext({});

const AUTH_STORAGE_KEY = '_HYPER_AUTH';
const TOKEN_REFRESH_THRESHOLD = 5 * 60 * 1000;
const SESSION_CHECK_INTERVAL = 60 * 1000;

export function useAuthContext() {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuthContext must be used within an AuthProvider');
    }
    return context;
}

const TokenStorage = {
    set: (data) => {
        try {
            const encoded = btoa(JSON.stringify(data));
            sessionStorage.setItem(AUTH_STORAGE_KEY, encoded);
            
            window.addEventListener('beforeunload', TokenStorage.clear);
            
            return true;
        } catch (error) {
            console.error('Failed to store auth data:', error);
            return false;
        }
    },
    
    get: () => {
        try {
            const encoded = sessionStorage.getItem(AUTH_STORAGE_KEY);
            if (!encoded) return null;
            
            const decoded = JSON.parse(atob(encoded));
            return decoded;
        } catch (error) {
            console.error('Failed to retrieve auth data:', error);
            TokenStorage.clear();
            return null;
        }
    },
    
    clear: () => {
        try {
            sessionStorage.removeItem(AUTH_STORAGE_KEY);
            localStorage.removeItem(AUTH_STORAGE_KEY);
            window.removeEventListener('beforeunload', TokenStorage.clear);
        } catch (error) {
            console.error('Failed to clear auth data:', error);
        }
    },
    
    validate: (data) => {
        if (!data || !data.tokens || !data.user) return false;
        
        if (!data.tokens.access || !data.tokens.refresh) return false;
        if (!data.tokens.accessExpiresAt || !data.tokens.refreshExpiresAt) return false;
        
        const refreshExpiry = new Date(data.tokens.refreshExpiresAt);
        if (refreshExpiry <= new Date()) return false;
        
        return true;
    }
};

export function AuthProvider({ children }) {
    const [authData, setAuthData] = useState(() => {
        const stored = TokenStorage.get();
        return TokenStorage.validate(stored) ? stored : null;
    });
    
    const [sessionCheckInterval, setSessionCheckInterval] = useState(null);

    const saveSession = useCallback((data) => {
        if (!data || !data.tokens || !data.user) {
            console.error('Invalid auth data provided to saveSession');
            return false;
        }

        const authPayload = {
            tokens: {
                access: data.tokens.access,
                refresh: data.tokens.refresh,
                accessExpiresAt: data.tokens.accessExpiresAt,
                refreshExpiresAt: data.tokens.refreshExpiresAt
            },
            user: {
                id: data.user.id,
                email: data.user.email,
                first_name: data.user.first_name,
                last_name: data.user.last_name,
                role: data.user.role
            },
            sessionStarted: new Date().toISOString(),
            lastActivity: new Date().toISOString()
        };

        if (TokenStorage.set(authPayload)) {
            setAuthData(authPayload);
            startSessionMonitoring();
            return true;
        }
        
        return false;
    }, []);

    const removeSession = useCallback(() => {
        TokenStorage.clear();
        setAuthData(null);
        stopSessionMonitoring();
        
        if (window.caches) {
            caches.keys().then(names => {
                names.forEach(name => caches.delete(name));
            });
        }
    }, []);

    const getAccessToken = useCallback(() => {
        if (!authData?.tokens?.access) return null;
        
        if (isTokenExpired(authData.tokens.accessExpiresAt)) {
            return null;
        }
        
        return authData.tokens.access;
    }, [authData]);

    const getRefreshToken = useCallback(() => {
        if (!authData?.tokens?.refresh) return null;
        
        if (isTokenExpired(authData.tokens.refreshExpiresAt)) {
            removeSession();
            return null;
        }
        
        return authData.tokens.refresh;
    }, [authData, removeSession]);

    const isTokenExpired = useCallback((expiryDate) => {
        if (!expiryDate) return true;
        
        const expiry = new Date(expiryDate);
        const now = new Date();
        
        return expiry <= now;
    }, []);

    const needsTokenRefresh = useCallback(() => {
        if (!authData?.tokens?.accessExpiresAt) return false;
        
        const expiry = new Date(authData.tokens.accessExpiresAt);
        const now = new Date();
        const timeUntilExpiry = expiry.getTime() - now.getTime();
        
        return timeUntilExpiry <= TOKEN_REFRESH_THRESHOLD;
    }, [authData]);

    const isAuthenticated = useCallback(() => {
        if (!authData?.tokens?.access) return false;
        
        if (!TokenStorage.validate(authData)) {
            removeSession();
            return false;
        }
        
        if (isTokenExpired(authData.tokens.accessExpiresAt)) {
            if (!isTokenExpired(authData.tokens.refreshExpiresAt)) {
                return true;
            }
            
            removeSession();
            return false;
        }
        
        return true;
    }, [authData, isTokenExpired, removeSession]);

    const updateActivity = useCallback(() => {
        if (authData) {
            const updatedData = {
                ...authData,
                lastActivity: new Date().toISOString()
            };
            
            TokenStorage.set(updatedData);
            setAuthData(updatedData);
        }
    }, [authData]);

    const startSessionMonitoring = useCallback(() => {
        if (sessionCheckInterval) return;
        
        const interval = setInterval(() => {
            const stored = TokenStorage.get();
            
            if (!stored || !TokenStorage.validate(stored)) {
                removeSession();
                return;
            }
            
            const lastActivity = new Date(stored.lastActivity || stored.sessionStarted);
            const now = new Date();
            const inactiveTime = now.getTime() - lastActivity.getTime();
            const maxInactiveTime = 24 * 60 * 60 * 1000;
            
            if (inactiveTime > maxInactiveTime) {
                console.log('Session expired due to inactivity');
                removeSession();
                return;
            }
            
            if (needsTokenRefresh()) {
                console.log('Token refresh needed');
            }
            
        }, SESSION_CHECK_INTERVAL);
        
        setSessionCheckInterval(interval);
    }, [sessionCheckInterval, removeSession, needsTokenRefresh]);

    const stopSessionMonitoring = useCallback(() => {
        if (sessionCheckInterval) {
            clearInterval(sessionCheckInterval);
            setSessionCheckInterval(null);
        }
    }, [sessionCheckInterval]);

    useEffect(() => {
        if (authData && isAuthenticated()) {
            startSessionMonitoring();
        }
        
        const activityEvents = ['mousedown', 'keydown', 'scroll', 'touchstart'];
        const handleActivity = () => updateActivity();
        
        activityEvents.forEach(event => {
            document.addEventListener(event, handleActivity, { passive: true });
        });
        
        return () => {
            stopSessionMonitoring();
            activityEvents.forEach(event => {
                document.removeEventListener(event, handleActivity);
            });
        };
    }, [authData, isAuthenticated, startSessionMonitoring, stopSessionMonitoring, updateActivity]);

    useEffect(() => {
        const handleVisibilityChange = () => {
            if (document.visibilityState === 'visible' && authData) {
                const stored = TokenStorage.get();
                if (!stored || !TokenStorage.validate(stored)) {
                    removeSession();
                }
            }
        };
        
        document.addEventListener('visibilitychange', handleVisibilityChange);
        
        return () => {
            document.removeEventListener('visibilitychange', handleVisibilityChange);
        };
    }, [authData, removeSession]);

    const contextValue = {
        user: authData?.user || null,
        tokens: authData?.tokens || null,
        isAuthenticated: isAuthenticated(),
        saveSession,
        removeSession,
        getAccessToken,
        getRefreshToken,
        needsTokenRefresh,
        isTokenExpired,
        updateActivity,
        sessionStarted: authData?.sessionStarted || null,
        lastActivity: authData?.lastActivity || null
    };

    return (
        <AuthContext.Provider value={contextValue}>
            {children}
        </AuthContext.Provider>
    );
} 