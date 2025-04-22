import { Ticket } from "../types/ticket";

export const mockTickets: Ticket[] = [
    {
        id: "1",
        title: "Corrigir bug de login",
        description: "Usuários não conseguem logar com e-mail",
        deadline: "2025-04-25T23:59:59Z",
        status: "in_progress",
        assignedTo: "joao",
    },
    {
        id: "2",
        title: "Criar endpoint de tickets",
        description: "Backend precisa expor os dados dos tickets",
        deadline: "2025-04-28T23:59:59Z",
        status: "pending",
        assignedTo: "maria",
    },
    {
        id: "3",
        title: "Setup de CI/CD",
        description: "Configurar deploy automatizado com Docker",
        deadline: "2025-05-01T23:59:59Z",
        status: "completed",
        assignedTo: "carlos",
    },
];
