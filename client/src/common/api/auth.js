import HttpClient from '../helpers/httpClient';

function AuthService() {
    return {
        // Authentication
        login: (values) => {
            return HttpClient.post('/auth/login', values);
        },
        logout() {
            return HttpClient.post('/auth/logout', {});
        },
        register: (values) => {
            return HttpClient.post('/auth/register', values);
        },
        
        // Account management
        registerBank: (values) => {
            return HttpClient.post('/bank/register', values);
        },
        changePassword: (values) => {
            return HttpClient.post('/auth/request-reset-password', values);
        },
        verifyCode: (values) => {
            return HttpClient.post('/auth/verify-code', values);
        },
        resetPassword: (values) => {
            return HttpClient.post('/auth/reset-password', values);
        },
        refresh: (values) => {
            return HttpClient.post('/auth/refresh', values);
        },
        
        // Support ticket functions for customers
        makeEnquiry: (formData) => {
            return HttpClient.post('/support/make-enquiry', formData);
        },
        getEnquiries: () => {
            return HttpClient.get('/support/tickets');
        },
        getTicketById: (ticketId) => {
            return HttpClient.get(`/support/tickets/${ticketId}`);
        },
        getAttachmentUrl: (s3Key) => {
            return HttpClient.get(`/support/attachment/url/${encodeURIComponent(s3Key)}`);
        },
        submitCustomerTicketComment: (ticketId, comment) => {
            return HttpClient.post(`/support/tickets/${ticketId}/comment`, { comment });
        },
        
        // Admin user management - updated to match backend routes
        getAllUsers: (params = {}) => {
            const queryString = new URLSearchParams(params).toString();
            return HttpClient.get(`/users${queryString ? '?' + queryString : ''}`);
        },
        getUserById: (userId) => {
            return HttpClient.get(`/users/${userId}`);
        },
        getUserTickets: (userId, params = {}) => {
            const queryString = new URLSearchParams(params).toString();
            return HttpClient.get(`/users/${userId}/tickets${queryString ? '?' + queryString : ''}`);
        },
        updateUser: (userId, userData) => {
            return HttpClient.patch(`/users/${userId}`, userData);
        },
        
        // Admin ticket management
        getAllTickets: (params = {}) => {
            const queryString = new URLSearchParams(params).toString();
            console.log("queryString: ", `/tickets${queryString ? '?' + queryString : ''}`)
            return HttpClient.get(`/tickets${queryString ? '?' + queryString : ''}`);
        },
        getAdminTicketById: (ticketId) => {
            return HttpClient.get(`/tickets/${ticketId}`);
        },
        updateTicketStatus: (ticketId, status) => {
            return HttpClient.post(`/tickets/${ticketId}/status`, { status });
        },
        submitTicketReply: (ticketId, comment) => {
            return HttpClient.post(`/tickets/${ticketId}/comment`, { comment });
        },
        
        // Trading management
        getTrades: (params = {}) => {
            const queryString = new URLSearchParams(params).toString();
            return HttpClient.get(`/trades${queryString ? '?' + queryString : ''}`);
        },
        getTradeById: (tradeId) => {
            return HttpClient.get(`/trades/${tradeId}`);
        },
        getTradeFilterOptions: () => {
            return HttpClient.get('/trades/filter-options');
        },
        uploadTradesCsv: (formData) => {
            return HttpClient.post('/trades/upload-csv', formData);
        }
    };
}

export default AuthService();