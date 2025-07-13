import React, { lazy, Suspense } from 'react';
import { Routes, Route } from 'react-router-dom';
import { PageLoader } from '@/components';
import { useAuthContext } from '@/common/context';
import Root from './Root';

const VerticalLayout = lazy(() => import('@/layouts/Vertical'));
const DefaultLayout = lazy(() => import('@/layouts/Default'));

const Account = lazy(() => import('@/pages/account'));
const Dashboard = lazy(() => import('@/pages/dashboard'));
const Apps = lazy(() => import('@/pages/apps'));

// Protected route component
const ProtectedRoute = ({ children }) => {
    const { isAuthenticated } = useAuthContext();
    if (!isAuthenticated) {
        return <Root />;
    }
    return children;
};

const AppRoutes = () => (
    <Suspense fallback={<PageLoader />}>
        <Routes>
            {/* Root path and fallback - always redirect using Root */}
            <Route path="/" element={<Root />} />

            {/* Account routes (login, register, etc.) */}
            <Route path="/account/*" element={<DefaultLayout />}>
                <Route path="*" element={<Account />} />
            </Route>

            {/* Dashboard routes - protected */}
            <Route path="/dashboard/*" element={
                <ProtectedRoute>
                    <VerticalLayout />
                </ProtectedRoute>
            }>
                <Route path="*" element={<Dashboard />} />
            </Route>

            {/* Apps routes - protected
            <Route path="/apps/*" element={
                <ProtectedRoute>
                    <VerticalLayout />
                </ProtectedRoute>
            }>
                <Route path="*" element={<Apps />} />
            </Route> */}

            {/* Fallback route - always redirect using Root */}
            <Route path="*" element={<Root />} />
        </Routes>
    </Suspense>
);

export default AppRoutes;