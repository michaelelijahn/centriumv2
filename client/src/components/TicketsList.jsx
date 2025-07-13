import React, { useEffect, useState } from 'react';
import { authApi } from '@/common';

const TicketsList = () => {
    const [tickets, setTickets] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchTickets = async () => {
            try {
                const response = await authApi.getEnquiries();
                console.log('Tickets data:', response.data);
                setTickets(response.data);
            } catch (error) {
                console.error('Error fetching tickets:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchTickets();
    }, []);

    if (loading) {
        return <div>Loading...</div>;
    }

    return (
        <div className="container">
            <h2>Tickets</h2>
            <div className="row">
                {tickets.map((ticket) => (
                    <div key={ticket.ticket_id} className="col-12 mb-4">
                        <div className="card">
                            <div className="card-body">
                                <h5 className="card-title">{ticket.subject}</h5>
                                <p className="card-text">{ticket.description}</p>
                                <p className="text-muted">Status: {ticket.status}</p>
                                {ticket.file_url && (
                                    <div className="mt-3">
                                        <h6>Attachment:</h6>
                                        {ticket.file_type?.startsWith('image/') ? (
                                            <img 
                                                src={ticket.file_url}
                                                alt="Ticket attachment"
                                                className="img-fluid"
                                                style={{ maxWidth: '300px' }}
                                            />
                                        ) : (
                                            <a 
                                                href={ticket.file_url} 
                                                target="_blank" 
                                                rel="noopener noreferrer"
                                            >
                                                Download Attachment
                                            </a>
                                        )}
                                    </div>
                                )}
                                <div className="mt-2">
                                    <small className="text-muted">
                                        Created: {new Date(ticket.created_at).toLocaleString()}
                                    </small>
                                </div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default TicketsList;