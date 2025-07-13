import AppRoutes from '@/routes';
import { AuthProvider, NotificationProvider, ThemeProvider } from '@/common/context';

// For Saas import Saas.scss
import './assets/scss/Saas.scss';

const App = () => {
	return (
		<ThemeProvider>
			<NotificationProvider>
				<AuthProvider>
					<AppRoutes />
				</AuthProvider>
			</NotificationProvider>
		</ThemeProvider>
	);
};

export default App;

