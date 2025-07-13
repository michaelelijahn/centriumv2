import { useState } from 'react';
import { authApi } from '@/common';

const useGetEnquiries = () => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const getEnquiries = async () => {
        setLoading(true);
        setError(null);
        
        try {
            console.log('Fetching user enquiries');
            const response = await authApi.getEnquiries();
            console.log('Enquiries response:', response);
            
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
    };

    return {
        loading,
        error,
        getEnquiries
    };
};

export default useGetEnquiries;