import { Descriptions, Tag } from "antd";
import { formatDate, formatMoney } from "../../../shared/lib/format";
import type { Reservation, ReservationStatus } from "../types";

const statusColor: Record<ReservationStatus, string> = {
  "on-hold": "processing",
  confirmed: "success",
  expired: "default",
  cancelled: "error",
};

export function ReservationStatusTag({
  status,
}: {
  status: ReservationStatus;
}) {
  return (
    <Tag color={statusColor[status]}>
      {status.replace("-", " ").toUpperCase()}
    </Tag>
  );
}

type Props = {
  reservation: Reservation;
  status: ReservationStatus;
};

export function ReservationSummary({ reservation, status }: Props) {
  return (
    <Descriptions bordered column={1} size="middle">
      <Descriptions.Item label="Reservation ID">
        {reservation.id}
      </Descriptions.Item>
      <Descriptions.Item label="Status">
        <ReservationStatusTag status={status} />
      </Descriptions.Item>
      <Descriptions.Item label="Event">
        {reservation.event.name}
      </Descriptions.Item>
      <Descriptions.Item label="Tier">
        {reservation.tier.name} · {formatMoney(reservation.tier.unitPrice)} each
      </Descriptions.Item>
      <Descriptions.Item label="Quantity">
        {reservation.ticketsQuantity}
      </Descriptions.Item>
      <Descriptions.Item label="Total price">
        <strong>{formatMoney(reservation.totalPrice)}</strong>
      </Descriptions.Item>
      <Descriptions.Item label="Customer">
        {reservation.customer.fullName} ({reservation.customer.email})
      </Descriptions.Item>
      {status === "on-hold" && (
        <Descriptions.Item label="Hold expires">
          {formatDate(reservation.expiresAt)}
        </Descriptions.Item>
      )}
    </Descriptions>
  );
}
