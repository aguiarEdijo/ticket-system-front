import React from "react";
import { Controller, useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import {
    Input,
    Button,
    DatePicker,
    Form,
    Select,
    notification,
    Typography,
    Card,
    Row,
    Col
} from "antd";
import { useMutation } from "@tanstack/react-query";
import { createTicket } from "../../api/ticketApi";
import { useQueryClient } from "@tanstack/react-query";
import { TICKETS_QUERY_KEY } from "../../hooks/useTickets";
import dayjs from "dayjs";

const { TextArea } = Input;
const { Title } = Typography;

const ticketSchema = z.object({
    title: z.string().min(1, "Title is required"),
    description: z.string().min(1, "Description is required"),
    deadline: z.string().refine((val) => dayjs(val).isValid(), "Invalid date"),
    assignedTo: z.string().optional(),
});

type TicketFormData = z.infer<typeof ticketSchema>;

export function TicketForm() {
    const {
        control,
        handleSubmit,
        formState: { errors },
        reset,
    } = useForm<TicketFormData>({
        resolver: zodResolver(ticketSchema),
        mode: "onChange",
    });

    const queryClient = useQueryClient();

    const mutation = useMutation({
        mutationFn: createTicket,
        onSuccess: () => {
            notification.success({
                message: "Ticket Created",
                description: "Ticket was created successfully",
            });
            reset({
                title: '',
                description: '',
                deadline: '',
                assignedTo: undefined
            });
            queryClient.invalidateQueries({ queryKey: TICKETS_QUERY_KEY });
        },
        onError: (error: Error) => {
            notification.error({
                message: "Creation Error",
                description: error.message,
            });
        },
    });

    const onSubmit = (data: TicketFormData) => {
        mutation.mutate(data);
    };

    return (
        <div style={{
            display: 'flex',
            justifyContent: 'center',
            padding: '24px',
        }}>
            <Card
                title={
                    <Title
                        level={3}
                        style={{
                            margin: 0,
                            color: '#1d1d1d',
                            fontWeight: 600
                        }}
                    >
                        Create New Ticket
                    </Title>
                }
                bordered
                headStyle={{
                    borderBottom: '1px solid #e8e8e8',
                    padding: '0 24px'
                }}
                style={{
                    width: '100%',
                    maxWidth: '800px',
                    boxShadow: '0 3px 6px rgba(0, 0, 0, 0.1)',
                    borderRadius: '8px',
                    backgroundColor: '#ffffff'
                }}
            >
                <Form
                    layout="vertical"
                    onFinish={handleSubmit(onSubmit)}
                    style={{ padding: '24px' }}
                >
                    {/* Title Field */}
                    <Form.Item
                        label={<span style={{ fontWeight: 500 }}>Title</span>}
                        required
                        validateStatus={errors.title ? "error" : ""}
                        help={errors.title?.message}
                    >
                        <Controller
                            name="title"
                            control={control}
                            render={({ field }) => (
                                <Input
                                    {...field}
                                    placeholder="Enter ticket title"
                                    status={errors.title ? "error" : ""}
                                    style={{ borderRadius: '6px' }}
                                />
                            )}
                        />
                    </Form.Item>

                    {/* Description Field */}
                    <Form.Item
                        label={<span style={{ fontWeight: 500 }}>Description</span>}
                        required
                        validateStatus={errors.description ? "error" : ""}
                        help={errors.description?.message}
                    >
                        <Controller
                            name="description"
                            control={control}
                            render={({ field }) => (
                                <TextArea
                                    {...field}
                                    rows={4}
                                    placeholder="Enter detailed description"
                                    status={errors.description ? "error" : ""}
                                    style={{ borderRadius: '6px' }}
                                />
                            )}
                        />
                    </Form.Item>

                    {/* Deadline and Assigned To Row */}
                    <Row gutter={24}>
                        <Col xs={24} md={12}>
                            <Form.Item
                                label={<span style={{ fontWeight: 500 }}>Deadline</span>}
                                required
                                validateStatus={errors.deadline ? "error" : ""}
                                help={errors.deadline?.message}
                            >
                                <Controller
                                    name="deadline"
                                    control={control}
                                    render={({ field }) => (
                                        <DatePicker
                                            {...field}
                                            value={field.value ? dayjs(field.value) : null}
                                            onChange={(date) => field.onChange(date?.format("YYYY-MM-DD"))}
                                            style={{
                                                width: "100%",
                                                borderRadius: '6px'
                                            }}
                                            format="YYYY-MM-DD"
                                            disabledDate={(current) => current && current < dayjs().startOf("day")}
                                            status={errors.deadline ? "error" : ""}
                                        />
                                    )}
                                />
                            </Form.Item>
                        </Col>

                        <Col xs={24} md={12}>
                            <Form.Item
                                label={<span style={{ fontWeight: 500 }}>Assigned Team Member </span>}
                            >
                                <Controller
                                    name="assignedTo"
                                    control={control}
                                    render={({ field }) => (
                                        <Select
                                            {...field}
                                            placeholder="Select team member"
                                            allowClear
                                            style={{ borderRadius: '6px' }}
                                            options={[
                                                { value: "John (Frontend)", label: "John (Frontend)" },
                                                { value: "Mary (Backend)", label: "Mary (Backend)" },
                                                { value: "Carlos (DevOps)", label: "Carlos (DevOps)" },
                                            ]}
                                        />
                                    )}
                                />
                            </Form.Item>
                        </Col>
                    </Row>

                    <Form.Item style={{ marginTop: '32px' }}>
                        <Button
                            type="primary"
                            htmlType="submit"
                            loading={mutation.isPending}
                            disabled={mutation.isPending || Object.keys(errors).length > 0}
                            block
                            size="large"
                            style={{
                                height: '48px',
                                fontSize: '16px',
                                fontWeight: 600,
                                borderRadius: '6px'
                            }}
                        >
                            {mutation.isPending ? "Creating..." : "Create Ticket"}
                        </Button>
                    </Form.Item>
                </Form>
            </Card>
        </div>
    );
}