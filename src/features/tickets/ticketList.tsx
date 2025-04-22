import React from "react";
import { Card, Tag, List, Typography, Spin, message, Empty, Select, Space } from "antd";
import { useTickets } from "../../hooks/useTickets";
import { Ticket } from "../../types/ticket";
import dayjs from "dayjs";
import { useState } from "react";
import { LoadingOutlined } from "@ant-design/icons";

const statusColors: Record<Ticket["status"], string> = {
    pending: "orange",
    in_progress: "blue",
    completed: "green",
};

export function TicketList() {
    const { tickets, isLoading, isError, error, updateStatus, isUpdating } = useTickets();
    const [editingId, setEditingId] = useState<string | null>(null);
    const [optimisticStatuses, setOptimisticStatuses] = useState<Record<string, Ticket["status"]>>({});

    const handleStatusChange = async (id: string, status: Ticket["status"]) => {
        const currentStatus = tickets.find(t => t.id === id)?.status || "pending";
        setEditingId(id);

        try {
            // Optimistic update
            setOptimisticStatuses(prev => ({ ...prev, [id]: status }));

            await updateStatus({ id, status });
            message.success("Status updated successfully!");
        } catch (err) {
            // Revert on error
            setOptimisticStatuses(prev => ({ ...prev, [id]: currentStatus }));
            message.error("Failed to update status");
        } finally {
            setEditingId(null);
        }
    };

    const getDisplayStatus = (ticket: Ticket) => {
        return optimisticStatuses[ticket.id] || ticket.status;
    };

    if (isLoading) {
        return (
            <div style={{ display: "flex", justifyContent: "center", padding: "2rem" }}>
                <Spin tip="Loading tickets..." size="large" />
            </div>
        );
    }

    if (isError) {
        message.error(error?.message || "Error loading tickets");
        return <Empty description="Failed to load tickets" />;
    }

    return (
        <div style={{ marginTop: "2rem" }}>
            <Typography.Title level={3} style={{ marginBottom: "1.5rem" }}>
                Tickets
            </Typography.Title>

            <List
                grid={{ gutter: 16, column: 1 }}
                dataSource={tickets}
                locale={{ emptyText: <Empty description="No tickets found" /> }}
                renderItem={(ticket) => {
                    const isBeingUpdated = editingId === ticket.id && isUpdating;
                    const displayStatus = getDisplayStatus(ticket);

                    return (
                        <List.Item>
                            <Card
                                title={ticket.title}
                                extra={
                                    <Space>
                                        {isBeingUpdated && (
                                            <Spin indicator={<LoadingOutlined style={{ fontSize: 16 }} spin />} />
                                        )}
                                        {editingId === ticket.id ? (
                                            <Select
                                                value={displayStatus}
                                                onChange={(value) => handleStatusChange(ticket.id, value)}
                                                loading={isUpdating}
                                                autoFocus
                                                disabled={isUpdating}
                                                options={[
                                                    { value: "pending", label: "Pending" },
                                                    { value: "in_progress", label: "In Progress" },
                                                    { value: "completed", label: "Completed" },
                                                ]}
                                                style={{ width: 140 }}
                                                onBlur={() => !isUpdating && setEditingId(null)}
                                            />
                                        ) : (
                                            <Tag
                                                color={statusColors[displayStatus]}
                                                style={{
                                                    textTransform: "capitalize",
                                                    cursor: isUpdating ? "not-allowed" : "pointer",
                                                    marginRight: 0,
                                                    opacity: isUpdating ? 0.7 : 1,
                                                }}
                                                onClick={() => !isUpdating && setEditingId(ticket.id)}
                                            >
                                                {displayStatus.replace("_", " ")}
                                            </Tag>
                                        )}
                                    </Space>
                                }
                                hoverable={!isUpdating}
                                style={{
                                    opacity: isBeingUpdated ? 0.9 : 1,
                                    transition: "opacity 0.2s ease",
                                }}
                                loading={isBeingUpdated}
                            >
                                <p>
                                    <strong>Description:</strong> {ticket.description}
                                </p>
                                <p>
                                    <strong>Deadline:</strong>{" "}
                                    {dayjs(ticket.deadline).isValid()
                                        ? dayjs(ticket.deadline).format("MMMM D, YYYY")
                                        : "No deadline set"}
                                </p>
                                {ticket.assignedTo && (
                                    <p>
                                        <strong>Assigned to:</strong>{" "}
                                        <Tag color="geekblue">{ticket.assignedTo}</Tag>
                                    </p>
                                )}
                            </Card>
                        </List.Item>
                    );
                }}
            />
        </div>
    );
}