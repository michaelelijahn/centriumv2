import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { authApi } from '@/common/api';
import { useAuthContext, useNotificationContext } from '@/common/context';
import createPasswordSchema, { usePasswordValidation } from '@/utils/passwordValidation';

export default function useRegister() {
    const [loading, setLoading] = useState(false);
    const { t } = useTranslation();
    const { isAuthenticated } = useAuthContext();
    const { showNotification } = useNotificationContext();
    const { validatePassword } = usePasswordValidation();
    
    const schema = createPasswordSchema(t);

    const register = async ({ data }) => {
        const { first_name, last_name, email, phone, password, salt, ip_address, device_info } = data;
        setLoading(true);
        
        try {
            const res = await authApi.register({
                first_name,
                last_name,
                email,
                phone,
                password,
                salt,
                ip_address,
                device_info,
            });
            
            return { success: true, data: res.data };
        } catch (e) {
            showNotification({ message: e.toString(), type: 'error' });
            return { success: false, error: e };
        } finally {
            setLoading(false);
        }
    };

    return { loading, register, isAuthenticated, schema, validatePassword };
}