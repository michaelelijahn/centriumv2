import { Navigate } from 'react-router-dom';
import { useAuthContext } from '@/common/context';

const Root = () => {
    const { isAuthenticated, user } = useAuthContext();
    
    if (!isAuthenticated) {
        return <Navigate to="/account/login" replace />;
    }
    
    // Redirect based on user role
    if (user?.role === 'admin') {
        return <Navigate to="/dashboard/admin" replace />;
    }
    
    // Default to ecommerce for customers
    return <Navigate to="/dashboard/ecommerce" replace />;
};

export default Root;