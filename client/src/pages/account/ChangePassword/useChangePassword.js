import { authApi } from '@/common/api';
import { useNotificationContext } from '@/common/context';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import * as yup from 'yup';

export const changePasswordSchema = yup.object({
    email: yup.string().email('Please enter valid email').required('Please enter email'),
});

export default function useChangePassword() {
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();
    const { showNotification } = useNotificationContext();

    const changePassword = async ({ data }) => {
        setLoading(true);
        try {
            
            const res = await authApi.changePassword({
                email: data.email
            });

            if (res.status === 'success') {
                showNotification({ message: res.message, type: 'success' });
                if (res.token) {
                    navigate(`/account/verify-reset?token=${res.token}`);
                }
            } else {
                throw new Error(res.message || 'Something went wrong');
            }
        } catch (error) {
            showNotification({ message: error.toString(), type: 'error' });
            throw error;
        } finally {
            setLoading(false);
        }
    };

    return { loading, changePassword };
}