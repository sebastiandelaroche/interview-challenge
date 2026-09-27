import { Alert, Form, Input, InputNumber, Modal, Typography } from "antd";
import { Controller, useForm, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useNavigate } from "react-router";
import { formatMoney } from "../../../shared/lib/format";
import { getErrorMessage, isConflict } from "../../../shared/api/errors";
import type { TicketTier } from "../../events/types";
import { useCreateReservationMutation } from "../api";
import { reserveSchema, type ReserveFormValues } from "../schema";

type Props = {
  eventId: string;
  tier: TicketTier;
  onClose: () => void;
  onConflict: () => void;
};

export function ReserveModal({ eventId, tier, onClose, onConflict }: Props) {
  const navigate = useNavigate();
  const [createReservation, { isLoading, error, reset }] =
    useCreateReservationMutation();

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<ReserveFormValues>({
    resolver: zodResolver(reserveSchema(tier.available)),
    defaultValues: {
      ticketsQuantity: 1,
      customerFullName: "",
      customerEmail: "",
    },
  });

  const quantity = useWatch({ control, name: "ticketsQuantity" });

  const onSubmit = async (values: ReserveFormValues) => {
    reset();
    try {
      const reservation = await createReservation({
        eventId,
        ticketTierId: tier.id,
        ...values,
      }).unwrap();
      navigate(`/reservations/${reservation.id}`);
    } catch (err) {
      if (isConflict(err as Parameters<typeof isConflict>[0])) onConflict();
    }
  };

  const errorMessage = error
    ? isConflict(error)
      ? "Not enough tickets left. Availability has been refreshed, please adjust your quantity."
      : getErrorMessage(error)
    : undefined;

  return (
    <Modal
      open
      title={`Reserve · ${tier.name}`}
      okText="Reserve"
      confirmLoading={isLoading}
      onOk={handleSubmit(onSubmit)}
      onCancel={onClose}
      destroyOnHidden
    >
      <Typography.Paragraph type="secondary">
        {formatMoney(tier.price)} each · {tier.available} available
      </Typography.Paragraph>

      {errorMessage && (
        <Alert
          showIcon
          type="error"
          title={errorMessage}
          style={{ marginBottom: 16 }}
        />
      )}

      <Form layout="vertical" onFinish={handleSubmit(onSubmit)}>
        <Form.Item
          label="Quantity"
          validateStatus={errors.ticketsQuantity ? "error" : undefined}
          help={errors.ticketsQuantity?.message}
        >
          <Controller
            name="ticketsQuantity"
            control={control}
            render={({ field }) => (
              <InputNumber
                {...field}
                min={1}
                precision={0}
                style={{ width: "100%" }}
                onChange={(value) => field.onChange(value ?? undefined)}
              />
            )}
          />
        </Form.Item>
        <Form.Item
          label="Full name"
          validateStatus={errors.customerFullName ? "error" : undefined}
          help={errors.customerFullName?.message}
        >
          <Controller
            name="customerFullName"
            control={control}
            render={({ field }) => <Input {...field} autoComplete="name" />}
          />
        </Form.Item>
        <Form.Item
          label="Email"
          validateStatus={errors.customerEmail ? "error" : undefined}
          help={errors.customerEmail?.message}
        >
          <Controller
            name="customerEmail"
            control={control}
            render={({ field }) => (
              <Input {...field} type="email" autoComplete="email" />
            )}
          />
        </Form.Item>
        <Typography.Text strong>
          Total: {formatMoney((Number(quantity) || 0) * tier.price)}
        </Typography.Text>
        <button type="submit" hidden />
      </Form>
    </Modal>
  );
}
