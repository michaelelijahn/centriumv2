import React, { useEffect } from 'react';
import { Navigate } from 'react-router-dom';
import { useAuthContext, useNotificationContext } from '@/common';
import { PageLoader } from '@/components';

/**
 * Route wrapper that only allows users with admin role to access
 * Redirects to homepage if user is not an admin
 */
const AdminRouteWrapper = ({ children }) => {
    const { user, isAuthenticated } = useAuthContext();
    const { showNotification } = useNotificationContext();
    
    useEffect(() => {
        // If authenticated but not admin, show notification
        if (isAuthenticated && user && user.role !== 'admin') {
            showNotification({
                message: 'You do not have permission to access this page',
                type: 'error'
            });
        }
    }, [isAuthenticated, user, showNotification]);

    // Show loading spinner while we check auth status
    if (isAuthenticated === undefined) {
        return <PageLoader />;
    }

    // If not authenticated, redirect to login
    if (!isAuthenticated) {
        return <Navigate to="/account/login" replace />;
    }

    // If authenticated but not admin, redirect to home
    if (user && user.role !== 'admin') {
        return <Navigate to="/" replace />;
    }

    // User is admin, render the protected content
    return children;
};

export default AdminRouteWrapper;