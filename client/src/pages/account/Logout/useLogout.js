import { useAuthContext } from '@/common/context';
import { useEffect } from 'react';
import { authApi } from '@/common';

export default function useLogout() {
    const { removeSession } = useAuthContext();

    useEffect(() => {
        const performLogout = async () => {
            try {
                await authApi.logout();
            } catch (error) {
                console.error('Logout error:', error);
            } finally {
                removeSession();
            }
        };

        performLogout();
    }, [removeSession]);
}