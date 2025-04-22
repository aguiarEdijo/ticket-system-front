import { Ticket } from '../types/ticket';
import api from './api';


export const fetchTickets = async (): Promise<Ticket[]> => {
    const response = await api.get('/tickets');
    return response.data;
};

export const createTicket = async (ticketData: Omit<Ticket, "id" | "status">): Promise<Ticket> => {
    const response = await api.post('/tickets', ticketData);
    return response.data;
};

export const updateTicketStatus = async (id: string, status: Ticket["status"]): Promise<Ticket> => {
    const response = await api.patch(`/tickets/${id}/status`, { status });
    return response.data;
};