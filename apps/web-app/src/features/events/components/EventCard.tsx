import { Card, Space, Tag, Typography } from "antd";
import { useNavigate } from "react-router";
import { formatDate } from "../../../shared/lib/format";
import type { Event } from "../types";

type Props = {
  event: Event;
};

export function EventCard({ event }: Props) {
  const navigate = useNavigate();
  const available = event.tiers.reduce((sum, tier) => sum + tier.available, 0);

  return (
    <Card
      hoverable
      style={{ height: "100%" }}
      onClick={() => navigate(`/events/${event.id}`)}
    >
      <Space orientation="vertical" size={4} style={{ width: "100%" }}>
        <Typography.Title level={4} style={{ margin: 0 }}>
          {event.name}
        </Typography.Title>
        <Typography.Text type="secondary">
          {formatDate(event.date)}
        </Typography.Text>
        <Typography.Text>{event.location}</Typography.Text>
        <Tag color={available > 0 ? "green" : "red"} style={{ marginTop: 8 }}>
          {available > 0 ? `${available} tickets available` : "Sold out"}
        </Tag>
      </Space>
    </Card>
  );
}
