import React, { lazy, Suspense } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuthContext } from '@/common/context';
import { PageLoader } from '@/components';

// Lazy load layouts
const VerticalLayout = lazy(() => import('@/layouts/Vertical'));
const DefaultLayout = lazy(() => import('@/layouts/Default'));

// Lazy load page components
const Account = lazy(() => import('@/pages/account'));

// Dashboard components
const Ecommerce = lazy(() => import('@/pages/dashboard/Ecommerce'));
const AdminDashboard = lazy(() => import('@/pages/dashboard/Admin'));
const TradingList = lazy(() => import('@/pages/dashboard/Trading/TradingList'));
const TradeDetail = lazy(() => import('@/pages/dashboard/Trading/TradeDetail'));
const UsersList = lazy(() => import('@/pages/dashboard/Users/UserList'));
const UserDetails = lazy(() => import('@/pages/dashboard/Users/UserDetails'));
const UserTickets = lazy(() => import('@/pages/dashboard/Users/UserTickets'));
const Support = lazy(() => import('@/pages/dashboard/Support'));
const CreateEnquiry = lazy(() => import('@/pages/dashboard/Support/CreateEnquiry'));
const TicketDetail = lazy(() => import('@/components/Ticket/TicketDetail'));

// Authentication Guard Component
const AuthGuard = ({ children }) => {
    const { isAuthenticated, user } = useAuthContext();
    
    if (!isAuthenticated) {
        return <Navigate to="/account/login" replace />;
    }
    
    if (!user?.role) {
        return <Navigate to="/account/login" replace />;
    }
    
    return children;
};

// Role-based Route Guard
const RoleGuard = ({ allowedRoles, children }) => {
    const { user } = useAuthContext();
    
    if (!allowedRoles.includes(user?.role)) {
        // Redirect to appropriate dashboard based on role
        const defaultRoute = user?.role === 'admin' ? '/dashboard/admin' : '/dashboard/ecommerce';
        return <Navigate to={defaultRoute} replace />;
    }
    
    return children;
};

// Root redirect component
const RootRedirect = () => {
    const { isAuthenticated, user } = useAuthContext();
    
    if (!isAuthenticated) {
        return <Navigate to="/account/login" replace />;
    }
    
    // Redirect to appropriate dashboard based on role
    const defaultRoute = user?.role === 'admin' ? '/dashboard/admin' : '/dashboard/ecommerce';
    return <Navigate to={defaultRoute} replace />;
};

const AppRoutes = () => (
    <Suspense fallback={<PageLoader />}>
        <Routes>
            {/* Root redirect */}
            <Route path="/" element={<RootRedirect />} />

            {/* Public account routes */}
            <Route path="/account/*" element={<DefaultLayout />}>
                <Route path="*" element={<Account />} />
            </Route>

            {/* Protected dashboard routes */}
            <Route path="/dashboard/*" element={
                <AuthGuard>
                    <VerticalLayout />
                </AuthGuard>
            }>
                {/* Shared routes for both roles */}
                <Route path="ecommerce" element={<Ecommerce />} />
                <Route path="tickets/:ticketId" element={
                    <TicketDetail />
                } />
                
                {/* Admin-only routes */}
                <Route path="admin" element={
                    <RoleGuard allowedRoles={['admin']}>
                        <AdminDashboard />
                    </RoleGuard>
                } />
                <Route path="admin/tickets" element={
                    <RoleGuard allowedRoles={['admin']}>
                        <Support adminView={true} />
                    </RoleGuard>
                } />
                <Route path="admin/tickets/new" element={
                    <RoleGuard allowedRoles={['admin']}>
                        <CreateEnquiry adminView={true} />
                    </RoleGuard>
                } />
                <Route path="trading" element={
                    <RoleGuard allowedRoles={['admin']}>
                        <TradingList />
                    </RoleGuard>
                } />
                <Route path="trading/:tradeId" element={
                    <RoleGuard allowedRoles={['admin']}>
                        <TradeDetail />
                    </RoleGuard>
                } />
                <Route path="users" element={
                    <RoleGuard allowedRoles={['admin']}>
                        <UsersList />
                    </RoleGuard>
                } />
                <Route path="users/:userId" element={
                    <RoleGuard allowedRoles={['admin']}>
                        <UserDetails />
                    </RoleGuard>
                } />
                <Route path="users/:userId/tickets" element={
                    <RoleGuard allowedRoles={['admin']}>
                        <UserTickets />
                    </RoleGuard>
                } />
                
                {/* Customer-only routes */}
                <Route path="support" element={
                    <RoleGuard allowedRoles={['customer']}>
                        <Support adminView={false} />
                    </RoleGuard>
                } />
                <Route path="support/new-enquiry" element={
                    <RoleGuard allowedRoles={['customer']}>
                        <CreateEnquiry adminView={false} />
                    </RoleGuard>
                } />
                
                {/* Fallback redirect */}
                <Route path="*" element={<RootRedirect />} />
            </Route>

            {/* Global fallback */}
            <Route path="*" element={<RootRedirect />} />
        </Routes>
    </Suspense>
);

export default AppRoutes; 