import { authApi } from '@/common/api';
import { useAuthContext, useNotificationContext } from '@/common/context';
import { useMemo, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import * as yup from 'yup';
import { useIpAddress } from '@/utils/useIpAddress';

export const loginFormSchema = yup.object({
	email: yup.string().email('Please enter valid email').required('Please enter email'),
	password: yup.string().required('Please enter password'),
});

export default function useLogin() {
	const [loading, setLoading] = useState(false);
	const location = useLocation();
	const navigate = useNavigate();
	const { ipAddress, loading: ipLoading } = useIpAddress();

	const { isAuthenticated, saveSession } = useAuthContext();
	const { showNotification } = useNotificationContext();

	const redirectUrl = useMemo(
		() => (location.state && location.state.from ? location.state.from.pathname : '/'),
		[location.state]
	);

	const login = async ({ data }) => {
		const { email, password } = data;
		setLoading(true);
		try {

			const res = await authApi.login({
				email,
				password,
				ipAddress,
				device_info: navigator.userAgent,
			});
	
			if (res.data) {
				saveSession({
					tokens: res.data.tokens,
					user: res.data.user
				});
				navigate(redirectUrl);
			}
		} catch (error) {
			showNotification({ message: error.toString(), type: 'error' });
		} finally {
			setLoading(false);
		}
	};

	return { loading, login, redirectUrl, isAuthenticated };
}

