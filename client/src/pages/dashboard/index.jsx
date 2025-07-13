import { lazy } from 'react';
import { Outlet, Route, Routes, Navigate } from 'react-router-dom';
import { useAuthContext } from '@/common/context';

const Ecommerce = lazy(() => import('./Ecommerce'));
const Analytics = lazy(() => import('./Analytics'));
const Project = lazy(() => import('./Project'));
const CRM = lazy(() => import('./CRM'));
const EWallet = lazy(() => import('./E-Wallet'));
const AdminDashboard = lazy(() => import('./Admin'));
const TradingList = lazy(() => import('@/pages/admin/Trading/TradingList'));
const TradeDetail = lazy(() => import('@/pages/admin/Trading/TradeDetail'));
const UsersList = lazy(() => import('@/pages/admin/Users/UserList'));
const UserDetails = lazy(() => import('@/pages/admin/Users/UserDetails'));
const UserTickets = lazy(() => import('@/pages/admin/Users/UserTickets'));
const Support = lazy(() => import('./Support'));
import TicketDetail from '@/components/Ticket/TicketDetail';

export default function Dashboard() {
    const { user } = useAuthContext();
    const role = user?.role;

    if (!role) {
        // Optionally show a loader or redirect
        return <Navigate to="/account/login" replace />;
    }

    return (
        <Routes>
            {role === 'admin' ? (
                <>
                    {/* Admin dashboard routes under /dashboard/admin/* */}
                    <Route path="admin" element={<Outlet />}>
                        <Route index element={<AdminDashboard />} />
                        <Route path="ecommerce" element={<Ecommerce />} />
                        <Route path="trading" element={<TradingList />} />
                        <Route path="trading/details/:tradeId" element={<TradeDetail />} />
                        <Route path="users" element={<UsersList />} />
                        <Route path="users/:userId" element={<UserDetails />} />
                        <Route path="users/:userId/tickets" element={<UserTickets />} />
                        <Route path="tickets" element={<Support />} />
                        <Route path="tickets/:ticketId" element={<TicketDetail adminView={true} />} />
                        {/* Add more admin routes as needed */}
                        {/* Redirect any unknown /dashboard/admin/* route to /dashboard/admin */}
                        <Route path="*" element={<Navigate to="/dashboard/admin" replace />} />
                    </Route>
                </>
            ) : (
                <>
                    {/* Customer dashboard routes under /dashboard/* */}
                    <Route path="/*" element={<Outlet />}>
                        <Route index element={<Ecommerce />} />
                        <Route path="ecommerce" element={<Ecommerce />} />
                        <Route path="trading" element={<TradingList />} />
                        {/* <Route path="analytics" element={<Analytics />} />
                        <Route path="project" element={<Project />} />
                        <Route path="crm" element={<CRM />} />
                        <Route path="e-wallet" element={<EWallet />} /> */}
                        <Route path="support" element={<Support />} />
                        <Route path="tickets/:ticketId" element={<TicketDetail adminView={false} />} />
                        {/* Add more customer routes as needed */}
                        <Route path="*" element={<Navigate to="/dashboard" replace />} />
                    </Route>
                </>
            )}
        </Routes>
    );
}