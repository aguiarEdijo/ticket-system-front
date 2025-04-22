export type TicketStatus = "pending" | "in_progress" | "completed";

export interface Ticket {
    id: string;
    title: string;
    description: string;
    deadline: string;
    status: TicketStatus;
    assignedTo?: string;
}

export type TicketFormData = Omit<Ticket, "id" | "status">;
