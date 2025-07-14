import { useState, useCallback } from 'react';
import { authApi } from '@/common';

const useGetEnquiries = () => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const getEnquiries = useCallback(async () => {
        setLoading(true);
        setError(null);
        
        try {
            const response = await authApi.getEnquiries();
            
            if (response?.success && response.data) {
                return response.data;
            } else if (response?.status === 'success' && response.data) {
                return response.data;
            } else {
                console.error('Invalid response format:', response);
                setError('Received an invalid response format from the server');
                return [];
            }
        } catch (err) {
            console.error('Error fetching enquiries:', err);
            setError(err.toString());
            return [];
        } finally {
            setLoading(false);
        }
    }, []); // Empty dependency array since this function doesn't depend on any props or state

    return {
        loading,
        error,
        getEnquiries
    };
};

export default useGetEnquiries;