import { Button, Descriptions, Result } from "antd";
import { Link } from "react-router";
import { formatDate, formatMoney } from "../../../shared/lib/format";
import type { Order } from "../types";
import { ReservationStatusTag } from "./ReservationSummary";

type Props = {
  order: Order;
};

export function OrderResult({ order }: Props) {
  return (
    <Result
      status="success"
      title="Order confirmed"
      subTitle={`A confirmation was issued to ${order.customer.email}.`}
      extra={
        <Link to="/">
          <Button type="primary">Browse more events</Button>
        </Link>
      }
    >
      <Descriptions bordered column={1} size="middle">
        <Descriptions.Item label="Order ID">{order.id}</Descriptions.Item>
        <Descriptions.Item label="Status">
          <ReservationStatusTag status={order.status} />
        </Descriptions.Item>
        <Descriptions.Item label="Event">{order.event.name}</Descriptions.Item>
        <Descriptions.Item label="Tier">{order.tier.name}</Descriptions.Item>
        <Descriptions.Item label="Quantity">
          {order.ticketsQuantity}
        </Descriptions.Item>
        <Descriptions.Item label="Total paid">
          <strong>{formatMoney(order.totalPrice)}</strong>
        </Descriptions.Item>
        <Descriptions.Item label="Customer">
          {order.customer.fullName} ({order.customer.email})
        </Descriptions.Item>
        <Descriptions.Item label="Confirmed at">
          {formatDate(order.createdAt)}
        </Descriptions.Item>
      </Descriptions>
    </Result>
  );
}
