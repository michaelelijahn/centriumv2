import { authApi } from '@/common/api';
import { useNotificationContext } from '@/common/context';
import * as yup from 'yup';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

export default function useBankRegister() {
    const [loading, setLoading] = useState(false);

    const { t } = useTranslation();
    const navigate = useNavigate();
    const { showNotification } = useNotificationContext();

    const bankSchema = yup.object().shape({
        bank_name: yup.string().required(t('Please enter bank name')),
        bank_branch: yup.string().required(t('Please enter branch name')),
        bank_address: yup.string().required(t('Please enter bank address')),
        swift_code: yup.string().optional(),
        
        account_number: yup.string()
            .required(t('Please enter account number'))
            .matches(/^[0-9]+$/, t('Account number must contain only digits')),
        account_holder_name: yup.string().required(t('Please enter account holder name'))
    });

    const registerBank = async ({ data }) => {
        setLoading(true);
        try {
            const res = await authApi.registerBank(data);
            
            if (res?.data.id) {
                showNotification({
                    message: 'Registration completed successfully!',
                    type: 'success',
                });
                navigate('/account/login');
            }
            return { success: true, data: res.data };
        } catch (e) {
            showNotification({ message: e.toString(), type: 'error' });
            return { success: false, error: e };
        } finally {
            setLoading(false);
        }
    };

    return { loading, registerBank, bankSchema };
}