import { useState, useEffect } from 'react';

export const useIpAddress = () => {
    const [ipAddress, setIpAddress] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const getIp = async () => {
            try {
                const response = await fetch('https://api.ipify.org?format=json');
                const data = await response.json();
                setIpAddress(data.ip);
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        getIp();
    }, []);

    return { ipAddress, loading, error };
};