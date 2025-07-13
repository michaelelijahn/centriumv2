import { Navigate } from 'react-router-dom';
import { useAuthContext } from '@/common/context';

const Root = () => {
    const { isAuthenticated } = useAuthContext();
    
    if (!isAuthenticated) {
        return <Navigate to="/account/login" replace />;
    }
    
    return <Navigate to="/dashboard/ecommerce" replace />;
};

export default Root;