import { lazy, Suspense } from 'react';
import { Outlet, Route, Routes } from 'react-router-dom';

const Calendar = lazy(() => import('./Calendar'));
const Chat = lazy(() => import('./Chat'));
const CRM = lazy(() => import('./crm'));
const Ecommerce = lazy(() => import('./ecommerce'));
const Email = lazy(() => import('./email'));
const Projects = lazy(() => import('./projects'));
const SocialFeed = lazy(() => import('./SocialFeed'));
const Tasks = lazy(() => import('./tasks'));
const FileManager = lazy(() => import('./FileManager'));
const Support = lazy(() => import('./Support'));
const NewEnquiry = lazy(() => import('./Support/CreateEnquiry'));
const TicketDetail = lazy(() => import('../../components/Ticket/TicketDetail'));

const LoadingComponent = () => (
    <div className="d-flex justify-content-center align-items-center" style={{ height: '100vh' }}>
        <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Loading...</span>
        </div>
    </div>
);

export default function Apps() {
    return (
        <Suspense fallback={<LoadingComponent />}>
            <Routes>
                <Route path="/" element={<Outlet />}>
                    <Route path="calendar" element={<Calendar />} />
                    <Route path="chat" element={<Chat />} />
                    <Route path="crm/*" element={<CRM />} />
                    <Route path="ecommerce/*" element={<Ecommerce />} />
                    <Route path="email/*" element={<Email />} />
                    <Route path="projects/*" element={<Projects />} />
                    <Route path="social" element={<SocialFeed />} />
                    <Route path="tasks/*" element={<Tasks />} />
                    <Route path="file" element={<FileManager />} />
                    <Route path="support" element={<Support />} />
                    <Route path="support/new-enquiry" element={<NewEnquiry />} />
                    <Route path="support/ticket/:ticketId" element={<TicketDetail />} />
                </Route>
            </Routes>
        </Suspense>
    );
}