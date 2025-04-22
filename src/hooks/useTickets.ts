// hooks/useTickets.ts
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { fetchTickets, createTicket, updateTicketStatus } from "../api/ticketApi";
import { Ticket } from "../types/ticket";

export const TICKETS_QUERY_KEY = ["tickets"];

export function useTickets() {
    const queryClient = useQueryClient();

    const { data, isLoading, isError, error } = useQuery<Ticket[], Error>({
        queryKey: TICKETS_QUERY_KEY,
        queryFn: fetchTickets,
        retry: 3,
        refetchOnWindowFocus: false,
    });

    const createMutation = useMutation({
        mutationFn: createTicket,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: TICKETS_QUERY_KEY });
        },
    });

    const statusMutation = useMutation({
        mutationFn: ({ id, status }: { id: string; status: Ticket["status"] }) =>
            updateTicketStatus(id, status),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: TICKETS_QUERY_KEY });
        },
    });

    return {
        tickets: data || [],
        isLoading,
        isError,
        error,
        createTicket: createMutation.mutateAsync,
        updateStatus: statusMutation.mutateAsync,
        isCreating: createMutation.isPending,
        isUpdating: statusMutation.isPending,
    };
}